import { isEmpty } from "radash"

import {
	BaseEntity,
	BeforeInsert,
	BeforeRemove,
	BeforeSoftRemove,
	BeforeUpdate,
	Column,
	DeleteDateColumn,
} from "typeorm"

import { AspenSummary } from "../decorator/summary/summary-decorator"

export abstract class BaseDb extends BaseEntity {
	props(): Array<any> {
		return []
	}
	equals(other: BaseDb): boolean {
		if (!other) return false
		const propsToCompare = this.props()
		// 如果没有指定属性，则比较所有可枚举属性
		if (propsToCompare.length === 0) {
			return JSON.stringify(this) === JSON.stringify(other)
		}
		// 比较指定的属性
		for (const prop of propsToCompare) {
			if (this[prop] !== other[prop as string]) {
				return false
			}
		}
		return true
	}
}

export class BaseRecordDb extends BaseDb {
	@Column({ type: "varchar", length: 64, comment: "新增人" })
	@AspenSummary({ summary: "新增人" })
	createBy: string

	@Column({ type: "datetime", comment: "新增时间" })
	@AspenSummary({ summary: "新增时间" })
	createAt: Date

	@Column({ type: "varchar", length: 64, nullable: true, comment: "修改人" })
	@AspenSummary({ summary: "修改人" })
	updateBy: string

	@Column({ type: "datetime", nullable: true, comment: "修改时间" })
	@AspenSummary({ summary: "修改时间" })
	updateAt: Date

	@Column({ type: "varchar", length: 64, nullable: true, comment: "删除人" })
	@AspenSummary({ summary: "删除人" })
	delBy: string

	@DeleteDateColumn({ type: "datetime", nullable: true, comment: "删除时间" })
	@AspenSummary({ summary: "删除时间" })
	delAt: Date

	@BeforeInsert()
	BeforeInsert() {
		if (isEmpty(this.createBy)) this.createBy = "auto"
		if (isEmpty(this.createAt)) this.createAt = new Date()
	}

	@BeforeUpdate()
	beforeUpdate() {
		if (isEmpty(this.updateBy)) this.updateBy = "auto"
		if (isEmpty(this.updateAt)) this.updateAt = new Date()
	}

	@BeforeSoftRemove()
	beforeSoftRemove() {
		if (isEmpty(this.delBy)) this.delBy = "auto"
	}

	@BeforeRemove()
	beforeRemove() {
		if (isEmpty(this.delBy)) this.delBy = "auto"
	}
}
