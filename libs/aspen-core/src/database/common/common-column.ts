import { Column } from "typeorm"

/**
 * 排序嵌入实体
 */
export class SortColumn {
	@Column({ type: "int", default: 0, comment: "倒序排序(越大越在前面)" })
	sort: number
}

/**
 * 地址嵌入实体
 */
export class LocationColumn {
	@Column({ type: "decimal", precision: 10, scale: 6, comment: "经度" })
	lng: number

	@Column({ type: "decimal", precision: 10, scale: 6, comment: "纬度" })
	lat: number
}
