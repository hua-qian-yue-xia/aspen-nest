import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { AspenRule, AspenValidator, BaseUser } from "@aspen/aspen-core"
import { SysDeptEntity, SysRoleEntity } from "apps/admin/src/module/sys/_gen/_entity"

@Entity({ comment: "用户", name: "sys_user" })
export class SysUserEntity extends BaseUser {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "用户id" })
	override userId: number

	@Column({ type: "varchar", length: 64, unique: true, comment: "登录名" })
	@AspenValidator({ summary: "登录名", rule: AspenRule().isNotEmpty() })
	override username: string

	@Column({ type: "varchar", length: 64, comment: "用户昵称" })
	override userNickname: string

	@Column({ type: "varchar", length: 128, comment: "用户密码" })
	@AspenValidator({ summary: "用户密码", rule: AspenRule().isNotEmpty() })
	override password: string

	@Column({ type: "varchar", length: 128, unique: true, comment: "用户手机号" })
	override mobile: string

	@Column({ type: "bit", default: true, comment: "是否启用" })
	override enable: boolean

	@ManyToMany(() => SysRoleEntity)
	@JoinTable({ name: "sys_user_role", joinColumn: { name: "user_id" }, inverseJoinColumn: { name: "role_id" } })
	roles: Array<SysRoleEntity>

	@ManyToOne(() => SysDeptEntity, (sysDept) => sysDept.users)
	@JoinColumn({ name: "dept_id" })
	userDept: SysDeptEntity
}
