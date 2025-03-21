import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity({ comment: "表信息" })
export class GenTableEntity {
	@PrimaryColumn({ type: "bigint", length: 20, comment: "表id" })
	tableId: number

	@PrimaryColumn({ type: "varchar", length: 32, unique: true, comment: "表名" })
	tableName: string

	@PrimaryColumn({ type: "varchar", length: 128, comment: "表描述" })
	comment: string

	@Column({ type: "int", length: 8, comment: "表排序" })
	sort: number
}
