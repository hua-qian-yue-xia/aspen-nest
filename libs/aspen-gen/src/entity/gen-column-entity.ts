import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm"
import { GenTableEntity } from "libs/aspen-gen/src/entity/gen-table-entity"

@Entity({ comment: "列", name: "gen_col" })
export class GenColEntity {
	@PrimaryColumn({ type: "bigint", comment: "列id" })
	columnId: number

	@PrimaryColumn({ type: "varchar", length: 32, unique: true, comment: "列名" })
	columnName: string

	@PrimaryColumn({ type: "varchar", length: 32, unique: true, comment: "字段分类" })
	fieldGroup: string

	@PrimaryColumn({ type: "varchar", length: 32, unique: true, comment: "字段类型" })
	fieldType: string

	@PrimaryColumn({ type: "varchar", length: 32, unique: true, comment: "字段长度" })
	fieldLength: number

	@PrimaryColumn({ type: "varchar", length: 128, comment: "列描述" })
	comment: string

	@Column({ type: "int", comment: "列排序" })
	sort: number

	@ManyToOne(() => GenTableEntity, (genTable) => genTable.columnList)
	table: GenTableEntity
}
