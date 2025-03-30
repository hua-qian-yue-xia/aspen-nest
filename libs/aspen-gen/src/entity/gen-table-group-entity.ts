import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity({ comment: "表分组" })
export class GenTableGroupEntity {
	@PrimaryColumn({ type: "bigint", length: 20, comment: "表分组id" })
	tableGroupId: number

	@PrimaryColumn({ type: "varchar", length: 32, comment: "表分组名" })
	tableGroupName: string

	@PrimaryColumn({ type: "varchar", length: 256, comment: "生成的模块地址" })
	genModulePath: string

	@Column({ type: "int", length: 8, comment: "表分组排序" })
	sort: number
}
