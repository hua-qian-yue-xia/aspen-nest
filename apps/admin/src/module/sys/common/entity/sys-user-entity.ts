import { Brackets, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Repository } from "typeorm"
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
	userRoles: Array<SysRoleEntity>

	@ManyToMany(() => SysDeptEntity)
	@JoinTable({ name: "sys_user_dept", joinColumn: { name: "user_id" }, inverseJoinColumn: { name: "dept_id" } })
	userDepts: Array<SysDeptEntity>
}

/*
 * ---------------------------------------------------------------
 * ## 用户-新增
 * ---------------------------------------------------------------
 */
export class SysUserSaveDto {
	@AspenSummary({ summary: "用户id", rule: AspenRule() })
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

	@AspenSummary({ summary: "部门id列表", rule: AspenRule().isNotEmpty() })
	deptIdList: Array<string>

	@AspenSummary({ summary: "角色id列表", rule: AspenRule().isNotEmpty() })
	roleIdList: Array<string>

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
 * ## 用户-查询
 * ---------------------------------------------------------------
 */
export class SysUserQueryDto {
	@AspenSummary({ summary: "登录名、用户昵称、用户手机号", rule: AspenRule() })
	quick?: string

	@AspenSummary({ summary: "是否启用", rule: AspenRule() })
	enable?: boolean

	@AspenSummary({ summary: "部门id列表", rule: AspenRule() })
	deptIds?: Array<string>

	@AspenSummary({ summary: "是否包含`deptIds`条件", rule: AspenRule() })
	includeDeptIds?: boolean

	@AspenSummary({ summary: "角色id列表", rule: AspenRule() })
	roleIds?: Array<string>

	createQueryBuilder(repo: Repository<SysUserEntity>) {
		const queryBuilder = repo
			.createQueryBuilder("a")
			.leftJoinAndSelect("a.userRoles", "role")
			.leftJoinAndSelect("a.userDepts", "dept")
		if (!_.isEmpty(this.quick)) {
			queryBuilder.where(
				new Brackets((qb) =>
					qb
						.where(`a.username like :quick`, { quick: `%${this.quick}%` })
						.orWhere(`a.user_nickname like :quick`, { quick: `%${this.quick}%` })
						.orWhere(`a.mobile like :quick`, { quick: `%${this.quick}%` }),
				),
			)
		}
		if (!_.isEmpty(this.enable)) {
			queryBuilder.where("a.enable = :enable", { enable: this.enable })
		}
		if (!_.isEmpty(this.deptIds)) {
			if (this.includeDeptIds === false) {
				queryBuilder.where("dept.deptId NOT IN (:...deptIds)", { deptIds: this.deptIds })
			} else {
				queryBuilder.where("dept.deptId IN (:...deptIds)", { deptIds: this.deptIds })
			}
		}
		if (!_.isEmpty(this.roleIds)) {
			queryBuilder.where("role.roleId IN (:...roleIds)", { roleIds: this.roleIds })
		}
		queryBuilder.orderBy("a.sort", "DESC").addOrderBy("a.userId", "DESC")
		return queryBuilder
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
