import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm"

import { AspenSummary, AspenRule, BaseRecordDb, SortColumn } from "@aspen/aspen-core"
import { SysUserEntity, SysMenuEntity } from "apps/admin/src/module/sys/_gen/_entity"

@Entity({ comment: "角色", name: "sys_role" })
export class SysRoleEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "角色id" })
	@AspenSummary({ summary: "角色id", rule: AspenRule().isNotEmpty() })
	roleId: number

	@Column({ type: "bigint", comment: "父角色id" })
	@AspenSummary({ summary: "父角色id", rule: AspenRule().isNotEmpty() })
	parentRoleId: number

	@Column({ type: "varchar", length: 64, comment: "角色名" })
	@AspenSummary({ summary: "角色名", rule: AspenRule().isNotEmpty() })
	roleName: string

	@Column({ type: "varchar", length: 64, comment: "角色编码" })
	@AspenSummary({ summary: "角色编码", rule: AspenRule().isNotEmpty() })
	roleCode: string

	@Column(() => SortColumn, { prefix: false })
	sort: SortColumn

	@ManyToMany(() => SysUserEntity)
	users: Array<SysUserEntity>

	@ManyToMany(() => SysMenuEntity)
	@JoinTable({ name: "sys_rule_menu", joinColumn: { name: "role_id" }, inverseJoinColumn: { name: "menu_id" } })
	menus: Array<SysMenuEntity>
}
