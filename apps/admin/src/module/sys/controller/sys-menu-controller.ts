import { R, router } from "@aspen/aspen-core"
import { Param } from "@nestjs/common"

import { SysMenuService } from "apps/admin/src/module/sys/service"

@router.controller({ prefix: "sys/menu", summary: "菜单管理" })
export class SysMenuController {
	constructor(private readonly sysMenuService: SysMenuService) {}

	@router.get({
		summary: "分页",
		router: "/page",
	})
	async page() {
		const list = await this.sysMenuService.scopePage()
		return R.success(list)
	}

	@router.get({
		summary: "下拉(没有权限控制)",
		router: "/select",
	})
	async select() {
		const list = await this.sysMenuService.scopePage()
		return R.success(list)
	}

	@router.patch({
		summary: "根据部门id查询部门(有缓存)",
		router: "/id/:menuId",
		log: {
			tag: "OTHER",
		},
	})
	async getByRoleId(@Param("menuId") menuId: number) {
		const menuDetail = await this.sysMenuService.getByMenuId(menuId)
		return R.success(menuDetail)
	}
}
