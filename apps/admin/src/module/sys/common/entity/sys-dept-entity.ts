import { Column, Entity, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn, Repository } from "typeorm"

import { plainToInstance } from "class-transformer"
import * as _ from "radash"

import { AspenRule, AspenSummary, BaseRecordDb } from "@aspen/aspen-core"

import { SysUserEntity } from "./sys-user-entity"
import { SysDeptCountTotalBO } from "../../service/BO/sys-dept-bo"

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

	@Column({ type: "varchar", length: 36, comment: "部门父id" })
	@AspenSummary({ summary: "部门父id" })
	deptParentId: string

	@Index()
	@Column({ type: "varchar", length: 64, comment: "部门名" })
	@AspenSummary({ summary: "部门名" })
	deptName: string

	@Column({ type: "int", default: 0, comment: "排序" })
	@AspenSummary({ summary: "排序" })
	sort: number

	@ManyToMany(() => SysUserEntity)
	users?: Array<SysUserEntity>

	// 获取根部门id
	static getRootDeptId() {
		return "-1"
	}

	// 获取不存在的根部门id
	static getNotExistRootDeptId() {
		return "-99"
	}
}

/*
 * ---------------------------------------------------------------
 * ## 部门-查询
 * ---------------------------------------------------------------
 */
export class SysDeptQueryDto {
	@AspenSummary({ summary: "部门父id", rule: AspenRule() })
	deptParentId?: string

	@AspenSummary({ summary: "部门名", rule: AspenRule() })
	deptNameLike?: string

	createQueryBuilder(repo: Repository<SysDeptEntity>) {
		const queryBuilder = repo.createQueryBuilder("dept")
		if (!_.isEmpty(this.deptParentId)) {
			queryBuilder.where("sys_dept.dept_parent_id = :deptParentId", { deptParentId: this.deptParentId })
		}
		if (!_.isEmpty(this.deptNameLike)) {
			queryBuilder.where(`sys_dept.dept_name like :deptNameLike`, { deptNameLike: `%${this.deptNameLike}%` })
		}
		queryBuilder.orderBy("sys_dept.sort", "DESC").addOrderBy("sys_dept.dept_id", "DESC")
		return queryBuilder
	}
}

/*
 * ---------------------------------------------------------------
 * ## 部门-新增
 * ---------------------------------------------------------------
 */
export class SysDeptSaveDto {
	@AspenSummary({ summary: "部门id", rule: AspenRule() })
	deptId?: string

	@AspenSummary({ summary: "部门父id", rule: AspenRule() })
	deptParentId?: string

	@AspenSummary({ summary: "部门名", rule: AspenRule().isNotEmpty() })
	deptName: string

	@Column({ type: "int", default: 0, comment: "排序" })
	@AspenSummary({ summary: "排序" })
	sort?: number

	toEntity() {
		const obj = plainToInstance(SysDeptEntity, this)
		if (_.isEmpty(obj.deptId)) obj.deptId = undefined
		if (_.isEmpty(obj.deptParentId)) obj.deptParentId = SysDeptEntity.getRootDeptId()
		if (_.isEmpty(obj.sort)) obj.sort = 0
		return obj
	}
}

/*
 * ---------------------------------------------------------------
 * ## 部门-返回
 * ---------------------------------------------------------------
 */
export class SysDeptVO extends SysDeptEntity {
	@AspenSummary({ summary: "子部门总数" })
	countTotal?: SysDeptCountTotalBO
}
