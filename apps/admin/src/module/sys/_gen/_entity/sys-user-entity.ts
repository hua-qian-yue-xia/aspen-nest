import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Exclude } from "class-transformer"

import { AspenRule, AspenSummary, BaseUser, SortColumn } from "@aspen/aspen-core"
import { SysDeptEntity, SysRoleEntity } from "apps/admin/src/module/sys/_gen/_entity"

@Entity({ comment: "用户", name: "sys_user" })
export class SysUserEntity extends BaseUser {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "用户id" })
	@AspenSummary({ summary: "登录名", rule: AspenRule().isNotEmpty() })
	override userId: number

	@Column({ type: "varchar", length: 64, comment: "登录名" })
	@AspenSummary({ summary: "登录名", rule: AspenRule().isNotEmpty() })
	override username: string

	@Column({ type: "varchar", length: 64, comment: "用户昵称" })
	@AspenSummary({ summary: "用户昵称", rule: AspenRule().isNotEmpty() })
	override userNickname: string

	@Column({ type: "varchar", length: 128, comment: "用户密码" })
	@AspenSummary({ summary: "用户密码", rule: AspenRule().isNotEmpty() })
	@Exclude()
	override password: string

	@Column({ type: "varchar", length: 128, comment: "用户手机号" })
	@AspenSummary({ summary: "用户手机号", rule: AspenRule().isNotEmpty() })
	override mobile: string

	@Column({ type: "bit", default: true, comment: "是否启用" })
	@AspenSummary({ summary: "是否启用" })
	override enable: boolean

	@Column(() => SortColumn, { prefix: false })
	sort: SortColumn

	@ManyToMany(() => SysRoleEntity)
	@JoinTable({ name: "sys_user_role", joinColumn: { name: "user_id" }, inverseJoinColumn: { name: "role_id" } })
	roles: Array<SysRoleEntity>

	@ManyToOne(() => SysDeptEntity, (sysDept) => sysDept.users)
	@JoinColumn({ name: "dept_id" })
	userDept: SysDeptEntity
}
