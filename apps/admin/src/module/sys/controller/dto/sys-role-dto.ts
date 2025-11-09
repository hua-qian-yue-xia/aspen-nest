import { OmitType } from "@nestjs/swagger"

import { OrmQuery } from "@aspen/aspen-core"

import { SysRoleEntity } from "../../common/sys-entity"

// 新增角色
export class SysRoleSaveDto extends OmitType(SysRoleEntity, ["roleId"]) {}

// 编辑角色
export class SysRoleEditDto extends SysRoleEntity {}

// 查询角色
export class SysRolePaDto extends OrmQuery.DataBaseQuery(SysRoleEntity, ["eq-roleId", "like-roleName"]) {}
