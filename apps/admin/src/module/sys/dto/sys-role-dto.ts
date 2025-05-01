import { OmitType } from "@nestjs/swagger"

import { DataBaseQuery } from "@aspen/aspen-core"

import { SysRoleEntity } from "apps/admin/src/module/sys/_gen/_entity/index"

// 新增角色
export class SysRoleSaveDto extends OmitType(SysRoleEntity, ["roleId"]) {}

// 编辑角色
export class SysRoleEditDto extends SysRoleEntity {}

// 查询角色
export class SysRolePaDto extends DataBaseQuery(SysRoleEntity, {
	eq: { roleId: null, roleCode: null },
	ne: { roleId: null },
	like: { roleName: null },
}) {}
