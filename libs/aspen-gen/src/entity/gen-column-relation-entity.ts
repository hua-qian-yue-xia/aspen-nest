import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity({ comment: "列关系", name: "gen_col_relation" })
export class GenColRelationEntity {
	@PrimaryColumn({ type: "bigint", comment: "列关系id" })
	relationId: number

	@Column({ type: "varchar", length: 32, comment: "源列id" })
	sourceId: number

	@Column({ type: "varchar", length: 32, comment: "目标列id" })
	targetId: number

	@Column({ type: "int", comment: "列关系排序" })
	sort: number
}
