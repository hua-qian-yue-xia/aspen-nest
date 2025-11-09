import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm"
import { Exclude } from "class-transformer"

import { AspenRule, AspenSummary, BaseRecordDb, BaseUser } from "@aspen/aspen-core"

/*
 * ---------------------------------------------------------------
 * ## 用户部门表
 * ## 后台用户关联的部门表
 * ---------------------------------------------------------------
 */
@Entity({ comment: "部门", name: "sys_dept" })
export class SysDeptEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "部门id" })
	@AspenSummary({ summary: "部门id", rule: AspenRule().isNotEmpty() })
	deptId: number

	@Column({ type: "bigint", comment: "部门父id" })
	@AspenSummary({ summary: "部门父id", rule: AspenRule().isNotEmpty() })
	deptParentId: number

	@Column({ type: "varchar", length: 64, comment: "部门名" })
	@AspenSummary({ summary: "部门名", rule: AspenRule().isNotEmpty() })
	deptName: string

	@OneToMany(() => SysUserEntity, (sysUser) => sysUser.userDept)
	users: Array<SysUserEntity>
}

/*
 * ---------------------------------------------------------------
 * ## 用户部门表
 * ## 后台用户关联的部门表
 * ---------------------------------------------------------------
 */
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
 * ## 用户角色表
 * ---------------------------------------------------------------
 */
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
 * ## 用户菜单表
 * ---------------------------------------------------------------
 */
@Entity({ comment: "菜单", name: "sys_menu" })
export class SysMenuEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "菜单id" })
	@AspenSummary({ summary: "菜单id" })
	menuId: number

	@Column({ type: "bigint", comment: "菜单父id" })
	@AspenSummary({ summary: "菜单父id" })
	parentId: number

	@Column({ type: "varchar", length: 64, comment: "菜单名" })
	@AspenSummary({ summary: "菜单名" })
	menuName: string

	@Column({ type: "char", length: 32, comment: "菜单类型" })
	@AspenSummary({ summary: "菜单类型" })
	type: string

	@Column({ type: "char", length: 32, comment: "菜单位置", nullable: true })
	@AspenSummary({ summary: "菜单位置" })
	position: string

	@Column({ type: "varchar", length: 64, nullable: true, comment: "图标" })
	@AspenSummary({ summary: "图标" })
	icon: string

	@Column({ type: "varchar", length: 128, nullable: true, comment: "路由地址" })
	@AspenSummary({ summary: "路由地址" })
	path: string

	@Column({ type: "bit", default: true, comment: "是否显示" })
	@AspenSummary({ summary: "是否显示" })
	visible: boolean

	@Column({ type: "bit", default: true, comment: "是否缓存" })
	@AspenSummary({ summary: "是否缓存" })
	keepAlive: boolean

	@Column({ type: "int", default: 0, comment: "排序" })
	@AspenSummary({ summary: "排序" })
	sort: number
}
