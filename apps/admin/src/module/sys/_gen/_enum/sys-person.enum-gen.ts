import { BaseEnum } from "@aspen/aspen-core"
import { gen } from "@aspen/aspen-framework"

@gen.dict({
	key: "sys_user_status",
	summary: "用户状态",
})
export class SysPersonTypeEnum extends BaseEnum {
	readonly ADMIN_USER = {
		code: "100",
		summary: "ADMIN用户",
	}
	readonly WECHAT_USER = {
		code: "200",
		summary: "WECHAT用户",
	}
}

export const sysPersonTypeEnum = new SysPersonTypeEnum()
