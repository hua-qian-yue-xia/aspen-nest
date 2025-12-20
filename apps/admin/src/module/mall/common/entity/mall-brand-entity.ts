import { PrimaryGeneratedColumn, Column, Entity } from "typeorm"

import { BaseRecordDb } from "@aspen/aspen-core"
import { enums } from "@aspen/aspen-framework"

const { comBoolEnum } = enums

@Entity({ comment: "商品品牌", name: "mall_brand" })
export class MallBrandEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "主键ID" })
	id: string

	@Column({ type: "varchar", length: 36, nullable: true, comment: "父品牌id" })
	parentId?: string

	@Column({ type: "varchar", length: 256, comment: "品牌名" })
	name: string

	@Column({ type: "varchar", length: 128, nullable: true, comment: "品牌描述" })
	description?: string

	@Column({ type: "json", nullable: true, comment: "主图/轮播图(JSON数组)" })
	images?: Array<string>

	@Column({ type: "int", default: 0, comment: "排序" })
	sort: number

	@Column({
		type: "enum",
		enum: comBoolEnum.getCodes(),
		default: comBoolEnum.YES.code,
		comment: "是否显示",
	})
	displayed: typeof comBoolEnum
}
