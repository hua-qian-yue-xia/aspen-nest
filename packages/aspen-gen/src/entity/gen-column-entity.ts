import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity({ comment: "列" })
export class GenColumnEntity {
	@PrimaryColumn({ type: "bigint", length: 20, comment: "列id" })
	tableId: number

	@PrimaryColumn({ type: "varchar", length: 32, unique: true, comment: "列名" })
	tableName: string

	@PrimaryColumn({ type: "varchar", length: 32, unique: true, comment: "字段分类" })
	fieldGroup: string

	@PrimaryColumn({ type: "varchar", length: 32, unique: true, comment: "字段类型" })
	fieldType: string

	@PrimaryColumn({ type: "varchar", length: 32, unique: true, comment: "字段长度" })
	fieldLength: number

	@PrimaryColumn({ type: "varchar", length: 128, comment: "列描述" })
	comment: string

	@Column({ type: "int", length: 8, comment: "列排序" })
	sort: number
}
