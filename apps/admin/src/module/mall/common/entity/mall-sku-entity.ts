import { BaseDb } from "@aspen/aspen-core"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { MallSpuEntity } from "./mall-spu-entity"
import { mallProductEnum } from "../enum/index"

@Entity({ comment: "SKU 商品", name: "mall_sku" })
export class MallSkuEntity extends BaseDb {
	@PrimaryGeneratedColumn("uuid", { comment: "主键ID" })
	id: string

	@Column({ type: "bigint", comment: "SPU ID" })
	spuId: string

	@ManyToOne(() => MallSpuEntity)
	@JoinColumn({ name: "spuId", referencedColumnName: "id" })
	spu?: MallSpuEntity

	@Column({ type: "bigint", comment: "商户/店铺ID" })
	merchantId: string

	@Column({ type: "varchar", length: 64, comment: "SKU编码(内部)" })
	code: string

	@Column({ type: "varchar", length: 256, comment: "SKU名称" })
	name: string

	@Column({ type: "varchar", length: 128, nullable: true, comment: "条形码/国际码" })
	barcode?: string

	@Column({
		type: "enum",
		enum: mallProductEnum.status.meta.code,
		default: mallProductEnum.status.named.DRAFT.raw.code,
		comment: "状态",
	})
	status: string

	@Column({
		type: "enum",
		enum: mallProductEnum.source.meta.code,
		default: mallProductEnum.source.named.OWN.raw.code,
		comment: "来源",
	})
	source: string

	@Column({ type: "varchar", length: 64, nullable: true, comment: "第三方平台(如 JD/MT/ELM/TB)" })
	externalSource?: string

	@Column({ type: "varchar", length: 128, nullable: true, comment: "第三方SKU唯一ID" })
	externalSkuId?: string

	@Column({ type: "decimal", precision: 12, scale: 2, comment: "销售价" })
	price: string

	@Column({ type: "decimal", precision: 12, scale: 2, nullable: true, comment: "市场价" })
	marketPrice?: string

	@Column({ type: "decimal", precision: 12, scale: 2, nullable: true, comment: "成本价" })
	costPrice?: string

	@Column({ type: "int", default: 0, comment: "可售库存" })
	stock: number

	@Column({ type: "int", default: 0, comment: "占用库存(锁定)" })
	stockLocked: number

	@Column({ type: "decimal", precision: 12, scale: 3, nullable: true, comment: "重量(kg)" })
	weight?: string

	@Column({ type: "decimal", precision: 12, scale: 3, nullable: true, comment: "体积(m^3)" })
	volume?: string

	@Column({ type: "json", nullable: true, comment: "扩展参数(JSON)" })
	ext?: Record<string, any>
}
