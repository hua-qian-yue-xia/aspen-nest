import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Exclude, plainToInstance } from "class-transformer"

import { AspenRule, AspenSummary, BaseUser } from "@aspen/aspen-core"
import * as _ from "radash"

import { SysRoleEntity } from "./sys-role-entity"
import { SysDeptEntity } from "./sys-dept-entity"

/*
 * ---------------------------------------------------------------
 * ## 用户部门表
 * ---------------------------------------------------------------
 */
@Entity({ comment: "用户", name: "sys_user" })
export class SysUserEntity extends BaseUser {
	@PrimaryGeneratedColumn("uuid", { comment: "用户id" })
	@AspenSummary({ summary: "登录名" })
	override userId: string

	@Column({ type: "varchar", length: 64, comment: "登录名" })
	@AspenSummary({ summary: "登录名" })
	override username: string

	@Column({ type: "varchar", length: 64, comment: "用户昵称" })
	@AspenSummary({ summary: "用户昵称" })
	override userNickname: string

	@Column({ type: "varchar", length: 128, comment: "用户密码" })
	@AspenSummary({ summary: "用户密码" })
	@Exclude()
	override password: string

	@Column({ type: "varchar", length: 128, comment: "用户手机号" })
	@AspenSummary({ summary: "用户手机号" })
	override mobile: string

	@Column({ type: "bit", default: true, comment: "是否启用" })
	@AspenSummary({ summary: "是否启用" })
	override enable: boolean

	@Column({ type: "int", default: 0, comment: "排序" })
	@AspenSummary({ summary: "排序" })
	sort: number

	@ManyToMany(() => SysRoleEntity)
	@JoinTable({ name: "sys_user_role", joinColumn: { name: "user_id" }, inverseJoinColumn: { name: "role_id" } })
	roles: Array<SysRoleEntity>

	@ManyToOne(() => SysDeptEntity, (sysDept) => sysDept.users)
	@JoinColumn({ name: "dept_id" })
	userDept: SysDeptEntity
}

/*
 * ---------------------------------------------------------------
 * ## 用户-新增
 * ---------------------------------------------------------------
 */
export class SysDeptSaveDto {
	@AspenSummary({ summary: "登录名", rule: AspenRule().isNotEmpty() })
	userId: string

	@AspenSummary({ summary: "登录名", rule: AspenRule().isNotEmpty() })
	username: string

	@AspenSummary({ summary: "用户昵称", rule: AspenRule().isNotEmpty() })
	userNickname: string

	@AspenSummary({ summary: "用户手机号", rule: AspenRule().isNotEmpty() })
	mobile: string

	@AspenSummary({ summary: "是否启用" })
	enable: boolean

	@AspenSummary({ summary: "排序" })
	sort: number

	toEntity() {
		const obj = plainToInstance(SysUserEntity, this)
		// 生成默认8位数密码
		obj.password = obj.encryptPassword(_.uid(8))
		if (_.isEmpty(obj.enable)) obj.enable = true
		if (_.isEmpty(obj.sort)) obj.sort = 0
		return obj
	}
}

/*
 * ---------------------------------------------------------------
 * ## 用户-后台登录
 * ---------------------------------------------------------------
 */
export class SysUserAdminLoginDto {
	@AspenSummary({ summary: "登录名", rule: AspenRule().isNotEmpty() })
	username: string

	@AspenSummary({ summary: "用户密码", rule: AspenRule().isNotEmpty() })
	password: string
}
