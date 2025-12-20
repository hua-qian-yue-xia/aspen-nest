import { Brackets, Repository } from "typeorm"
import { plainToInstance } from "class-transformer"
import * as _ from "radash"

import { AspenRule, AspenSummary } from "@aspen/aspen-core"
import { FrameDictEntity } from "@aspen/aspen-framework"

/*
 * ---------------------------------------------------------------
 * ## 字典表
 * ---------------------------------------------------------------
 */
export { FrameDictEntity }

/*
 * ---------------------------------------------------------------
 * ## 字典-搜索
 * ---------------------------------------------------------------
 */
export class FrameDictQueryDto {
	@AspenSummary({ summary: "字典编码/名称", rule: AspenRule() })
	quick?: string

	createQueryBuilder(repo: Repository<FrameDictEntity>) {
		const query = repo.createQueryBuilder("a")
		if (!_.isEmpty(this.quick)) {
			query.where(
				new Brackets((qb) => {
					qb.where("a.code LIKE :quick", { quick: `%${this.quick}%` })
					qb.orWhere("a.summary LIKE :quick", { quick: `%${this.quick}%` })
				}),
			)
		}
		query.orderBy("a.sort", "DESC").addOrderBy("a.code", "DESC")
		return query
	}
}

/*
 * ---------------------------------------------------------------
 * ## 字典-新增
 * ---------------------------------------------------------------
 */
export class FrameDictSaveDto {
	@AspenSummary({ summary: "id", rule: AspenRule() })
	id: string

	@AspenSummary({ summary: "字典编码", rule: AspenRule().isNotEmpty() })
	code: string

	@AspenSummary({ summary: "字典名称", rule: AspenRule().isNotEmpty() })
	summary: string

	@AspenSummary({ summary: "排序", rule: AspenRule() })
	sort: number

	toEntity() {
		const obj = plainToInstance(FrameDictEntity, this)
		if (_.isEmpty(obj.sort)) obj.sort = 0
		return obj
	}
}
