import { BaseEnum } from "@aspen/aspen-core"

import { GenDict } from "../decorator/gen-dict/gen-dict-decorator"

/**
 * 用户性别(来自于ISO 5218)
 * @description 国际标准化组织的ISO 5218国际标准以一位数定义人类性别表示法
 * @see https://zh.wikipedia.org/wiki/ISO_5218
 */
@GenDict({
	key: "com_user_gender",
	summary: "用户性别(ISO 5218)",
})
export class ComUserGenderEnum extends BaseEnum {
	readonly UNKNOWN = {
		code: "0",
		summary: "未知",
	}
	readonly MALE = {
		code: "1",
		summary: "男",
	}
	readonly FEMALE = {
		code: "2",
		summary: "女",
	}
	readonly NOT_APPLICABLE = {
		code: "9",
		summary: "未说明/不适用",
	}
}

export const comUserGenderEnum = new ComUserGenderEnum()
