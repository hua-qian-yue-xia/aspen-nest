import type { BasePageVo } from "@aspen/aspen-core/index"
import type { FindManyOptions } from "typeorm"

// TypeORM 类型增强声明：让其他模块识别扩展方法
declare module "typeorm" {
	interface SelectQueryBuilder<Entity> {
		pageMany(this: SelectQueryBuilder<Entity>): Promise<BasePageVo<Entity>>
		scopePageMany(this: SelectQueryBuilder<Entity>): Promise<BasePageVo<Entity>>
	}

	interface Repository<Entity> {
		page(this: Repository<Entity>, options?: FindManyOptions<Entity>): Promise<BasePageVo<Entity>>
		scopePage(this: Repository<Entity>, options?: FindManyOptions<Entity>): Promise<BasePageVo<Entity>>
	}
}
