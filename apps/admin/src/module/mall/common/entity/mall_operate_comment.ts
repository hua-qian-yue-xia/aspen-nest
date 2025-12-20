import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

import { BaseRecordDb } from "@aspen/aspen-core"
import { enums } from "@aspen/aspen-framework"

const { comBoolEnum } = enums

@Entity({ comment: "用户评论商品操作记录", name: "mall_operate_comment" })
export class MallOperateCommentEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "主键ID" })
	id: string

	/**
	 * 用户字段冗余
	 */
	@Column({ type: "varchar", length: 36, comment: "用户ID" })
	userId: string

	@Column({ type: "boolean", default: false, comment: "是否匿名" })
	@Column({
		type: "enum",
		enum: comBoolEnum.getKeys(),
		default: comBoolEnum.NO.code,
		comment: "是否匿名",
	})
	anonymous: boolean

	@Column({ type: "varchar", length: 36, nullable: true, comment: "用户昵称" })
	nickname?: string

	@Column({ type: "varchar", length: 256, nullable: true, comment: "用户头像" })
	avatar?: string

	@Column({ type: "varchar", length: 36, comment: "spu id" })
	spuId: string

	@Column({ type: "varchar", length: 256, nullable: true, comment: "商品名称" })
	spuName?: string

	@Column({ type: "varchar", length: 36, comment: "sku id" })
	skuId: string

	@Column({ type: "json", nullable: true, comment: "sku 图片(JSON数组)" })
	skuImages?: Array<string>

	@Column({ type: "varchar", length: 256, nullable: true, comment: "sku 规格描述" })
	skuSpecDesc?: string

	@Column({ type: "tinyint", length: 4, nullable: true, comment: "评分星级1-5分" })
	scores?: number

	@Column({ type: "tinyint", length: 4, nullable: true, comment: "描述星级1-5星" })
	descriptionScores?: number

	@Column({ type: "tinyint", length: 4, nullable: true, comment: "服务星级1-5星" })
	benefitScores?: number

	@Column({ type: "varchar", length: 256, nullable: true, comment: "评价内容" })
	content?: string

	@Column({ type: "json", nullable: true, comment: "评价图片(JSON数组)" })
	contentImages?: Array<string>

	@Column({
		type: "enum",
		enum: comBoolEnum.getKeys(),
		default: comBoolEnum.NO.code,
		comment: "商家是否回复",
	})
	replyStatus?: typeof comBoolEnum

	@Column({ type: "varchar", length: 36, nullable: true, comment: "商家回复人id" })
	replyUserId?: string

	@Column({ type: "varchar", length: 256, nullable: true, comment: "商家回复内容" })
	replyContent?: string

	@Column({ type: "json", nullable: true, comment: "商家回复图片(JSON数组)" })
	replyContentImages?: Array<string>

	@Column({ type: "datetime", nullable: true, comment: "商家回复时间" })
	replyTime?: Date
}
