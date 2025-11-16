import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"

import { plainToInstance } from "class-transformer"
import * as _ from "radash"

import { AspenRule, AspenSummary, BaseRecordDb } from "@aspen/aspen-core"

import { SysUserEntity } from "./sys-user-entity"
import { SysMenuEntity } from "./sys-menu-entity"

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

	@Column({ type: "bigint", nullable: true, comment: "父角色id" })
	@AspenSummary({ summary: "父角色id" })
	parentRoleId?: number

	@Column({ type: "varchar", length: 64, comment: "角色名" })
	@AspenSummary({ summary: "角色名" })
	roleName: string

	@Column({ type: "varchar", length: 64, comment: "角色编码" })
	@AspenSummary({ summary: "角色编码" })
	roleCode: string

	@Column({ type: "int", default: 0, comment: "排序" })
	@AspenSummary({ summary: "排序" })
	sort: number

	@ManyToMany(() => SysUserEntity)
	users: Array<SysUserEntity>

	@ManyToMany(() => SysMenuEntity)
	@JoinTable({ name: "sys_rule_menu", joinColumn: { name: "role_id" }, inverseJoinColumn: { name: "menu_id" } })
	menus: Array<SysMenuEntity>
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
	parentRoleId: number

	@AspenSummary({ summary: "角色名", rule: AspenRule().isNotEmpty() })
	roleName: string

	@AspenSummary({ summary: "角色编码", rule: AspenRule().isNotEmpty() })
	roleCode: string

	@AspenSummary({ summary: "排序" })
	sort: number

	toEntity(): SysRoleEntity {
		const obj = plainToInstance(SysRoleEntity, this)
		if (_.isEmpty(obj.roleId)) obj.roleId = undefined
		if (_.isEmpty(obj.sort)) obj.sort = 0
		return obj
	}
}
