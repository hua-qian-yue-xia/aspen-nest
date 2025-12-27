import { Injectable, UnauthorizedException, Logger, Global } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { JwtService } from "@nestjs/jwt"

import * as ms from "ms"
import * as dayjs from "dayjs"
import * as _ from "radash"

import { BaseUser, RedisTool, exception } from "@aspen/aspen-core"

import { JwtError } from "./common/error"
import { GenerateTokenBO, JwtUserPayloadBO, LoginUserInfoBO } from "../BO/jwt-bo"

type GenerateTokenOptions = {
	/**
	 * 平台
	 * @default admin
	 */
	platform?: string
}

@Global()
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
	override async validate(payload: JwtUserPayloadBO) {
		const redisKey = payload.getRedisKey()
		const userJson = await this.redisTool.get(redisKey)
		if (_.isEmpty(userJson)) {
			throw new UnauthorizedException("登录已过期，请重新登录")
		}
		const loginUserInfo = JSON.parse(userJson) as LoginUserInfoBO
		return loginUserInfo.baseUser
	}

	/**
	 * 刷新token
	 */
	async refreshToken(refreshToken: string): Promise<GenerateTokenBO> {
		// 1. 校验refreshToken是否有效
		try {
			await this.jwtService.verifyAsync(refreshToken)
		} catch (error) {
			throw new UnauthorizedException("无效的刷新令牌")
		}

		// 2. 解析payload并校验Redis中的数据
		const payload = this.parsePayload(refreshToken)
		const redisKey = payload.getRedisKey()
		const userJson = await this.redisTool.get(redisKey)
		if (_.isEmpty(userJson)) {
			throw new UnauthorizedException("登录已过期,请重新登录")
		}

		// 3. 校验refreshToken是否匹配
		const loginUserInfo = JSON.parse(userJson) as LoginUserInfoBO
		if (loginUserInfo.refreshToken !== refreshToken) {
			throw new UnauthorizedException("刷新令牌不匹配")
		}

		// 4. 生成新的accessToken
		const { accessExpiresIn: expiresIn } = this.config.get<GlobalConfig.JwtConfig>("jwt")
		const accessTokenExpiresInSecond = Math.floor(ms(expiresIn) / 1000)
		const accessTokenExpiresTime = dayjs().add(accessTokenExpiresInSecond, "second").format("YYYY-MM-DD HH:mm:ss")

		// 复用原有的payload信息（保持uuid不变）
		const newPayload: JwtUserPayloadBO = JwtUserPayloadBO.generatePayload(payload.uniqueCode, payload.platform)
		const newAccessToken = this.jwtService.sign(newPayload, { expiresIn })

		// 5. 更新Redis中的accessToken信息
		loginUserInfo.accessToken = newAccessToken
		loginUserInfo.accessTokenExpiresIn = accessTokenExpiresInSecond
		loginUserInfo.accessExpiresTime = accessTokenExpiresTime

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
	async generateToken(baseUser: BaseUser, options?: GenerateTokenOptions): Promise<GenerateTokenBO> {
		const { platform = "admin" } = options || {}
		const { accessExpiresIn: expiresIn, refreshExpiresIn } = this.config.get<GlobalConfig.JwtConfig>("jwt")

		// accessToken过期时间
		const accessTokenExpiresInSecond = Math.floor(ms(expiresIn) / 1000)
		const accessTokenExpiresTime = dayjs().add(accessTokenExpiresInSecond, "second").format("YYYY-MM-DD HH:mm:ss")

		// refreshToken过期时间
		const refreshTokenExpiresInSecond = Math.floor(ms(refreshExpiresIn) / 1000)
		const refreshTokenExpiresTime = dayjs().add(refreshTokenExpiresInSecond, "second").format("YYYY-MM-DD HH:mm:ss")

		const payload = JwtUserPayloadBO.generatePayload(baseUser.userId, platform)
		const payloadObj = payload.toObj()

		const accessToken = this.jwtService.sign(payloadObj, { expiresIn })
		const refreshToken = this.jwtService.sign(payloadObj, { expiresIn: refreshExpiresIn })

		// 存入redis，使用 refreshToken 的过期时间
		const redisKey = payload.getRedisKey()
		const loginUserInfo: LoginUserInfoBO = {
			baseUser: baseUser.toObj() as any,
			accessToken,
			accessTokenExpiresIn: accessTokenExpiresInSecond,
			accessExpiresTime: accessTokenExpiresTime,
			refreshToken,
			refreshTokenExpiresIn: refreshTokenExpiresInSecond,
			refreshTokenExpiresTime: refreshTokenExpiresTime,
		}
		await this.redisTool.set(redisKey, JSON.stringify(loginUserInfo), refreshTokenExpiresInSecond)

		return {
			accessToken,
			accessTokenExpiresIn: accessTokenExpiresInSecond,
			accessExpiresTime: accessTokenExpiresTime,
			refreshToken,
			refreshTokenExpiresIn: refreshTokenExpiresInSecond,
			refreshTokenExpiresTime: refreshTokenExpiresTime,
		}
	}

	/**
	 * 移除token
	 */
	async removeByAccessToken(accessToken: string) {
		// 1. 校验accessToken是否有效
		try {
			await this.jwtService.verifyAsync(accessToken)
		} catch (error) {
			this.logger.error(`校验accessToken失败accessToken:${accessToken},error:${error}`)
			return
		}
		// 2. 解析payload并校验Redis中的数据
		const payload = this.parsePayload(accessToken)
		const redisKey = payload.getRedisKey()
		await this.redisTool.del(redisKey)
	}

	/**
	 * 根据accessToken获取用户信息
	 */
	async getUserByAccessToken(accessToken: string): Promise<LoginUserInfoBO | null> {
		// 1. 校验accessToken是否有效
		try {
			await this.jwtService.verifyAsync(accessToken)
		} catch (error) {
			this.logger.error(`校验accessToken失败accessToken:${accessToken},error:${error}`)
			return null
		}
		// 2. 解析payload并校验Redis中的数据
		const payload = this.parsePayload(accessToken)
		const redisKey = payload.getRedisKey()
		const userJson = await this.redisTool.get(redisKey)
		if (_.isEmpty(userJson)) {
			this.logger.error(`校验accessToken失败accessToken:${accessToken},error:redisKey不存在`)
			return null
		}
		return JSON.parse(userJson) as LoginUserInfoBO
	}

	/**
	 * 解析payload
	 */
	parsePayload(token: string): JwtUserPayloadBO {
		const obj = this.jwtService.decode<JwtUserPayloadBO>(token)
		return JwtUserPayloadBO.objToClass(obj)
	}
}
