import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"

import { GenColEntity } from "libs/aspen-gen/src/entity/index"

@Entity({ comment: "表信息", name: "gen_table" })
export class GenTableEntity {
	@PrimaryColumn({ type: "bigint", comment: "表id" })
	tableId: number

	@PrimaryColumn({ type: "varchar", length: 32, unique: true, comment: "表名" })
	tableName: string

	@PrimaryColumn({ type: "varchar", length: 128, comment: "表描述" })
	comment: string

	@Column({ type: "int", comment: "表排序" })
	sort: number

	@OneToMany(() => GenColEntity, (genColumn) => genColumn.table)
	columnList: Array<GenColEntity>
}
