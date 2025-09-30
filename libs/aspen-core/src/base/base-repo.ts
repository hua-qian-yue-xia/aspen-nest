import { FindManyOptions, BaseEntity, Repository, EntityTarget } from "typeorm"
import { Injectable, Inject } from "@nestjs/common"
import { getRepositoryToken } from "@nestjs/typeorm"
import { ModuleRef } from "@nestjs/core"

import { AppCtx, BasePage } from "@aspen/aspen-core"

@Injectable()
export abstract class BaseRepo<T extends BaseEntity> {
	protected repository: Repository<T>

	constructor(
		@Inject(ModuleRef) private readonly moduleRef: ModuleRef,
		private readonly entityClass: EntityTarget<T>,
	) {
		// 自动获取对应实体的Repository
		this.repository = this.moduleRef.get(getRepositoryToken(this.entityClass as any), { strict: false })
	}

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
		return this.repository.find(options)
	}

	// 代理Repository的常用方法
	get repo(): Repository<T> {
		return this.repository
	}

	// 常用方法的直接代理
	find(options?: FindManyOptions<T>) {
		return this.repository.find(options)
	}

	findOne(options: any) {
		return this.repository.findOne(options)
	}

	findOneBy(where: any) {
		return this.repository.findOneBy(where)
	}

	save(entity: any) {
		return this.repository.save(entity)
	}

	update(criteria: any, partialEntity: any) {
		return this.repository.update(criteria, partialEntity)
	}

	delete(criteria: any) {
		return this.repository.delete(criteria)
	}

	create(entityLike?: any) {
		return this.repository.create(entityLike)
	}

	createQueryBuilder(alias?: string) {
		return this.repository.createQueryBuilder(alias)
	}

	count(options?: any) {
		return this.repository.count(options)
	}

	findAndCount(options?: FindManyOptions<T>) {
		return this.repository.findAndCount(options)
	}
}
