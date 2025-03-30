import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity({ comment: "列关系" })
export class GenColumnRelationEntity {
	@PrimaryColumn({ type: "bigint", length: 20, comment: "列关系id" })
	relationId: number

	@Column({ type: "varchar", length: 32, comment: "源列id" })
	sourceId: number

	@Column({ type: "varchar", length: 32, comment: "目标列id" })
	targetId: number

	@Column({ type: "int", length: 8, comment: "列关系排序" })
	sort: number
}
