import { AspenSummary } from "@aspen/aspen-core"
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ comment: "租户用户", name: "sys_tenant_user" })
export class SysTenantUserEntity extends BaseEntity {
	@PrimaryGeneratedColumn("uuid", { comment: "租户用户id" })
	@AspenSummary({ summary: "租户用户id" })
	tenantUserId: string

	@Column({ type: "varchar", length: 32, comment: "用户id" })
	userId: string

	@Column({ type: "varchar", length: 32, comment: "租户id" })
	tenantId: string

	@Column({ type: "boolean", comment: "是否默认" })
	isDefault: boolean
}
