import { Column, Entity, PrimaryColumn } from "typeorm"
import { BaseRecordDb } from "libs/aspen-core/src"

@Entity({ comment: "颜色", name: "gen_color" })
export class GenColorEntity extends BaseRecordDb {
	@PrimaryColumn({ type: "bigint", comment: "颜色id" })
	colorId: number

	@Column({ type: "varchar", length: 32, comment: "颜色名称" })
	colorName: string

	@Column({ type: "varchar", length: 32, comment: "颜色代码" })
	colorCode: string

	@Column({ type: "int", comment: "颜色排序" })
	sort: number
}
