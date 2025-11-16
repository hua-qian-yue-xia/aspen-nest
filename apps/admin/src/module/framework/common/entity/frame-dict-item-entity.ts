import { plainToInstance } from "class-transformer"
import * as _ from "radash"

import { AspenRule, AspenSummary, OrmQuery } from "@aspen/aspen-core"
import { FrameDictItemEntity } from "@aspen/aspen-framework"

/*
 * ---------------------------------------------------------------
 * ## 字典项表
 * ---------------------------------------------------------------
 */
export { FrameDictItemEntity }

/*
 * ---------------------------------------------------------------
 * ## 字典项-查询
 * ---------------------------------------------------------------
 */
export class FrameDictItemQueryDto {
	@AspenSummary({ summary: "字典项编码", rule: AspenRule() })
	code: string

	@AspenSummary({ summary: "字典id", rule: AspenRule() })
	dictId: string
}

/*
 * ---------------------------------------------------------------
 * ## 字典-新增
 * ---------------------------------------------------------------
 */
export class FrameDictItemSaveDto {
	@AspenSummary({ summary: "id", rule: AspenRule() })
	id: string

	@AspenSummary({ summary: "字典编码", rule: AspenRule().isNotEmpty() })
	code: string

	@AspenSummary({ summary: "字典名称", rule: AspenRule().isNotEmpty() })
	summary: string

	@AspenSummary({ summary: "字典项颜色", rule: AspenRule() })
	hexColor: string

	@AspenSummary({ summary: "排序", rule: AspenRule() })
	sort: number

	toEntity() {
		const obj = plainToInstance(FrameDictItemEntity, this)
		if (_.isEmpty(obj.sort)) obj.sort = 0
		return obj
	}
}
