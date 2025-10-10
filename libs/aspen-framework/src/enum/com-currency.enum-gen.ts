import { BaseEnum } from "@aspen/aspen-core"

import { GenDict } from "../decorator/gen-dict/gen-dict-decorator"

/**
 * 货币(来自于 ISO 4217)
 * @description 使用三位字母代码标识货币
 */
@GenDict({
	key: "com_currency",
	summary: "货币(ISO 4217)",
})
export class ComCurrencyEnum extends BaseEnum {
	readonly CNY = {
		code: "CNY",
		summary: "人民币",
	}
	readonly USD = {
		code: "USD",
		summary: "美元",
	}
	readonly JPY = {
		code: "JPY",
		summary: "日元",
	}
}

export const comCurrencyEnum = new ComCurrencyEnum()
