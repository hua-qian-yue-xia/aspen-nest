import * as crypto from "crypto"

import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { JwtService } from "@nestjs/jwt"

import * as ms from "ms"
import dayjs from "dayjs"
import * as _ from "radash"

import { JwtConfig, BaseUser, RedisTool, exception } from "@aspen/aspen-core"

import { JwtError } from "./common/error"

type JwtUserPayload = {
	uuid: string
	userId: string
	platform: string
}

type GenerateTokenOptions = {
	/**
	 * 平台
	 * @default admin
	 */
	platform?: string
}

type GenerateTokenVo = {
	/**
	 * token
	 */
	token: string
	/**
	 * 过期时间（秒）
	 */
	expiresIn: number
	/**
	 * 过期时间
	 * YYYY-MM-DD HH:mm:ss 格式
	 */
	expiresTime: string
}

type LoginUserInfo = {
	baseUser: BaseUser
} & GenerateTokenVo

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly config: ConfigService,
		private readonly jwtService: JwtService,
		private readonly redisTool: RedisTool,
	) {
		const { secret } = config.get<JwtConfig>("jwt")
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
	override async validate(payload: any) {
		return { userId: payload.sub, username: payload.username }
	}

	/**
	 * 生成token
	 */
	async generateToken(baseUser: BaseUser, options?: GenerateTokenOptions): Promise<GenerateTokenVo> {
		const { platform = "admin" } = options || {}
		const { expiresIn } = this.config.get<JwtConfig>("jwt")
		// 过期时间秒
		const expiresInSecond = Math.floor(ms(expiresIn) / 1000)
		const expiresInTime = dayjs().add(expiresInSecond, "second").format("YYYY-MM-DD HH:mm:ss")
		const payload = this.generatePayload(baseUser, platform)
		const token = this.jwtService.sign(payload)
		// 存入redis
		const redisKey = `auth:${platform}:${baseUser.userId}-${payload}`
		const loginUserInfo: LoginUserInfo = {
			baseUser,
			token,
			expiresIn: expiresInSecond,
			expiresTime: expiresInTime,
		}
		await this.redisTool.set(redisKey, JSON.stringify(loginUserInfo), expiresInSecond)
		return {
			token,
			expiresIn: expiresInSecond,
			expiresTime: expiresInTime,
		}
	}

	/**
	 * 生成payload
	 */
	private generatePayload(baseUser: BaseUser, platform: string): string {
		const userPayload: JwtUserPayload = {
			uuid: crypto.randomUUID(),
			userId: String(baseUser.userId),
			platform: platform,
		}
		return `${userPayload.userId}|${userPayload.uuid}|${userPayload.platform}`
	}

	/**
	 * 解析payload
	 */
	parsePayload(payload: string): JwtUserPayload {
		const [userId, uuid, platform] = payload.split("|")
		return { userId, uuid, platform }
	}
}
