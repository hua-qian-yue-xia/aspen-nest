import { BaseEnum } from "@aspen/aspen-core"

import { GenDict } from "../decorator/gen-dict/gen-dict-decorator"

/**
 * 国家(来自于 ISO 3166-1 alpha-2)
 * @description 使用两位字母代码标识国家/地区
 */
@GenDict({
	key: "com_country",
	summary: "国家(ISO 3166-1 alpha-2)",
})
export class ComCountryEnum extends BaseEnum {
	readonly CN = {
		code: "CN",
		summary: "中国",
	}
	readonly US = {
		code: "US",
		summary: "美国",
	}
	readonly JP = {
		code: "JP",
		summary: "日本",
	}
}

export const comCountryEnum = new ComCountryEnum()
