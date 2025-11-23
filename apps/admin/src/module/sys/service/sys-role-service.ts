import { Injectable } from "@nestjs/common"
import { In, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

import * as _ from "radash"

import { OrmQuery, exception, RedisTool } from "@aspen/aspen-core"
import { cache } from "@aspen/aspen-framework"

import { SysRoleEntity, SysRoleSaveDto } from "../common/entity/sys-role-entity"

@Injectable()
export class SysRoleService {
	constructor(
		@InjectRepository(SysRoleEntity) private readonly sysRoleRepo: Repository<SysRoleEntity>,
		private readonly redisTool: RedisTool,
	) {}

	// 权限分页查询
	async scopePage(query: SysRoleEntity) {
		const queryBuilder = this.sysRoleRepo.createQueryBuilder("sys_role")
		if (!_.isEmpty(query.roleName)) {
			queryBuilder.where("sys_role.roleName like :roleNameLike", { roleNameLike: `%${query.roleName}%` })
		}
		queryBuilder.orderBy("sys_role.sort", "DESC")
		return queryBuilder.pageMany()
	}

	// 根据角色id查询角色
	@cache.able({ key: "sys:role:id", value: ([roleId]) => `${roleId}`, expiresIn: "2h" })
	async getByRoleId(roleId: string): Promise<SysRoleEntity | null> {
		return this.sysRoleRepo.findOneBy({ roleId: roleId })
	}

	// 根据角色code查询角色
	@cache.able({ key: "sys:role:code", value: ([roleId]) => `${roleId}`, expiresIn: "2h" })
	getByRoleCode(roleCode: string) {
		return this.sysRoleRepo.findOneBy({ roleCode: roleCode })
	}

	// 新增
	@cache.put({ key: "sys:role:id", value: (_, result) => `${result.roleId}`, expiresIn: "1h" })
	async save(dto: SysRoleSaveDto): Promise<SysRoleEntity> {
		if (await this.isRoleNameDuplicate(dto.roleName, null)) {
			throw new exception.validator(`角色名"${dto.roleName}"重复`)
		}
		if (await this.isRoleCodeDuplicate(dto.roleCode, null)) {
			throw new exception.validator(`角色code"${dto.roleCode}"重复`)
		}
		const saveObj = await this.sysRoleRepo.save(dto.toEntity())
		return saveObj
	}

	// 修改
	@cache.evict({ key: "sys:role:id", value: ([dto]) => `${dto.roleId}` })
	async edit(dto: SysRoleSaveDto): Promise<void> {
		const role = await this.getByRoleId(dto.roleId)
		if (!role) {
			throw new exception.validator(`角色id"${dto.roleId}"不存在`)
		}
		if (await this.isRoleNameDuplicate(dto.roleName, dto.roleId)) {
			throw new exception.validator(`角色名"${dto.roleName}"重复`)
		}
		if (await this.isRoleCodeDuplicate(dto.roleCode, dto.roleId)) {
			throw new exception.validator(`角色code"${dto.roleCode}"重复`)
		}
		await this.sysRoleRepo.update({ roleId: dto.roleId }, dto.toEntity())
	}

	// 删除
	async delByIds(roleIds: Array<string>): Promise<number> {
		// 查询存不存在
		const roleList = await this.sysRoleRepo.find({ where: { roleId: In(roleIds) } })
		if (!roleList.length) return 0
		const delRoleIds = roleList.map((v) => v.roleId)
		// 删除数据
		const { affected } = await this.sysRoleRepo.softDelete(delRoleIds)
		// 删除缓存
		this.redisTool.del(delRoleIds.map((v) => `sys:role:id:${v}`))
		return affected ?? 0
	}

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
