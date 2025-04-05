import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { SysRoleEntity } from "apps/admin/src/module/sys/_gen/_entity/index"
import { SysRoleDto } from "apps/admin/src/module/sys/dto"

@Injectable()
export class SysRoleService {
	constructor(@InjectRepository(SysRoleEntity) private readonly sysRoleRep: Repository<SysRoleEntity>) {}
	/**
	 * 权限分页查询
	 */
	async scopePage() {}
	/**
	 * 根据角色id查询角色
	 */
	async getByRoleId(roleId: number): Promise<SysRoleEntity | null> {
		return this.sysRoleRep.findOneBy({ roleId: roleId })
	}
	/**
	 * 新增
	 */
	async save(dto: SysRoleDto): Promise<number> {
		const saveObj = await this.sysRoleRep.save(dto)
		return saveObj.roleId
	}
	/**
	 * 修改
	 */
	async edit(roleIds: number[]): Promise<void> {
		console.log(roleIds)
	}
	/**
	 * 删除
	 */
	async delByIds(roleIds: Array<number>): Promise<number> {
		const { affected } = await this.sysRoleRep.delete(roleIds)
		return affected ?? 0
	}
}
