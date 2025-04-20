import { OmitType } from "@nestjs/swagger"

import { SysRoleEntity } from "apps/admin/src/module/sys/_gen/_entity/index"

// 新增角色
export class SysRoleSaveDto extends OmitType(SysRoleEntity, ["roleId"]) {}

// 编辑角色
export class SysRoleEditDto extends SysRoleEntity {}
