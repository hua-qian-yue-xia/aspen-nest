import { Repository, FindManyOptions } from "typeorm"

import { AppCtx, BasePage, BaseDb } from "@aspen/aspen-core"

export class BaseRepo<T extends BaseDb> extends Repository<T> {
	/**
	 * 获取当前req传入的分页参数
	 */
	getPage(): Promise<BasePage> {
		return AppCtx.getInstance().getPage()
	}

	/**
	 * 分页查询
	 */
	async findPage(options?: FindManyOptions): Promise<Array<T>> {
		const { page, pageSize } = await this.getPage()
		if (options == null) {
			options = {}
			options.skip = (page - 1) * pageSize
			options.take = pageSize
		}
		return this.find(options)
	}
}
