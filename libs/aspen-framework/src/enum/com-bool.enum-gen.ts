import { BaseEnum } from "@aspen/aspen-core"

import { GenDict } from "../decorator/gen-dict/gen-dict-decorator"

@GenDict({
	key: "com_bool",
	summary: "是/否",
})
export class ComBoolEnum extends BaseEnum {
	readonly NO = {
		code: "0",
		summary: "否",
	}
	readonly YES = {
		code: "1",
		summary: "是",
	}
}

export const comBoolEnum = new ComBoolEnum()
