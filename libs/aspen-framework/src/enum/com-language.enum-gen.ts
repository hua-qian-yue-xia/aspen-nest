import { BaseEnum } from "@aspen/aspen-core"

import { GenDict } from "../decorator/gen-dict/gen-dict-decorator"

/**
 * 语言(来自于 ISO 639-1)
 * @description 使用两位字母代码标识语言
 */
@GenDict({
	key: "com_language",
	summary: "语言(ISO 639-1)",
})
export class ComLanguageEnum extends BaseEnum {
	readonly ZH = {
		code: "zh",
		summary: "中文",
	}
	readonly EN = {
		code: "en",
		summary: "英语",
	}
	readonly JA = {
		code: "ja",
		summary: "日语",
	}
}

export const comLanguageEnum = new ComLanguageEnum()
