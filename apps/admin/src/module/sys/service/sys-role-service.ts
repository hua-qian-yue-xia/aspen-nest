import { Injectable } from "@nestjs/common"
import { In, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

import * as _ from "radash"

import { exception, RedisTool, tool } from "@aspen/aspen-core"
import { cache } from "@aspen/aspen-framework"

import { SysRoleEntity, SysRoleSaveDto } from "../common/entity/sys-role-entity"
import { SysRoleShare } from "./share/sys-role.share"

@Injectable()
export class SysRoleService {
	constructor(
		@InjectRepository(SysRoleEntity) private readonly sysRoleRepo: Repository<SysRoleEntity>,
		private readonly sysRoleShare: SysRoleShare,
		private readonly redisTool: RedisTool,
	) {}

	// 树状结构
	async scopeTree(query: SysRoleEntity) {
		// 查询所有部门
		const deptListBuilder = this.sysRoleRepo.createQueryBuilder("sys_role")
		deptListBuilder.orderBy("sys_role.is_catalogue_role", "DESC").addOrderBy("sys_role.sort", "DESC")
		const deptList = await deptListBuilder.getMany()
		if (_.isEmpty(deptList)) return []
		// 转换为树状结构
		const tree = tool.tree.toTree(deptList, {
			idKey: "roleId",
			parentIdKey: "parentRoleId",
			childrenKey: "children",
			rootParentValue: SysRoleEntity.getNotExistRootRoleId(),
			sort: (a, b) => {
				if (a.isCatalogueRole !== b.isCatalogueRole) {
					return a.isCatalogueRole ? -1 : 1
				}
				return b.sort - a.sort
			},
			excludeKeys: ["delAt", "delBy", "updateBy", "updateAt"],
		})
		return tree
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
		const entity = dto.toEntity()
		if (await this.sysRoleShare.isRoleNameDuplicate(entity)) {
			throw new exception.validator(`角色名"${dto.roleName}"重复`)
		}
		if (await this.sysRoleShare.isRoleCodeDuplicate(entity)) {
			throw new exception.validator(`角色code"${dto.roleCode}"重复`)
		}
		const saveObj = await this.sysRoleRepo.save(entity)
		// 为`isCatalogueRole`为`true`的目录的专属角色
		await this.sysRoleShare.generateOrUpdateCatalogueRole(saveObj)
		return saveObj
	}

	// 修改
	@cache.evict({ key: "sys:role:id", value: ([dto]) => `${dto.roleId}` })
	async edit(dto: SysRoleSaveDto): Promise<void> {
		const role = await this.getByRoleId(dto.roleId)
		if (!role) {
			throw new exception.validator(`角色id"${dto.roleId}"不存在`)
		}
		const entity = dto.toEntity()
		if (await this.sysRoleShare.isRoleNameDuplicate(entity)) {
			throw new exception.validator(`角色名"${dto.roleName}"重复`)
		}
		if (await this.sysRoleShare.isRoleCodeDuplicate(entity)) {
			throw new exception.validator(`角色code"${dto.roleCode}"重复`)
		}
		await this.sysRoleRepo.update({ roleId: dto.roleId }, entity)
		// 为`isCatalogueRole`为`true`的目录的专属角色
		await this.sysRoleShare.generateOrUpdateCatalogueRole(entity)
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
}
