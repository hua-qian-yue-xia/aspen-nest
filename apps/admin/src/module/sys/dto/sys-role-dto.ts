import { OmitType } from "@nestjs/swagger"

import { SysRoleEntity } from "apps/admin/src/module/sys/_gen/_entity/index"

export class SysRoleSaveDto extends OmitType(SysRoleEntity, ["roleId"]) {}

export class SysRoleEditDto extends SysRoleEntity {}
