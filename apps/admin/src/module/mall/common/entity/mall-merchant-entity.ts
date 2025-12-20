import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"

import { BaseRecordDb } from "@aspen/aspen-core"

@Index("idx_merchant_name", ["name"])
@Index("idx_merchant_type", ["type"])
@Index("idx_merchant_external", ["externalSource", "externalMerchantId"])
@Index("uniq_merchant_code", ["code"], { unique: true })
@Entity({ comment: "商户/店铺", name: "mall_merchant" })
export class MallMerchantEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "主键ID" })
	id: string

	@Column({ type: "varchar", length: 64, comment: "商户编码(内部)" })
	code: string

	@Column({ type: "varchar", length: 256, comment: "商户名称" })
	name: string

	@Column({ type: "char", length: 32, comment: "商户类型(实体商家/自提点/第三方)" })
	type: string

	@Column({ type: "varchar", length: 64, nullable: true, comment: "第三方平台(如 JD/MT/ELM/TB)" })
	externalSource?: string

	@Column({ type: "varchar", length: 128, nullable: true, comment: "第三方商户唯一ID" })
	externalMerchantId?: string

	@Column({ type: "varchar", length: 256, nullable: true, comment: "地址" })
	address?: string

	@Column({ type: "varchar", length: 32, nullable: true, comment: "联系电话" })
	contactPhone?: string

	@Column({ type: "bit", default: true, comment: "是否启用" })
	enable: boolean

	@Column({ type: "int", default: 0, comment: "排序" })
	sort: number
}
