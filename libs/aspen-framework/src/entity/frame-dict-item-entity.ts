import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { BaseRecordDb, SortColumn } from "@aspen/aspen-core"

import { FrameDictEntity } from "./frame-dict-entity"

@Entity({ comment: "字典项", name: "frame_dict_item" })
export class FrameDictItemEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "字典项id" })
	id: string

	@ManyToOne(() => FrameDictEntity, (dict) => dict.dictList, { onDelete: "CASCADE" })
	@JoinTable({ name: "dictId" })
	dict: FrameDictEntity

	@Column({ type: "varchar", length: 64, comment: "字典code" })
	code: string

	@Column({ type: "varchar", length: 256, comment: "字典摘要" })
	summary: string

	@Column(() => SortColumn, { prefix: false })
	sort: SortColumn

	override props(): Array<keyof FrameDictItemEntity> {
		return ["code", "summary", "sort"]
	}
}
