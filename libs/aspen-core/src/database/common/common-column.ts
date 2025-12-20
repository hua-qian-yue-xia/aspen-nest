import { Column } from "typeorm"
import pinyin from "pinyin"

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
	@Column({ type: "varchar", length: 64, nullable: true, comment: "省份" })
	provinceStr?: string

	@Column({ type: "varchar", length: 64, nullable: true, comment: "城市" })
	cityStr?: string

	@Column({ type: "varchar", length: 64, nullable: true, comment: "区县" })
	districtStr?: string

	@Column({ type: "decimal", precision: 10, scale: 6, nullable: true, comment: "经度(x轴)" })
	lng?: string

	@Column({ type: "decimal", precision: 10, scale: 6, nullable: true, comment: "纬度(y轴)" })
	lat?: string

	/**
	 * 详细地址
	 * @example "浙江省杭州市萧山区纤旭巷-萧山区和平桥村莫家港88号楼(纤旭巷东)"
	 */
	@Column({ type: "varchar", length: 256, nullable: true, comment: "详细地址" })
	detail?: string
}
