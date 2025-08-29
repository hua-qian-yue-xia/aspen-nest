import { BaseEnum } from "@aspen/aspen-core"
import { gen } from "@aspen/aspen-framework"

@gen.dict({
	key: "sys_user_status",
	summary: "用户状态",
})
export class SysUserStatusEnum extends BaseEnum {
	readonly ACTIVE = {
		code: "100",
		summary: "正常",
	}
	readonly INACTIVE = {
		code: "200",
		summary: "停用",
	}
}

export const sysUserStatusEnum = new SysUserStatusEnum()
