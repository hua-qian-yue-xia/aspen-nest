import { BaseRecordDb } from "@aspen/aspen-core"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

import { mallProductEnum } from "../enum/index"

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

	@Column({ type: "bigint", nullable: true, comment: "类目ID" })
	categoryId?: string

	@Column({ type: "bigint", nullable: true, comment: "品牌ID" })
	brandId?: string

	@Column({ type: "bigint", comment: "商户/店铺ID" })
	merchantId?: string

	@Column({
		type: "enum",
		enum: mallProductEnum.status.meta.code,
		default: mallProductEnum.status.named.DRAFT.raw.code,
		comment: "状态",
	})
	status: string

	@Column({
		type: "enum",
		enum: mallProductEnum.type.meta.code,
		default: mallProductEnum.type.named.PHYSICAL.raw.code,
		comment: "商品类型",
	})
	type: string

	@Column({
		type: "enum",
		enum: mallProductEnum.source.meta.code,
		default: mallProductEnum.source.named.OWN.raw.code,
		comment: "来源",
	})
	source: string

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

	@Column({ type: "json", nullable: true, comment: "扩展参数(JSON)" })
	ext?: Record<string, any>
}
