import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity({ comment: "枚举信息" })
export class GenEnum {
	@PrimaryColumn({ type: "bigint", length: 20, comment: "枚举id" })
	enumId: number

	@Column({ type: "varchar", length: 32, comment: "枚举名" })
	enumName: string

	@Column({ type: "int", length: 8, comment: "枚举排序" })
	sort: number
}
