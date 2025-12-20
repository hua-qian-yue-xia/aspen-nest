import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"

import { AspenSummary, BaseRecordDb } from "@aspen/aspen-core"

import { SysTenantConfigEntity } from "./sys-tenant-config-entity"

@Entity({ comment: "租户", name: "sys_tenant" })
export class SysTenantEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "租户id" })
	@AspenSummary({ summary: "租户id" })
	tenantId: string

	@OneToOne(() => SysTenantConfigEntity)
	@JoinColumn({ name: "config_id", referencedColumnName: "tenantConfigId" })
	config: SysTenantConfigEntity
}
