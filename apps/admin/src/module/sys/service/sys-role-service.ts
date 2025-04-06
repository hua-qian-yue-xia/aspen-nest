import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { SysRoleEntity } from "apps/admin/src/module/sys/_gen/_entity/index"
import { SysRoleDto } from "apps/admin/src/module/sys/dto"
import { RuntimeException } from "@aspen/aspen-core"

@Injectable()
export class SysRoleService {
	constructor(@InjectRepository(SysRoleEntity) private readonly sysRoleRep: Repository<SysRoleEntity>) {}

	// 权限分页查询
	async scopePage() {}

	// 根据角色id查询角色
	async getByRoleId(roleId: number): Promise<SysRoleEntity | null> {
		return this.sysRoleRep.findOneBy({ roleId: roleId })
	}

	// 新增
	async save(dto: SysRoleDto): Promise<number> {
		if (await this.isRoleNameDuplicate(dto.roleName, dto.roleId)) {
			throw new RuntimeException(`角色名<${dto.roleName}>重复`)
		}
		if (await this.isRoleCodeDuplicate(dto.roleCode, dto.roleId)) {
			throw new RuntimeException(`角色code<${dto.roleCode}>重复`)
		}
		const saveObj = await this.sysRoleRep.save(dto)
		return saveObj.roleId
	}

	// 修改
	async edit(dto: SysRoleDto): Promise<void> {
		if (await this.isRoleNameDuplicate(dto.roleName, dto.roleId)) {
			throw new RuntimeException(`角色名<${dto.roleName}>重复`)
		}
		if (await this.isRoleCodeDuplicate(dto.roleCode, dto.roleId)) {
			throw new RuntimeException(`角色code<${dto.roleCode}>重复`)
		}
		await this.sysRoleRep.update({ roleId: dto.roleId }, dto)
	}

	// 删除
	async delByIds(roleIds: Array<number>): Promise<number> {
		const { affected } = await this.sysRoleRep.delete(roleIds)
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
			queryBuilder.andWhere("role.roleId!= :roleId", { roleId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}
}
