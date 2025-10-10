import { BaseEnum } from "@aspen/aspen-core"

import { GenDict } from "../decorator/gen-dict/gen-dict-decorator"

@GenDict({
	key: "com_enable",
	summary: "启用/禁用",
})
export class ComEnableEnum extends BaseEnum {
	readonly NO = {
		code: "0",
		summary: "禁用",
	}
	readonly YES = {
		code: "1",
		summary: "启用",
	}
}

export const comEnableEnum = new ComEnableEnum()
