import { AspenSummary } from "@aspen/aspen-core"

export class SysUserTokenBO {
	@AspenSummary({ summary: "token" })
	accessToken: string

	@AspenSummary({ summary: "token过期时间" })
	accessTokenExpire: number

	@AspenSummary({ summary: "刷新token" })
	refreshToken: string
}
