import { PickType } from "@nestjs/swagger"

import { SysUserEntity } from "apps/admin/src/module/sys/_gen/_entity/index"

export class SysUserDto extends SysUserEntity {}

// admin登录
export class SysUserAdminLoginDto extends PickType(SysUserEntity, ["username", "password"]) {}
