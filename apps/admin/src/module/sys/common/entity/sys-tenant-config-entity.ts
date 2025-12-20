import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

import { AspenSummary, BaseRecordDb } from "@aspen/aspen-core"

@Entity({ comment: "租户配置", name: "sys_tenant_config" })
export class SysTenantConfigEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "租户配置id" })
	@AspenSummary({ summary: "租户配置id" })
	tenantConfigId: string

	@Column({ type: "json", comment: "微信配置" })
	@AspenSummary({ summary: "微信配置" })
	weixinConfig: string

	@Column({ type: "json", comment: "支付宝配置" })
	@AspenSummary({ summary: "支付宝配置" })
	aliConfig: string
}

export class WeixinConfig {
	@Column({ comment: "微信应用appId" })
	appId: string

	@AspenSummary({ summary: "微信应用appSecret" })
	appSecret: string
}
