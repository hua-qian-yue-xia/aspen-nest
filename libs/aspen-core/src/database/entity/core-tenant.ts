import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

import { BaseRecordDb } from "@aspen/aspen-core"

@Entity({ comment: "租户管理", name: "core_tenant" })
export class CoreTenantEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "租户code" })
	tenantCode: string

	@Column({ type: "varchar", length: 64, comment: "租户名称" })
	name: string

	@Column({ type: "varchar", length: 256, nullable: true, comment: "租户封面url" })
	coverUrl: string
}
