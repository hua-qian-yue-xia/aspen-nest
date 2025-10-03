import { BaseEnum } from "@aspen/aspen-core"
import { gen } from "@aspen/aspen-framework"

@gen.dict({
	key: "sys_user_type",
	summary: "用户类型",
})
export class SysPersonTypeEnum extends BaseEnum {
	readonly ADMIN_USER = {
		code: "100",
		summary: "ADMIN管理后台用户",
	}
	readonly WECHAT_USER = {
		code: "200",
		summary: "WECHAT小程序用户",
	}
}

export const sysPersonTypeEnum = new SysPersonTypeEnum()
