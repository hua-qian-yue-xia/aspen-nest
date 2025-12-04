import { BaseRecordDb } from "@aspen/aspen-core"
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { MallProductStatus, MallProductSource } from "../enum/mall-product.enum"
import { MallSpuEntity } from "./mall-spu-entity"

@Index("idx_sku_spu", ["spuId"])
@Index("idx_sku_status", ["status"])
@Index("idx_sku_price", ["price"])
@Index("idx_sku_merchant", ["merchantId"])
@Index("uniq_sku_merchant_code", ["merchantId", "code"], { unique: true })
@Index("uniq_sku_external", ["externalSource", "externalSkuId"], { unique: true })
@Entity({ comment: "SKU 商品", name: "mall_sku" })
export class MallSkuEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "主键ID" })
	id: string

	@Column({ type: "bigint", unsigned: true, comment: "SPU ID" })
	spuId: string

	@ManyToOne(() => MallSpuEntity)
	@JoinColumn({ name: "spuId", referencedColumnName: "id" })
	spu?: MallSpuEntity

	@Column({ type: "bigint", unsigned: true, comment: "商户/店铺ID" })
	merchantId: string

	@Column({ type: "varchar", length: 64, comment: "SKU编码(内部)" })
	code: string

	@Column({ type: "varchar", length: 256, comment: "SKU名称" })
	name: string

	@Column({ type: "varchar", length: 128, nullable: true, comment: "条形码/国际码" })
	barcode?: string

	@Column({ type: "enum", enum: MallProductStatus, default: MallProductStatus.DRAFT, comment: "状态" })
	status: MallProductStatus

	@Column({ type: "enum", enum: MallProductSource, default: MallProductSource.OWN, comment: "来源" })
	source: MallProductSource

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

	@Column({ type: "int", unsigned: true, default: 0, comment: "可售库存" })
	stock: number

	@Column({ type: "int", unsigned: true, default: 0, comment: "占用库存(锁定)" })
	stockLocked: number

	@Column({ type: "decimal", precision: 12, scale: 3, nullable: true, comment: "重量(kg)" })
	weight?: string

	@Column({ type: "decimal", precision: 12, scale: 3, nullable: true, comment: "体积(m^3)" })
	volume?: string

	@Column({ type: "json", nullable: true, comment: "规格参数(JSON): [{name,value}], 可用于组合规格" })
	specs?: Array<{ name: string; value: string }>

	@Column({ type: "json", nullable: true, comment: "扩展参数(JSON)" })
	ext?: Record<string, any>
}
