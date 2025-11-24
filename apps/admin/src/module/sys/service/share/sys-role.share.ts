import { Injectable } from "@nestjs/common"

import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import * as _ from "radash"

import { exception, RedisTool } from "@aspen/aspen-core"

import { SysRoleEntity } from "../../common/entity/sys-role-entity"
import { sysRoleTypeEnum } from "../../common/sys-enum.enum-gen"

@Injectable()
export class SysRoleShare {
	constructor(
		@InjectRepository(SysRoleEntity) private readonly sysRoleRepo: Repository<SysRoleEntity>,
		private readonly redisTool: RedisTool,
	) {}

	// 角色名是否重复
	async isRoleNameDuplicate(entity: SysRoleEntity): Promise<boolean> {
		const queryBuilder = this.sysRoleRepo
			.createQueryBuilder("role")
			.where("role.role_name = :roleName", { roleName: entity.roleName })
		if (entity.roleType) {
			queryBuilder.andWhere("role.role_type = :roleType", { roleType: entity.roleType })
		}
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
		if (entity.roleType) {
			queryBuilder.andWhere("role.role_type = :roleType", { roleType: entity.roleType })
		}
		if (entity.roleId) {
			queryBuilder.andWhere("role.role_id != :roleId", { roleId: entity.roleId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}

	// 为`isCatalogueRole`为`true`的目录的专属角色
	async generateOrUpdateCatalogueRole(saveObj: SysRoleEntity) {
		const catalogueRole = await this.sysRoleRepo.findOneBy({
			parentRoleId: saveObj.roleId,
			isCatalogueRole: true,
		})
		if (saveObj.roleType === sysRoleTypeEnum.ROLE_CATALOGUE.code) {
			const catalogueRoleObj = SysRoleEntity.generateCatalogueRole(saveObj)
			// 新增
			if (_.isEmpty(catalogueRole)) {
				catalogueRoleObj.roleId = undefined
				await this.sysRoleRepo.save(catalogueRoleObj)
				return
			}
			// 更新
			await this.sysRoleRepo.update({ roleId: catalogueRole.roleId }, catalogueRoleObj)
		} else {
			if (catalogueRole) {
				// 判断`专属角色`下是否有人员

				// 删除
				await this.sysRoleRepo.delete({ roleId: catalogueRole.roleId })
			}
		}
	}

	// 判断传入的`roleIdList`是否存在,会抛出异常
	async checkThrowExist(str: Array<string> | string) {
		const checkRoleIdList = _.isArray(str) ? str : [str]
		// 查询所有的角色
		const roleList = await this.sysRoleRepo.find({
			where: {
				roleType: sysRoleTypeEnum.ROLE.code,
			},
		})
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
