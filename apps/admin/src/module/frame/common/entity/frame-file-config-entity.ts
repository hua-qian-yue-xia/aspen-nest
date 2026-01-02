import { Brackets, Repository } from "typeorm"
import { plainToInstance } from "class-transformer"
import * as _ from "radash"

import { AspenRule, AspenSummary } from "@aspen/aspen-core"
import { enums, FrameFileConfigEntity } from "@aspen/aspen-framework"

/*
 * ---------------------------------------------------------------
 * ## 文件配置管理
 * ---------------------------------------------------------------
 */
export { FrameFileConfigEntity }

/*
 * ---------------------------------------------------------------
 * ## 文件配置管理-新增
 * ---------------------------------------------------------------
 */
export class FrameFileConfigSaveDto {
	@AspenSummary({ summary: "文件配置id" })
	configId?: string

	@AspenSummary({ summary: "文件配置名称" })
	name: string

	@AspenSummary({ summary: "存储类型" })
	type: string

	@AspenSummary({ summary: "文件配置" })
	config: Record<string, any>

	@AspenSummary({ summary: "是否启用" })
	default?: string

	@AspenSummary({ summary: "文件配置描述" })
	description?: string

	toEntity() {
		const obj = plainToInstance(FrameFileConfigEntity, this)
		if (_.isEmpty(obj.configId)) obj.configId = undefined
		if (_.isEmpty(obj.default)) obj.default = enums.comEnableEnum.NO
		return obj
	}
}

/*
 * ---------------------------------------------------------------
 * ## 文件配置管理-查询
 * ---------------------------------------------------------------
 */
export class FrameFileConfigQueryDto {
	@AspenSummary({ summary: "配置名", rule: AspenRule() })
	quick?: string

	createQueryBuilder(repo: Repository<FrameFileConfigEntity>) {
		const query = repo.createQueryBuilder("a")
		if (!_.isEmpty(this.quick)) {
			query.where(
				new Brackets((qb) => {
					qb.where("a.name LIKE :name", { name: `%${this.quick}%` })
				}),
			)
		}
		query.orderBy("a.create_at", "DESC").addOrderBy("a.config_id", "DESC")
		return query
	}
}
