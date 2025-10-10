import { BaseEnum } from "@aspen/aspen-core"

import { GenDict } from "../decorator/gen-dict/gen-dict-decorator"

@GenDict({
	key: "com_toggle",
	summary: "开/关",
})
export class ComToggleEnum extends BaseEnum {
	readonly NO = {
		code: "0",
		summary: "关",
	}
	readonly YES = {
		code: "1",
		summary: "开",
	}
}

export const comToggleEnum = new ComToggleEnum()
