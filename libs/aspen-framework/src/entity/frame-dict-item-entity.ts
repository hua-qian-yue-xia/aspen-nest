import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { AspenRule, AspenSummary, BaseRecordDb } from "@aspen/aspen-core"

import { FrameDictEntity } from "./frame-dict-entity"

@Entity({ comment: "字典项", name: "frame_dict_item" })
export class FrameDictItemEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "字典项code" })
	@AspenSummary({ summary: "字典项code" })
	id: string

	@ManyToOne(() => FrameDictEntity, (dict) => dict.dictList, { onDelete: "CASCADE" })
	@JoinTable({ name: "dict_id" })
	dict: FrameDictEntity

	@Column({ type: "char", length: 32, comment: "字典code" })
	@AspenSummary({ summary: "字典项code" })
	code: string

	@Column({ type: "varchar", length: 256, comment: "字典摘要" })
	@AspenSummary({ summary: "字典项摘要" })
	summary: string

	@Column({ type: "char", length: 32, nullable: true, comment: "字典项颜色" })
	@AspenSummary({ summary: "字典项颜色" })
	hexColor: string

	@Column({ type: "int", default: 0, comment: "排序" })
	@AspenSummary({ summary: "排序", rule: AspenRule() })
	sort: number
}
