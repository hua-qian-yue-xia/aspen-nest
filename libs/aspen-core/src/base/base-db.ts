import { isEmpty } from "radash"

import {
	BaseEntity,
	BeforeInsert,
	BeforeRemove,
	BeforeSoftRemove,
	BeforeUpdate,
	Column,
	DeleteDateColumn,
	Index,
} from "typeorm"

import { Exclude } from "class-transformer"

import { AspenSummary } from "../decorator/summary/summary-decorator"
import { ApplicationCtx } from "../app/application-ctx"

export abstract class BaseDb extends BaseEntity {}

export class BaseRecordDb extends BaseDb {
	@Column({ type: "varchar", length: 64, comment: "新增人" })
	@AspenSummary({ summary: "新增人" })
	@Exclude()
	createBy: string

	@Index()
	@Column({ type: "datetime", comment: "新增时间" })
	@AspenSummary({ summary: "新增时间" })
	createAt: Date

	@Column({ type: "varchar", length: 64, nullable: true, comment: "修改人" })
	@AspenSummary({ summary: "修改人" })
	@Exclude()
	updateBy: string

	@Column({ type: "datetime", nullable: true, comment: "修改时间" })
	@AspenSummary({ summary: "修改时间" })
	@Exclude()
	updateAt: Date

	@Column({ type: "varchar", length: 64, nullable: true, comment: "删除人" })
	@AspenSummary({ summary: "删除人" })
	@Exclude()
	delBy: string

	@DeleteDateColumn({ type: "datetime", nullable: true, comment: "删除时间" })
	@AspenSummary({ summary: "删除时间" })
	@Exclude()
	delAt: Date

	@BeforeInsert()
	async BeforeInsert() {
		const user = await ApplicationCtx.getInstance().getLoginUser()
		if (isEmpty(this.createBy)) {
			this.createBy = user?.username || "auto"
		}
		if (isEmpty(this.createAt)) {
			this.createAt = new Date()
		}
	}

	@BeforeUpdate()
	async beforeUpdate() {
		const user = await ApplicationCtx.getInstance().getLoginUser()
		if (isEmpty(this.updateBy)) {
			this.updateBy = user?.username || "auto"
		}
		if (isEmpty(this.updateAt)) {
			this.updateAt = new Date()
		}
	}

	@BeforeSoftRemove()
	async beforeSoftRemove() {
		const user = await ApplicationCtx.getInstance().getLoginUser()
		if (isEmpty(this.delBy)) {
			this.delBy = user?.username || "auto"
		}
	}

	@BeforeRemove()
	async beforeRemove() {
		const user = await ApplicationCtx.getInstance().getLoginUser()
		if (isEmpty(this.delBy)) {
			this.delBy = user?.username || "auto"
		}
	}
}
