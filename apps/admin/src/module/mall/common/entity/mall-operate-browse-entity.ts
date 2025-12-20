import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

import { BaseRecordDb } from "@aspen/aspen-core"

@Entity({ comment: "用户浏览商品操作记录", name: "mall_operate_browse" })
export class MallOperateBrowseEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "主键ID" })
	id: string

	@Column({ type: "varchar", length: 36, comment: "用户ID" })
	userId: string

	@Column({ type: "varchar", length: 36, comment: "商品ID" })
	productId: string
}
