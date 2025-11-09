import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

import { AspenRule, AspenSummary, BaseRecordDb } from "@aspen/aspen-core"

import { FrameDictItemEntity } from "./frame-dict-item-entity"

@Entity({ comment: "字典", name: "frame_dict" })
export class FrameDictEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "字典id" })
	@AspenSummary({ summary: "字典摘要", rule: AspenRule().isNotEmpty() })
	id: string

	@Column({ type: "varchar", length: 64, unique: true, comment: "字典code" })
	@AspenSummary({ summary: "字典code", rule: AspenRule().isNotEmpty() })
	code: string

	@Column({ type: "varchar", length: 256, comment: "字典摘要" })
	@AspenSummary({ summary: "字典摘要", rule: AspenRule().isNotEmpty() })
	summary: string

	@Column({ type: "varchar", length: 32, default: "1", comment: "字典类型(1:自动生成,2:用户创建)" })
	genType: string

	@Column({ type: "int", default: 0, comment: "排序" })
	@AspenSummary({ summary: "排序", rule: AspenRule() })
	sort: number

	@OneToMany(() => FrameDictItemEntity, (dict) => dict.dict, { cascade: ["insert", "remove"] })
	dictList: FrameDictItemEntity[]
}
