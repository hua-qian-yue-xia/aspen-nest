import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"

import { AspenSummary, BaseRecordDb } from "@aspen/aspen-core"

import { SysTenantConfigEntity } from "./sys-tenant-config-entity"

@Entity({ comment: "租户", name: "sys_tenant" })
export class SysTenantEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "租户id" })
	@AspenSummary({ summary: "租户id" })
	tenantId: string

	@Index({ unique: true })
	@Column({ comment: "租户唯一标识", unique: true, length: 32 })
	@AspenSummary({ summary: "租户唯一标识" })
	uniqueKey: string

	@Column({ comment: "租户名称", length: 64 })
	@AspenSummary({ summary: "租户名称" })
	name: string

	@Column({ comment: "租户logo", nullable: true, length: 256 })
	@AspenSummary({ summary: "租户logo" })
	logo?: string

	@Column({ comment: "租户主题(hex)", length: 64 })
	@AspenSummary({ summary: "租户主题(hex)" })
	primaryColor: string

	@Column({ comment: "联系人", nullable: true, length: 32 })
	@AspenSummary({ summary: "联系人" })
	contactUsername?: string

	@Column({ comment: "联系人手机号", nullable: true, length: 16 })
	@AspenSummary({ summary: "联系人手机号" })
	contactMobile?: string

	@Column({ comment: "租户描述", nullable: true, length: 256 })
	@AspenSummary({ summary: "租户描述" })
	description?: string

	@Column({ type: "json", comment: "租户状态" })
	@AspenSummary({ summary: "租户状态" })
	status: Array<string>

	@OneToOne(() => SysTenantConfigEntity)
	@JoinColumn({ name: "config_id", referencedColumnName: "tenantConfigId" })
	config: SysTenantConfigEntity
}
