import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"

import { plainToInstance } from "class-transformer"
import * as _ from "radash"

import { AspenRule, AspenSummary, BaseRecordDb } from "@aspen/aspen-core"

import { SysUserEntity } from "./sys-user-entity"
import { sysDeptTypeEnum } from "../sys-enum.enum-gen"

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

	@Column({ type: "varchar", length: 64, comment: "部门名" })
	@AspenSummary({ summary: "部门名" })
	deptName: string

	@Column({ type: "char", length: 32, comment: "部门类型" })
	@AspenSummary({ summary: "部门类型" })
	deptType: string

	@Column({ type: "boolean", default: false, comment: "是否为部门目录的专属部门" })
	@AspenSummary({ summary: "是否为部门目录的专属部门" })
	isCatalogueDpet: boolean

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

	// 生成目录的专属部门
	static generateCatalogueDpet(entity: SysDeptEntity) {
		const catalogueDpet = new SysDeptEntity()
		catalogueDpet.deptParentId = entity.deptId
		catalogueDpet.deptName = entity.deptName
		catalogueDpet.deptType = sysDeptTypeEnum.DEPT.code
		catalogueDpet.isCatalogueDpet = true
		catalogueDpet.sort = 9999
		return catalogueDpet
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

	@AspenSummary({ summary: "部门类型", rule: AspenRule().isNotEmpty() })
	deptType: string

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
