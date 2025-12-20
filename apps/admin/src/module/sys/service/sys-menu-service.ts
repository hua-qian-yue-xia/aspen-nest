import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { plainToInstance } from "class-transformer"
import * as _ from "radash"

import { RedisTool, tool } from "@aspen/aspen-core"
import { cache } from "@aspen/aspen-framework"

import { sysMenuTypeEnum } from "../common/sys-enum.enum-gen"
import { SysMenuEntity, SysMenuQueryDto, SysMenuSaveDto } from "../common/entity/sys-menu-entity"
import { SysMenuShare } from "./share/sys-menu.share"

@Injectable()
export class SysMenuService {
	constructor(
		@InjectRepository(SysMenuEntity) private readonly sysMenuRep: Repository<SysMenuEntity>,

		private readonly sysMenuShare: SysMenuShare,
		private readonly redisTool: RedisTool,
	) {}

	// 分页查询
	async scopePage(query: SysMenuQueryDto) {
		const page = query.createQueryBuilder(this.sysMenuRep).pageMany()
	}

	// 树状接口
	async tree(query: SysMenuQueryDto) {
		const rootMenuId = query.parentId ?? SysMenuEntity.getNotExistRootMenuId()
		if (rootMenuId !== SysMenuEntity.getNotExistRootMenuId()) {
			query.parentId = rootMenuId
		}
		const treeList = await this.sysMenuRep
			.createQueryBuilder("a")
			.orderBy("a.sort", "DESC")
			.addOrderBy("a.menu_id", "DESC")
			.getMany()
		// 转换为树状结构
		let tree = tool.tree.toTree(treeList, {
			idKey: "menuId",
			parentIdKey: "parentId",
			childrenKey: "children",
			rootParentValue: rootMenuId,
			sort: (a, b) => {
				return b.sort - a.sort
			},
			excludeKeys: ["delAt", "delBy", "updateBy", "updateAt"],
		})
		if (!_.isEmpty(query.quick)) {
			tree = tool.tree.filter(
				tree,
				(node) => {
					return node?.menuName?.includes(query.quick) || node?.path?.includes(query.quick)
				},
				"children",
			)
		}
		return tree
	}

	// 根据部门id查询部门
	@cache.able({ key: "sys:menu:id", value: ([menuId]) => `${menuId}`, expiresIn: "2h" })
	async getByMenuId(menuId: string) {
		return this.sysMenuRep.findOneBy({ menuId: menuId })
	}

	// 新增菜单
	@cache.put({ key: "sys:menu:id", value: (_, result) => `${result.menuId}`, expiresIn: "2h" })
	async save(dto: SysMenuSaveDto) {
		if (await this.isPathDuplicate(dto.path, null)) {
			throw new DOMException(`路径"${dto.path}"重复`)
		}
		const saveObj = await this.sysMenuRep.save(dto.toEntity())
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
			obj.path = null
		}
		await this.sysMenuRep.update({ menuId: dto.menuId }, obj)
	}

	// 根据菜单ids删除菜单
	async delByIds(menuIds: Array<string>) {
		// 查询存不存在
		const menuList = await this.sysMenuRep.find({ where: { menuId: In(menuIds) } })
		if (!menuList.length) return 0
		const delMenuIds = menuList.map((v) => v.menuId)
		// 删除数据
		const { affected } = await this.sysMenuRep.softDelete(delMenuIds)
		// 删除缓存
		this.redisTool.del(delMenuIds.map((v) => `sys:menu:id:${v}`))
		return affected ?? 0
	}

	// 菜单path是否重复
	async isPathDuplicate(path: string, menuId?: string): Promise<boolean> {
		const queryBuilder = this.sysMenuRep.createQueryBuilder("menu").where("menu.path = :path", { path })
		if (menuId) {
			queryBuilder.andWhere("menu.menuId != :menuId", { menuId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}
}
