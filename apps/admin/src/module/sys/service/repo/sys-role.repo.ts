import { Injectable } from "@nestjs/common"

import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { RedisTool } from "@aspen/aspen-core"

import { SysRoleEntity } from "../../common/entity/sys-role-entity"

@Injectable()
export class SysRoleRepo {
	constructor(
		@InjectRepository(SysRoleEntity) private readonly sysRoleRepo: Repository<SysRoleEntity>,
		private readonly redisTool: RedisTool,
	) {}

	// 角色名是否重复
	async isRoleNameDuplicate(roleName: string, roleId?: string): Promise<boolean> {
		const queryBuilder = this.sysRoleRepo.createQueryBuilder("role").where("role.roleName = :roleName", { roleName })
		if (roleId) {
			queryBuilder.andWhere("role.roleId != :roleId", { roleId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}

	// 角色code是否重复
	async isRoleCodeDuplicate(roleCode: string, roleId?: string): Promise<boolean> {
		const queryBuilder = this.sysRoleRepo.createQueryBuilder("role").where("role.roleCode = :roleCode", { roleCode })
		if (roleId) {
			queryBuilder.andWhere("role.roleId != :roleId", { roleId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}
}
