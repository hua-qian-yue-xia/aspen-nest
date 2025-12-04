import { BaseRecordDb } from "@aspen/aspen-core"
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"

import { MallProductSource, MallProductStatus, MallProductType } from "../enum/mall-product.enum"

@Index("uniq_spu_merchant_code", ["merchantId", "code"], { unique: true })
@Index("uniq_spu_external", ["externalSource", "externalSpuId"], { unique: true })
@Entity({ comment: "SPU 商品", name: "mall_spu" })
export class MallSpuEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "主键ID" })
	id: string

	@Column({ type: "varchar", length: 64, comment: "商品编码(内部)" })
	code: string

	@Column({ type: "varchar", length: 256, comment: "商品名称" })
	name: string

	@Column({ type: "varchar", length: 256, nullable: true, comment: "副标题" })
	subtitle?: string

	@Column({ type: "text", nullable: true, comment: "商品详情/描述" })
	description?: string

	@Index("idx_spu_category")
	@Column({ type: "bigint", unsigned: true, nullable: true, comment: "类目ID" })
	categoryId?: string

	@Index("idx_spu_brand")
	@Column({ type: "bigint", unsigned: true, nullable: true, comment: "品牌ID" })
	brandId?: string

	@Index("idx_spu_merchant")
	@Column({ type: "bigint", unsigned: true, comment: "商户/店铺ID" })
	merchantId: string

	@Index("idx_spu_status")
	@Column({ type: "enum", enum: MallProductStatus, default: MallProductStatus.DRAFT, comment: "状态" })
	status: MallProductStatus

	@Index("idx_spu_type")
	@Column({ type: "enum", enum: MallProductType, default: MallProductType.PHYSICAL, comment: "商品类型" })
	type: MallProductType

	@Index("idx_spu_source")
	@Column({ type: "enum", enum: MallProductSource, default: MallProductSource.OWN, comment: "来源" })
	source: MallProductSource

	@Column({ type: "varchar", length: 64, nullable: true, comment: "第三方平台(如 JD/MT/ELM/TB)" })
	externalSource?: string

	@Column({ type: "varchar", length: 128, nullable: true, comment: "第三方SPU唯一ID" })
	externalSpuId?: string

	@Column({ type: "varchar", length: 64, nullable: true, comment: "计量单位(件/份/小时等)" })
	unit?: string

	@Column({ type: "decimal", precision: 12, scale: 2, nullable: true, comment: "最低销售价" })
	minPrice?: string

	@Column({ type: "decimal", precision: 12, scale: 2, nullable: true, comment: "最高销售价" })
	maxPrice?: string

	@Column({ type: "json", nullable: true, comment: "主图/轮播图(JSON数组)" })
	images?: Array<string>

	@Column({ type: "json", nullable: true, comment: "标签(JSON数组)" })
	tags?: Array<string>

	@Index("idx_spu_published")
	@Column({ type: "tinyint", width: 1, default: 0, comment: "是否上架(1是/0否)" })
	published: number

	@Column({ type: "json", nullable: true, comment: "扩展参数(JSON)" })
	ext?: Record<string, any>
}
