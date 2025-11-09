import { R, router } from "@aspen/aspen-core"
import { Body, Param, ParseArrayPipe } from "@nestjs/common"

import { SysMenuService } from "../service/sys-menu-service"

import { SysMenuEntity, SysMenuSaveDto } from "../common/entity/sys-menu-entity"

@router.controller({ prefix: "sys/menu", summary: "菜单管理" })
export class SysMenuController {
	constructor(private readonly sysMenuService: SysMenuService) {}

	@router.get({
		summary: "分页",
		router: "/page",
		resType: {
			type: SysMenuEntity,
			wrapper: "page",
		},
	})
	async page(@Body() query: SysMenuEntity) {
		const list = await this.sysMenuService.scopePage()
		return R.success(list)
	}

	@router.get({
		summary: "下拉(没有权限控制)",
		router: "/select",
		resType: {
			type: SysMenuEntity,
			wrapper: "page",
		},
	})
	async select(@Body() query: SysMenuEntity) {
		const list = await this.sysMenuService.scopePage()
		return R.success(list)
	}

	@router.get({
		summary: "根据菜单id查询用户",
		description: "有缓存",
		router: "/id/:menuId",
		resType: {
			type: SysMenuEntity,
		},
	})
	async getByMenuId(@Param("menuId") menuId: number) {
		const detail = await this.sysMenuService.getByMenuId(menuId)
		return R.success(detail)
	}

	@router.patch({
		summary: "根据部门id查询部门(有缓存)",
		router: "/id/:menuId",
	})
	async getByRoleId(@Param("menuId") menuId: number) {
		const menuDetail = await this.sysMenuService.getByMenuId(menuId)
		return R.success(menuDetail)
	}

	@router.post({
		summary: "新增菜单",
		description: "有缓存",
		router: "/",
	})
	async save(@Body() dto: SysMenuSaveDto) {
		await this.sysMenuService.save(dto)
		return R.success()
	}

	@router.put({
		summary: "修改菜单",
		description: "有缓存",
		router: "/",
		rateLimit: {},
	})
	async edit(@Body() dto: SysMenuSaveDto) {
		await this.sysMenuService.edit(dto)
		return R.success()
	}

	@router.delete({
		summary: "根据菜单ids删除菜单",
		router: "/:menuIds",
	})
	async delete(
		@Param("menuIds", new ParseArrayPipe({ items: Number, separator: "," }))
		menuIds: Array<number>,
	) {
		const delCount = await this.sysMenuService.delByIds(menuIds)
		return R.success(delCount)
	}
}
