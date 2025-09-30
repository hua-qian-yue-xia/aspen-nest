import { Column } from "typeorm"
import pinyin from "pinyin"

/**
 * 排序嵌入实体
 */
export class SortColumn {
	@Column({ type: "int", default: 0, comment: "倒序排序(越大越在前面)" })
	sort: number
}

/**
 * 拼音嵌入实体
 */
export class PinyinColumn {
	@Column({ type: "varchar", length: 64, comment: "首字母" })
	firstLetter: string

	@Column({ type: "varchar", length: 64, comment: "简拼" })
	shortPinyin: string

	@Column({ type: "varchar", length: 256, comment: "全拼" })
	fullPinyin: string

	static of(chineseText: string): PinyinColumn | null {
		new PinyinColumn()
		const pinyinList = pinyin(chineseText, { style: "normal", mode: "SURNAME", heteronym: false })
		if (!pinyinList || !pinyinList.length) return null
		const fatPinyinList = pinyinList.flat()
		// 首字母
		const firstLetter = fatPinyinList[0].charAt(0)
		// 简拼
		const shortPinyin = fatPinyinList.join("")
		// 全拼
		const fullPinyin = fatPinyinList.join(" ")

		const pinyinColumn = new PinyinColumn()
		pinyinColumn.firstLetter = firstLetter
		pinyinColumn.shortPinyin = shortPinyin
		pinyinColumn.fullPinyin = fullPinyin
		return pinyinColumn
	}
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
