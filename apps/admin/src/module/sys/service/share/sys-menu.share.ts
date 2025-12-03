import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Brackets, Repository } from "typeorm"

import * as _ from "radash"

import { RedisTool } from "@aspen/aspen-core"

import { SysMenuEntity, SysMenuQueryDto } from "../../common/entity/sys-menu-entity"

@Injectable()
export class SysMenuShare {
	constructor(
		@InjectRepository(SysMenuEntity) private readonly sysMenuRep: Repository<SysMenuEntity>,
		private readonly redisTool: RedisTool,
	) {}

	queryDtoBuild(query: SysMenuQueryDto) {
		const queryBuilder = this.sysMenuRep.createQueryBuilder("menu")
		if (!_.isEmpty(query.menuId)) {
			queryBuilder.where("menu.menu_id = :menuId", { menuId: query.menuId })
		}
		if (!_.isEmpty(query.parentId)) {
			queryBuilder.where("menu.parent_id = :parentId", { parentId: query.parentId })
		}
		if (!_.isEmpty(query.quick)) {
			queryBuilder.where(
				new Brackets((qb) =>
					qb
						.where(`menu.menu_name like :quick`, { quick: `%${query.quick}%` })
						.orWhere(`menu.path like :quick`, { quick: `%${query.quick}%` }),
				),
			)
		}
		if (!_.isEmpty(query.type)) {
			queryBuilder.where("menu.type = :type", { type: query.type })
		}
		queryBuilder.orderBy("menu.sort", "DESC").addOrderBy("menu.menu_id", "DESC")
		return queryBuilder
	}
}
