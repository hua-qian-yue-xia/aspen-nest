import * as crypto from "crypto"

import { Injectable, UnauthorizedException, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { JwtService } from "@nestjs/jwt"

import * as ms from "ms"
import dayjs from "dayjs"
import * as _ from "radash"

import { BaseUser, RedisTool, exception } from "@aspen/aspen-core"

import { JwtError } from "./common/error"

type JwtUserPayload = {
	sub: string
	uuid: string
	platform: string
	username?: string
}

type GenerateTokenOptions = {
	/**
	 * 平台
	 * @default admin
	 */
	platform?: string
}

export type GenerateTokenVo = {
	/**
	 * accessToken
	 */
	accessToken: string
	/**
	 * accessToken 过期时间（秒）
	 */
	accessTokenExpiresIn: number
	/**
	 * accessToken 过期时间
	 * YYYY-MM-DD HH:mm:ss 格式
	 */
	expiresTime: string
	/**
	 * refreshToken
	 */
	refreshToken: string
	/**
	 * refreshToken 过期时间（秒）
	 */
	refreshTokenExpiresIn: number
	/**
	 * refreshToken 过期时间
	 * YYYY-MM-DD HH:mm:ss 格式
	 */
	refreshTokenExpiresTime: string
}

type LoginUserInfo = {
	baseUser: BaseUser
} & GenerateTokenVo

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	private readonly logger = new Logger(JwtStrategy.name)

	constructor(
		private readonly config: ConfigService,
		private readonly jwtService: JwtService,
		private readonly redisTool: RedisTool,
	) {
		const { secret } = config.get<GlobalConfig.JwtConfig>("jwt")
		// ymal配置jwt.secret为空
		if (_.isEmpty(secret)) throw new exception.core(JwtError.JWT_SECRET_NOT_FOUND)
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: secret,
		})
	}

	/**
	 * 校验用户token
	 */
	override async validate(payload: JwtUserPayload) {
		const redisKey = `auth:${payload.platform}:${payload.sub}-${payload.uuid}`
		const userJson = await this.redisTool.get(redisKey)
		if (_.isEmpty(userJson)) {
			throw new UnauthorizedException("登录已过期，请重新登录")
		}
		const loginUserInfo = JSON.parse(userJson) as LoginUserInfo
		return loginUserInfo.baseUser
	}

	/**
	 * 刷新token
	 */
	async refreshToken(refreshToken: string): Promise<GenerateTokenVo> {
		// 1. 校验refreshToken是否有效
		try {
			await this.jwtService.verifyAsync(refreshToken)
		} catch (error) {
			throw new UnauthorizedException("无效的刷新令牌")
		}

		// 2. 解析payload并校验Redis中的数据
		const payload = this.parsePayload(refreshToken)
		const redisKey = `auth:${payload.platform}:${payload.sub}-${payload.uuid}`
		const userJson = await this.redisTool.get(redisKey)
		if (_.isEmpty(userJson)) {
			throw new UnauthorizedException("登录已过期,请重新登录")
		}

		// 3. 校验refreshToken是否匹配
		const loginUserInfo = JSON.parse(userJson) as LoginUserInfo
		if (loginUserInfo.refreshToken !== refreshToken) {
			throw new UnauthorizedException("刷新令牌不匹配")
		}

		// 4. 生成新的accessToken
		const { accessExpiresIn: expiresIn } = this.config.get<GlobalConfig.JwtConfig>("jwt")
		const accessTokenExpiresInSecond = Math.floor(ms(expiresIn) / 1000)
		const accessTokenExpiresTime = dayjs().add(accessTokenExpiresInSecond, "second").format("YYYY-MM-DD HH:mm:ss")

		// 复用原有的payload信息（保持uuid不变）
		const newPayload: JwtUserPayload = {
			sub: payload.sub,
			uuid: payload.uuid,
			platform: payload.platform,
			username: payload.username,
		}
		const newAccessToken = this.jwtService.sign(newPayload, { expiresIn })

		// 5. 更新Redis中的accessToken信息
		loginUserInfo.accessToken = newAccessToken
		loginUserInfo.accessTokenExpiresIn = accessTokenExpiresInSecond
		loginUserInfo.expiresTime = accessTokenExpiresTime

		// 计算refreshToken剩余有效期
		const currentTimestamp = Math.floor(Date.now() / 1000)
		const decoded = this.jwtService.decode(refreshToken) as any
		const ttl = decoded.exp - currentTimestamp

		if (ttl > 0) {
			await this.redisTool.set(redisKey, JSON.stringify(loginUserInfo), ttl)
		} else {
			throw new UnauthorizedException("刷新令牌已过期")
		}

		return {
			...loginUserInfo,
		}
	}

	/**
	 * 校验accessToken是否有效
	 */
	async checkLoginByAccessToken(accessToken: string): Promise<boolean> {
		try {
			await this.jwtService.verifyAsync(accessToken)
			return true
		} catch (error) {
			this.logger.error(`校验accessToken失败accessToken:${accessToken},error:${error}`)
			return false
		}
	}

	/**
	 * 生成token
	 */
	async generateToken(baseUser: BaseUser, options?: GenerateTokenOptions): Promise<GenerateTokenVo> {
		const { platform = "admin" } = options || {}
		const { accessExpiresIn: expiresIn, refreshExpiresIn } = this.config.get<GlobalConfig.JwtConfig>("jwt")

		// accessToken过期时间
		const accessTokenExpiresInSecond = Math.floor(ms(expiresIn) / 1000)
		const accessTokenExpiresTime = dayjs().add(accessTokenExpiresInSecond, "second").format("YYYY-MM-DD HH:mm:ss")

		// refreshToken过期时间
		const refreshTokenExpiresInSecond = Math.floor(ms(refreshExpiresIn) / 1000)
		const refreshTokenExpiresTime = dayjs().add(refreshTokenExpiresInSecond, "second").format("YYYY-MM-DD HH:mm:ss")

		const payload = this.generatePayload(baseUser, platform)

		const accessToken = this.jwtService.sign(payload, { expiresIn })
		const refreshToken = this.jwtService.sign(payload, { expiresIn: refreshExpiresIn })

		// 存入redis，使用 refreshToken 的过期时间
		const redisKey = `auth:${platform}:${baseUser.userId}-${payload.uuid}`
		const loginUserInfo: LoginUserInfo = {
			baseUser,
			accessToken,
			accessTokenExpiresIn: accessTokenExpiresInSecond,
			expiresTime: accessTokenExpiresTime,
			refreshToken,
			refreshTokenExpiresIn: refreshTokenExpiresInSecond,
			refreshTokenExpiresTime: refreshTokenExpiresTime,
		}
		await this.redisTool.set(redisKey, JSON.stringify(loginUserInfo), refreshTokenExpiresInSecond)

		return {
			accessToken,
			accessTokenExpiresIn: accessTokenExpiresInSecond,
			expiresTime: accessTokenExpiresTime,
			refreshToken,
			refreshTokenExpiresIn: refreshTokenExpiresInSecond,
			refreshTokenExpiresTime: refreshTokenExpiresTime,
		}
	}

	/**
	 * 生成payload
	 */
	private generatePayload(baseUser: BaseUser, platform: string): JwtUserPayload {
		return {
			sub: String(baseUser.userId),
			uuid: crypto.randomUUID(),
			platform,
			username: baseUser.username,
		}
	}

	/**
	 * 解析payload
	 */
	parsePayload(token: string): JwtUserPayload {
		return this.jwtService.decode(token) as JwtUserPayload
	}
}
