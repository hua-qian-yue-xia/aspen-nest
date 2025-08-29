import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { plainToInstance } from "class-transformer"

import { OrmQuery, exception, RedisTool } from "@aspen/aspen-core"
import { cache } from "@aspen/aspen-framework"

import { SysRoleEntity } from "apps/admin/src/module/sys/_gen/_entity/index"
import { SysRoleSaveDto, SysRoleEditDto, SysRolePaDto as SysRoleDto } from "apps/admin/src/module/sys/dto"

@Injectable()
export class SysRoleService {
	constructor(
		@InjectRepository(SysRoleEntity) private readonly sysRoleRep: Repository<SysRoleEntity>,
		private readonly redisTool: RedisTool,
	) {}

	// 权限分页查询
	async scopePage(dto: SysRoleDto) {
		const where = OrmQuery.getWhereOptions(dto)
		console.log(where)
		return null
	}

	// 根据角色id查询角色
	@cache.able({ key: "sys:role:id", value: ([roleId]) => `${roleId}`, expiresIn: "2h" })
	async getByRoleId(roleId: number): Promise<SysRoleEntity | null> {
		return this.sysRoleRep.findOneBy({ roleId: roleId })
	}

	// 根据角色code查询角色
	@cache.able({ key: "sys:role:code", value: ([roleId]) => `${roleId}`, expiresIn: "2h" })
	getByRoleCode(roleCode: string) {
		return this.sysRoleRep.findOneBy({ roleCode: roleCode })
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
		const saveObj = await this.sysRoleRep.save(plainToInstance(SysRoleEntity, dto))
		return saveObj
	}

	// 修改
	@cache.evict({ key: "sys:role:id", value: ([dto]) => `${dto.roleId}` })
	async edit(dto: SysRoleEditDto): Promise<void> {
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
		await this.sysRoleRep.update({ roleId: dto.roleId }, plainToInstance(SysRoleEntity, dto))
	}

	// 删除
	async delByIds(roleIds: Array<number>): Promise<number> {
		// 查询存不存在
		const roleList = await this.sysRoleRep.findBy({ roleId: In(roleIds) })
		if (!roleList.length) return 0
		// 删除数据
		const { affected } = await this.sysRoleRep.delete(roleIds)
		// 删除缓存
		this.redisTool.del(roleIds.map((v) => `sys:role:id:${v}`))
		return affected ?? 0
	}

	// 角色名是否重复
	async isRoleNameDuplicate(roleName: string, roleId?: number): Promise<boolean> {
		const queryBuilder = this.sysRoleRep.createQueryBuilder("role").where("role.roleName = :roleName", { roleName })
		if (roleId) {
			queryBuilder.andWhere("role.roleId != :roleId", { roleId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}

	// 角色code是否重复
	async isRoleCodeDuplicate(roleCode: string, roleId?: number): Promise<boolean> {
		const queryBuilder = this.sysRoleRep.createQueryBuilder("role").where("role.roleCode = :roleCode", { roleCode })
		if (roleId) {
			queryBuilder.andWhere("role.roleId != :roleId", { roleId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}
}
