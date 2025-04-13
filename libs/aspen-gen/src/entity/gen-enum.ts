import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm"

import { GenColorEntity } from "libs/aspen-gen/src/entity/index"

@Entity({ comment: "枚举信息", name: "gen_enum" })
export class GenEnum {
	@PrimaryColumn({ type: "bigint", comment: "枚举id" })
	enumId: number

	@Column({ type: "varchar", length: 32, comment: "枚举名" })
	enumName: string

	@Column({ type: "int", comment: "枚举排序" })
	sort: number

	@OneToOne(() => GenColorEntity)
	@JoinColumn()
	color: GenColorEntity
}
