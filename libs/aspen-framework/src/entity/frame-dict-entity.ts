import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

import { AspenRule, AspenSummary, BaseRecordDb, SortColumn } from "@aspen/aspen-core"

import { FrameDictItemEntity } from "./frame-dict-item-entity"

@Entity({ comment: "字典", name: "frame_dict" })
export class FrameDictEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "字典id" })
	id: string

	@Column({ type: "varchar", length: 64, unique: true, comment: "字典code" })
	@AspenSummary({ summary: "字典code", rule: AspenRule().isNotEmpty() })
	code: string

	@Column({ type: "varchar", length: 256, comment: "字典摘要" })
	@AspenSummary({ summary: "字典摘要", rule: AspenRule().isNotEmpty() })
	summary: string

	@Column({ type: "varchar", length: 32, default: "1", comment: "字典类型(1:自动生成,2:用户创建)" })
	genType: string

	@Column({ type: "bit", default: true, comment: "是否启用" })
	enable: boolean

	@Column(() => SortColumn, { prefix: false })
	sort: SortColumn

	@OneToMany(() => FrameDictItemEntity, (dict) => dict.dict, { cascade: ["insert", "remove"] })
	dictList: FrameDictItemEntity[]

	override props(): Array<keyof FrameDictEntity> {
		return ["code", "summary", "enable", "sort"]
	}
}
