import { BaseEnum } from "@aspen/aspen-core"
import { gen } from "@aspen/aspen-framework"

/*
 * ---------------------------------------------------------------
 * ## 用户相关枚举
 * ---------------------------------------------------------------
 */
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

/*
 * ---------------------------------------------------------------
 * ## 菜单相关枚举
 * ---------------------------------------------------------------
 */
@gen.dict({
	key: "sys_menu_type",
	summary: "菜单类型",
})
export class SysMenuTypeEnum extends BaseEnum {
	readonly MENU = {
		code: "100",
		summary: "菜单",
	}
	readonly CATALOGUE = {
		code: "200",
		summary: "目录",
	}
}

export const sysMenuTypeEnum = new SysMenuTypeEnum()

@gen.dict({
	key: "sys_menu_position",
	summary: "菜单类型",
})
export class SysMenuPositionEnum extends BaseEnum {
	readonly MENU = {
		code: "100",
		summary: "菜单栏",
	}
	readonly PAGE_TOP = {
		code: "200",
		summary: "页面上方",
	}
}

export const sysMenuPositionEnum = new SysMenuPositionEnum()

/*
 * ---------------------------------------------------------------
 * ## 部门相关枚举
 * ---------------------------------------------------------------
 */
@gen.dict({
	key: "sys_dept_type",
	summary: "部门类型",
})
export class SysDeptTypeEnum extends BaseEnum {
	readonly DEPT = {
		code: "100",
		summary: "部门",
	}
	readonly DEPT_CATALOGUE = {
		code: "200",
		summary: "部门目录",
	}
}

export const sysDeptTypeEnum = new SysDeptTypeEnum()

/*
 * ---------------------------------------------------------------
 * ## 角色相关枚举
 * ---------------------------------------------------------------
 */
@gen.dict({
	key: "sys_role_type",
	summary: "角色类型",
})
export class SysRoleTypeEnum extends BaseEnum {
	readonly ROLE = {
		code: "100",
		summary: "角色",
	}
	readonly ROLE_CATALOGUE = {
		code: "200",
		summary: "角色目录",
	}
}

export const sysRoleTypeEnum = new SysRoleTypeEnum()
