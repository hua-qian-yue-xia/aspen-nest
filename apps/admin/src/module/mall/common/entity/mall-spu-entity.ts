import { BaseRecordDb } from "@aspen/aspen-core"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

import { mallProductSourceEnum, mallProductTypeEnum, mallProductStatusEnum } from "../enum/index"

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

	@Column({ type: "bigint", unsigned: true, nullable: true, comment: "类目ID" })
	categoryId?: string

	@Column({ type: "bigint", unsigned: true, nullable: true, comment: "品牌ID" })
	brandId?: string

	@Column({ type: "bigint", unsigned: true, comment: "商户/店铺ID" })
	merchantId?: string

	@Column({
		type: "enum",
		enum: mallProductStatusEnum.getKeys(),
		default: mallProductStatusEnum.DRAFT.code,
		comment: "状态",
	})
	status: typeof mallProductStatusEnum

	@Column({
		type: "enum",
		enum: mallProductTypeEnum.getKeys(),
		default: mallProductTypeEnum.PHYSICAL.code,
		comment: "商品类型",
	})
	type: typeof mallProductTypeEnum

	@Column({
		type: "enum",
		enum: mallProductSourceEnum.getKeys(),
		default: mallProductSourceEnum.OWN.code,
		comment: "来源",
	})
	source: typeof mallProductSourceEnum

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
