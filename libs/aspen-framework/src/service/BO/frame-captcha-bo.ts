import { AspenSummary } from "@aspen/aspen-core"

export class CaptchaCreateBO {
	@AspenSummary({ summary: "验证码key" })
	key: string

	@AspenSummary({ summary: "验证码svg" })
	svg: string
}
