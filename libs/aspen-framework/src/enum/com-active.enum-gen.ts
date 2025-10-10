import { BaseEnum } from "@aspen/aspen-core"

import { GenDict } from "../decorator/gen-dict/gen-dict-decorator"

@GenDict({
	key: "com_active",
	summary: "激活/未激活",
})
export class ComActiveEnum extends BaseEnum {
	readonly NO = {
		code: "0",
		summary: "未激活",
	}
	readonly YES = {
		code: "1",
		summary: "激活",
	}
}

export const comActiveEnum = new ComActiveEnum()
