import { plainToClass, instanceToPlain } from "class-transformer"
import { AspenSummary, BaseUser } from "@aspen/aspen-core"

export class GenerateTokenBO {
	@AspenSummary({ summary: "accessToken" })
	accessToken: string

	@AspenSummary({ summary: "accessToken过期时间(秒)" })
	accessTokenExpiresIn: number

	@AspenSummary({ summary: "accessToken过期时间(YYYY-MM-DD HH:mm:ss)" })
	accessExpiresTime: string

	@AspenSummary({ summary: "refreshToken" })
	refreshToken: string

	@AspenSummary({ summary: "refreshToken过期时间(秒)" })
	refreshTokenExpiresIn: number

	@AspenSummary({ summary: "refreshToken过期时间(YYYY-MM-DD HH:mm:ss)" })
	refreshTokenExpiresTime: string
}

export class LoginUserInfoBO extends GenerateTokenBO {
	@AspenSummary({ summary: "用户信息" })
	baseUser: BaseUser
}

export class JwtUserPayloadBO {
	/**
	 * 用户唯一标识
	 * @description 用户id
	 */

	uniqueCode: string

	/**
	 * 唯一标识某一次具体的登录行为
	 */
	uuid: string

	/**
	 * 平台
	 */
	platform: string

	/**
	 * 生成jwt payload
	 */
	static generatePayload(uniqueCode: string, platform: string) {
		const obj = new JwtUserPayloadBO()
		obj.uniqueCode = uniqueCode
		obj.uuid = crypto.randomUUID()
		obj.platform = platform
		return obj
	}

	/**
	 * 将jwtpayload对象转换为class
	 */
	static objToClass(obj: JwtUserPayloadBO) {
		return plainToClass(JwtUserPayloadBO, obj)
	}

	toObj() {
		return instanceToPlain(this)
	}

	/**
	 * 获取redis key
	 */
	getRedisKey() {
		return `auth:${this.platform}:${this.uniqueCode}_${this.uuid}`
	}
}
