import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"

import { plainToInstance } from "class-transformer"
import * as _ from "radash"

import { AspenRule, AspenSummary, BaseRecordDb } from "@aspen/aspen-core"

import { SysUserEntity } from "./sys-user-entity"
import { SysMenuEntity } from "./sys-menu-entity"
import { sysRoleTypeEnum } from "../sys-enum.enum-gen"

/*
 * ---------------------------------------------------------------
 * ## 角色表
 * ---------------------------------------------------------------
 */
@Entity({ comment: "角色", name: "sys_role" })
export class SysRoleEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "角色id" })
	@AspenSummary({ summary: "角色id" })
	roleId: string

	@Column({ type: "varchar", length: 36, default: "-99", comment: "父角色id" })
	@AspenSummary({ summary: "父角色id" })
	parentRoleId: string

	@Column({ type: "varchar", length: 64, comment: "角色名" })
	@AspenSummary({ summary: "角色名" })
	roleName: string

	@Column({ type: "varchar", length: 64, comment: "角色编码" })
	@AspenSummary({ summary: "角色编码" })
	roleCode: string

	@Column({ type: "char", length: 32, comment: "角色类型" })
	@AspenSummary({ summary: "角色类型" })
	roleType: string

	@Column({ type: "boolean", default: false, comment: "是否为角色目录的专属部门" })
	@AspenSummary({ summary: "是否为角色目录的专属部门" })
	isCatalogueRole: boolean

	@Column({ type: "int", default: 0, comment: "排序" })
	@AspenSummary({ summary: "排序" })
	sort: number

	@ManyToMany(() => SysUserEntity)
	users: Array<SysUserEntity>

	@ManyToMany(() => SysMenuEntity)
	@JoinTable({ name: "sys_rule_menu", joinColumn: { name: "role_id" }, inverseJoinColumn: { name: "menu_id" } })
	menus: Array<SysMenuEntity>

	// 获取不存在的根角色id
	static getNotExistRootRoleId() {
		return "-99"
	}

	// 生成目录的专属角色
	static generateCatalogueRole(entity: SysRoleEntity) {
		const catalogueRole = new SysRoleEntity()
		catalogueRole.parentRoleId = entity.roleId
		catalogueRole.roleName = entity.roleName
		catalogueRole.roleCode = entity.roleCode
		catalogueRole.roleType = sysRoleTypeEnum.ROLE.code
		catalogueRole.isCatalogueRole = true
		catalogueRole.sort = 9999
		return catalogueRole
	}
}

/*
 * ---------------------------------------------------------------
 * ## 角色-新增
 * ---------------------------------------------------------------
 */
export class SysRoleSaveDto {
	@AspenSummary({ summary: "角色id", rule: AspenRule() })
	roleId: string

	@AspenSummary({ summary: "父角色id", rule: AspenRule() })
	parentRoleId?: number

	@AspenSummary({ summary: "角色名", rule: AspenRule().isNotEmpty() })
	roleName: string

	@AspenSummary({ summary: "角色编码", rule: AspenRule().isNotEmpty() })
	roleCode: string

	@AspenSummary({ summary: "角色类型", rule: AspenRule().isNotEmpty() })
	roleType: string

	@AspenSummary({ summary: "排序" })
	sort: number

	toEntity(): SysRoleEntity {
		const obj = plainToInstance(SysRoleEntity, this)
		if (_.isEmpty(obj.roleId)) obj.roleId = undefined
		if (_.isEmpty(obj.parentRoleId)) obj.parentRoleId = SysRoleEntity.getNotExistRootRoleId()
		if (_.isEmpty(obj.sort)) obj.sort = 0
		return obj
	}
}
