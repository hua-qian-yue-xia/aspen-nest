import * as crypto from "crypto"

import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { JwtService } from "@nestjs/jwt"

import * as _ from "radash"

import { JwtConfig, BaseUser, RedisTool, exception } from "@aspen/aspen-core"

import { JwtError } from "./common/error"

type JwtUserPayload = {
	uuid: string
	userId: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly config: ConfigService,
		private readonly jwtService: JwtService,
		private readonly redisTool: RedisTool,
	) {
		const { secret } = config.get<JwtConfig>("jwt")
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
	async generateToken(baseUser: BaseUser): Promise<string> {
		const payload = this.generatePayload(baseUser)
		const token = this.jwtService.sign(payload)
		// 存入redis
		await this.redisTool.set(`auth:admin:${payload}`, JSON.stringify(baseUser))
		return token
	}

	/**
	 * 生成payload
	 */
	private generatePayload(baseUser: BaseUser): string {
		const userPayload: JwtUserPayload = {
			uuid: crypto.randomUUID(),
			userId: String(baseUser.userId),
		}
		return `${userPayload.userId}|${userPayload.userId}`
	}
}
