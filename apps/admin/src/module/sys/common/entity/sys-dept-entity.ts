import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

import { plainToInstance } from "class-transformer"
import * as _ from "radash"

import { AspenRule, AspenSummary, BaseRecordDb } from "@aspen/aspen-core"

import { SysUserEntity } from "./sys-user-entity"

/*
 * ---------------------------------------------------------------
 * ## 部门表
 * ---------------------------------------------------------------
 */
@Entity({ comment: "部门", name: "sys_dept" })
export class SysDeptEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "部门id" })
	@AspenSummary({ summary: "部门id" })
	deptId: string

	@Column({ type: "bigint", comment: "部门父id" })
	@AspenSummary({ summary: "部门父id" })
	deptParentId: string

	@Column({ type: "varchar", length: 64, comment: "部门名" })
	@AspenSummary({ summary: "部门名" })
	deptName: string

	@Column({ type: "int", default: 0, comment: "排序" })
	@AspenSummary({ summary: "排序" })
	sort: number

	@OneToMany(() => SysUserEntity, (sysUser) => sysUser.userDept)
	users: Array<SysUserEntity>
}

/*
 * ---------------------------------------------------------------
 * ## 部门-新增
 * ---------------------------------------------------------------
 */
export class SysDeptSaveDto {
	@AspenSummary({ summary: "部门id", rule: AspenRule() })
	deptId: string

	@AspenSummary({ summary: "部门父id", rule: AspenRule() })
	deptParentId: string

	@AspenSummary({ summary: "部门名", rule: AspenRule().isNotEmpty() })
	deptName: string

	@Column({ type: "int", default: 0, comment: "排序" })
	@AspenSummary({ summary: "排序" })
	sort: number

	toEntity() {
		const obj = plainToInstance(SysDeptEntity, this)
		if (_.isEmpty(obj.sort)) obj.sort = 0
		return obj
	}
}
