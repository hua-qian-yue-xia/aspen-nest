import { SelectQueryBuilder, Repository, FindManyOptions } from "typeorm"

import { BasePageVo, ApplicationCtx } from "@aspen/aspen-core/index"

/******************** start 扩展SelectQueryBuilder start ********************/
declare module "typeorm/query-builder/SelectQueryBuilder" {
	interface SelectQueryBuilder<Entity> {
		pageMany(this: SelectQueryBuilder<Entity>): Promise<BasePageVo<Entity>>
		scopePageMany(this: SelectQueryBuilder<Entity>): Promise<BasePageVo<Entity>>
	}
}
// 分页查询
SelectQueryBuilder.prototype.pageMany = async function <Entity>(
	this: SelectQueryBuilder<Entity>,
): Promise<BasePageVo<Entity>> {
	const pageVo = new BasePageVo<Entity>()
	// 获取当前分页参数
	const { page, pageSize } = await ApplicationCtx.getInstance().getPage()
	// 查询总条数
	const count = await this.skip((page - 1) * pageSize)
		.take(pageSize)
		.getCount()
	if (count > 0) {
		// @ts-ignore
		pageVo.records = await this.skip((page - 1) * pageSize)
			.take(pageSize)
			.getMany()
	}
	pageVo.page = page
	pageVo.pageSize = pageSize
	pageVo.totalRecord = count
	pageVo.totalPage = Math.ceil(count / pageSize)
	return pageVo
}

// 权限分页查询
SelectQueryBuilder.prototype.scopePageMany = async function <Entity>(
	this: SelectQueryBuilder<Entity>,
): Promise<BasePageVo<Entity>> {
	const pageVo = new BasePageVo<Entity>()
	return pageVo
}

/******************** end 扩展SelectQueryBuilder end ********************/

/******************** start Repository start ********************/
declare module "typeorm/repository/Repository" {
	interface Repository<Entity> {
		page(this: Repository<Entity>, options?: FindManyOptions<Entity>): Promise<BasePageVo<Entity>>
		scopePage(this: Repository<Entity>, options?: FindManyOptions<Entity>): Promise<BasePageVo<Entity>>
	}
}
// 分页查询
Repository.prototype.page = async function <Entity>(
	this: Repository<Entity>,
	options?: FindManyOptions<Entity>,
): Promise<BasePageVo<Entity>> {
	const pageVo = new BasePageVo<Entity>()
	// 获取当前分页参数
	const { page, pageSize } = await ApplicationCtx.getInstance().getPage()
	const condition = { ...options, skip: (page - 1) * pageSize, take: pageSize }
	const count = await this.count(condition)
	if (count > 0) {
		pageVo.records = await this.find(condition)
	}
	pageVo.page = page
	pageVo.pageSize = pageSize
	pageVo.totalRecord = count
	pageVo.totalPage = Math.ceil(count / pageSize)
	return pageVo
}
/******************** start Repository end ********************/
