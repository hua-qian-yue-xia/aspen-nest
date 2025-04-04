import { Body, Controller, Param } from "@nestjs/common"

import { R, router } from "@aspen/aspen-core"

import { SysRoleService } from "apps/admin/src/module/sys/service"
import { SysRoleDto } from "apps/admin/src/module/sys/dto"

@Controller("sys/role")
export class SysRoleController {
	constructor(private readonly sysRoleService: SysRoleService) {}

	@router.get({
		summary: "分页",
		router: "/page",
	})
	async page() {
		this.sysRoleService.scopePage()
		R.success()
	}

	@router.get({
		summary: "下拉",
		description: "没有权限控制",
		router: "/select",
	})
	async select() {
		this.sysRoleService.scopePage()
		R.success()
	}

	@router.patch({
		summary: "根据角色id查询角色",
		description: "有缓存",
		router: "/get/:roleId",
	})
	async getByRoleId(@Param("roleId") roleId: number) {
		const roleDetail = await this.sysRoleService.getByRoleId(roleId)
		R.success(roleDetail)
	}

	@router.post({
		summary: "新增",
		router: "",
	})
	async save(@Body() dto: SysRoleDto) {
		await this.sysRoleService.save(dto)
		R.success()
	}

	@router.put({
		summary: "修改",
		router: "",
	})
	async edit(@Body() roleIds: Array<number>) {
		await this.sysRoleService.edit(roleIds)
		R.success()
	}

	@router.delete({
		summary: "根据角色ids删除角色",
		router: "/delete/:roleIds",
	})
	async delByIds(@Param("roleIds") roleIds: Array<number>) {
		const delCount = await this.sysRoleService.delByIds(roleIds)
		return R.success(delCount)
	}
}
