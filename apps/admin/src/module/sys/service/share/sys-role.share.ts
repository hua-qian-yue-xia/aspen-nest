import { Injectable } from "@nestjs/common"

import { InjectRepository } from "@nestjs/typeorm"
import { Brackets, In, Repository } from "typeorm"

import * as _ from "radash"

import { exception, RedisTool } from "@aspen/aspen-core"

import { SysRoleEntity, SysRoleQueryDto } from "../../common/entity/sys-role-entity"
import { sysRoleTypeEnum } from "../../common/sys-enum.enum-gen"

@Injectable()
export class SysRoleShare {
	constructor(
		@InjectRepository(SysRoleEntity) private readonly sysRoleRepo: Repository<SysRoleEntity>,
		private readonly redisTool: RedisTool,
	) {}

	queryDtoBuild(query: SysRoleQueryDto) {
		const queryBuilder = this.sysRoleRepo.createQueryBuilder("sys_role")
		if (!_.isEmpty(query.roleId)) {
			queryBuilder.where("sys_role.role_id = :roleId", { roleId: query.roleId })
		}
		if (!_.isEmpty(query.quick)) {
			queryBuilder.where(
				new Brackets((qb) =>
					qb
						.where(`sys_role.role_name like :quick`, { quick: `%${query.quick}%` })
						.orWhere(`sys_role.role_code like :quick`, { quick: `%${query.quick}%` }),
				),
			)
		}
		queryBuilder.orderBy("sys_role.sort", "DESC")
		return queryBuilder
	}

	// 角色名是否重复
	async isRoleNameDuplicate(entity: SysRoleEntity): Promise<boolean> {
		const queryBuilder = this.sysRoleRepo
			.createQueryBuilder("role")
			.where("role.role_name = :roleName", { roleName: entity.roleName })
		if (entity.roleId) {
			queryBuilder.andWhere("role.role_id != :roleId", { roleId: entity.roleId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}

	// 角色code是否重复
	async isRoleCodeDuplicate(entity: SysRoleEntity): Promise<boolean> {
		const queryBuilder = this.sysRoleRepo
			.createQueryBuilder("role")
			.where("role.role_code = :roleCode", { roleCode: entity.roleCode })
		if (entity.roleId) {
			queryBuilder.andWhere("role.role_id != :roleId", { roleId: entity.roleId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}

	// 判断传入的`roleIdList`是否存在,会抛出异常
	async checkThrowExist(str: Array<string> | string) {
		const checkRoleIdList = _.isArray(str) ? str : [str]
		// 查询所有的角色
		const roleList = await this.sysRoleRepo.find()
		if (_.isEmpty(roleList)) {
			return []
		}
		const roleIdList = roleList.map((v) => v.roleId)
		for (const checkRoleId of checkRoleIdList) {
			if (!roleIdList.includes(checkRoleId)) {
				// TODO 高风险
				throw new exception.runtime(`传入的角色idList中存在不存在的角色id:${checkRoleId}`)
			}
		}
		return roleList.filter((v) => checkRoleIdList.includes(v.roleId))
	}
}
