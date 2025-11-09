import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { plainToInstance } from "class-transformer"

import { RedisTool } from "@aspen/aspen-core"
import { cache } from "@aspen/aspen-framework"

import { sysMenuTypeEnum } from "../common/sys-enum.enum-gen"
import { SysMenuEntity, SysMenuSaveDto } from "../common/entity/sys-menu-entity"

@Injectable()
export class SysMenuService {
	constructor(
		@InjectRepository(SysMenuEntity) private readonly sysMenuEntity: Repository<SysMenuEntity>,
		private readonly redisTool: RedisTool,
	) {}

	// 权限分页查询
	async scopePage() {
		return this.sysMenuEntity.page()
	}

	// 根据部门id查询部门
	@cache.able({ key: "sys:menu:id", value: ([menuId]) => `${menuId}`, expiresIn: "2h" })
	async getByMenuId(menuId: number) {
		return this.sysMenuEntity.findOneBy({ menuId: menuId })
	}

	// 新增菜单
	@cache.put({ key: "sys:menu:id", value: (_, result) => `${result.menuId}`, expiresIn: "2h" })
	async save(dto: SysMenuSaveDto) {
		if (await this.isPathDuplicate(dto.path, null)) {
			throw new DOMException(`路径"${dto.path}"重复`)
		}
		const saveObj = await this.sysMenuEntity.save(dto.toEntity())
		return saveObj
	}

	// 修改菜单
	@cache.evict({ key: "sys:menu:id", value: ([dto]) => `${dto.menuId}` })
	async edit(dto: SysMenuSaveDto) {
		if (await this.isPathDuplicate(dto.path, dto.menuId)) {
			throw new DOMException(`路径"${dto.path}"重复`)
		}
		const obj = plainToInstance(SysMenuEntity, dto)
		if (obj.type == sysMenuTypeEnum.CATALOGUE.code) {
			obj.position = null
			obj.path = null
		}
		await this.sysMenuEntity.update({ menuId: dto.menuId }, obj)
	}

	// 根据菜单ids删除菜单
	async delByIds(menuIds: number[]) {
		// 查询存不存在
		const menuList = await this.sysMenuEntity.find({ where: { menuId: In(menuIds) } })
		if (!menuList.length) return 0
		const delMenuIds = menuList.map((v) => v.menuId)
		// 删除数据
		const { affected } = await this.sysMenuEntity.softDelete(delMenuIds)
		// 删除缓存
		this.redisTool.del(delMenuIds.map((v) => `sys:menu:id:${v}`))
		return affected ?? 0
	}

	// 菜单path是否重复
	async isPathDuplicate(path: string, menuId?: number): Promise<boolean> {
		const queryBuilder = this.sysMenuEntity.createQueryBuilder("menu").where("menu.path = :path", { path })
		if (menuId) {
			queryBuilder.andWhere("menu.menuId != :menuId", { menuId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}
}
