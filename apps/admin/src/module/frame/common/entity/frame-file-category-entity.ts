import { Repository } from "typeorm"
import { plainToInstance } from "class-transformer"
import * as _ from "radash"

import { AspenRule, AspenSummary } from "@aspen/aspen-core"
import { FrameFileCategoryEntity } from "@aspen/aspen-framework"

export { FrameFileCategoryEntity }

/*
 * ---------------------------------------------------------------
 * ## 文件分类-新增
 * ---------------------------------------------------------------
 */
export class FrameFileCategorySaveDto {
	@AspenSummary({ summary: "文件分类id", rule: AspenRule() })
	categoryId?: string

	@AspenSummary({ summary: "文件分类名称", rule: AspenRule().isNotEmpty() })
	categoryName: string

	@AspenSummary({ summary: "排序", rule: AspenRule() })
	sort?: number

	toEntity() {
		const obj = plainToInstance(FrameFileCategoryEntity, this)
		if (_.isEmpty(obj.categoryId)) obj.categoryId = undefined
		if (_.isEmpty(obj.sort)) obj.sort = 0
		return obj
	}
}

/*
 * ---------------------------------------------------------------
 * ## 文件分类-查询
 * ---------------------------------------------------------------
 */
export class FrameFileCategoryQueryDto {
	@AspenSummary({ summary: "文件分类名称", rule: AspenRule() })
	quick?: string

	createQueryBuilder(repo: Repository<FrameFileCategoryEntity>) {
		const query = repo.createQueryBuilder("a")
		if (!_.isEmpty(this.quick)) {
			query.andWhere("a.category_name like :quick", { quick: `%${this.quick}%` })
		}
		query.orderBy("a.sort", "DESC").addOrderBy("a.category_id", "DESC")
		return query
	}
}
