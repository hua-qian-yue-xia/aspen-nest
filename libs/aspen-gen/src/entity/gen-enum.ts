import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm"

import { GenColor } from "libs/aspen-gen/src/entity/index"

@Entity({ comment: "枚举信息" })
export class GenEnum {
	@PrimaryColumn({ type: "bigint", length: 20, comment: "枚举id" })
	enumId: number

	@Column({ type: "varchar", length: 32, comment: "枚举名" })
	enumName: string

	@Column({ type: "int", length: 8, comment: "枚举排序" })
	sort: number

	@OneToOne(() => GenColor)
	@JoinColumn()
	color: GenColor
}
