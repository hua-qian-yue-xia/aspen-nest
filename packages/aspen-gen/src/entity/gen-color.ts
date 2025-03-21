import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity({ comment: "颜色" })
export class GenColor {
	@PrimaryColumn({ type: "bigint", length: 20, comment: "颜色id" })
	colorId: number

	@Column({ type: "varchar", length: 32, comment: "颜色代码" })
	colorCode: string

	@Column({ type: "int", length: 8, comment: "颜色排序" })
	sort: number
}
