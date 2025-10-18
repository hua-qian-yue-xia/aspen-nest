import { PickType } from "@nestjs/swagger"

import { SysUserEntity } from "apps/admin/src/module/sys/_gen/_entity/index"

// 查询
export class SysUserQueryDto extends PickType(SysUserEntity, []) {}

// admin登录
export class SysUserAdminLoginDto extends PickType(SysUserEntity, ["username", "password"]) {}

// 新增用户
export class SysUserSaveDto extends PickType(SysUserEntity, ["username", "userNickname", "mobile"]) {}

// 修改用户
export class SysUserEditDto extends PickType(SysUserEntity, [
	"userId",
	"username",
	"userNickname",
	"mobile",
	"enable",
]) {}
