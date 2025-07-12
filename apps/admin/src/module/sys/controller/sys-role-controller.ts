import { Body, Param } from "@nestjs/common"

import { R, router } from "@aspen/aspen-core"

import { SysRoleService } from "apps/admin/src/module/sys/service"
import { SysRoleSaveDto, SysRoleEditDto, SysRolePaDto } from "apps/admin/src/module/sys/dto"

@router.controller({ prefix: "sys/role", summary: "角色管理" })
export class SysRoleController {
	constructor(private readonly sysRoleService: SysRoleService) {}

	@router.post({
		summary: "分页",
		router: "/page",
	})
	async page(@Body() dto: SysRolePaDto) {
		const list = await this.sysRoleService.scopePage(dto)
		return R.success(list)
	}

	@router.post({
		summary: "下拉(没有权限控制)",
		router: "/select",
	})
	async select(@Body() pa: SysRolePaDto) {
		const list = await this.sysRoleService.scopePage(pa)
		return R.success(list)
	}

	@router.patch({
		summary: "根据角色id查询角色(有缓存)",
		router: "/id/:roleId",
		log: {
			tag: "OTHER",
		},
	})
	async getByRoleId(@Param("roleId") roleId: number) {
		const roleDetail = await this.sysRoleService.getByRoleId(roleId)
		return R.success(roleDetail)
	}

	@router.patch({
		summary: "根据角色code查询角色(有缓存)",
		router: "/code/:roleCode",
		log: {
			tag: "OTHER",
		},
	})
	async getByRoleCode(@Param("roleCode") roleCode: string) {
		const roleDetail = await this.sysRoleService.getByRoleCode(roleCode)
		return R.success(roleDetail)
	}

	@router.post({
		summary: "新增角色(限流、日志)",
		router: "",
		log: {
			tag: "INSERT",
		},
		rateLimit: {
			limitType: "IP",
		},
	})
	async save(@Body() dto: SysRoleSaveDto) {
		const roleDetail = await this.sysRoleService.save(dto)
		return R.success(roleDetail.roleId)
	}

	@router.put({
		summary: "修改角色(限流、日志)",
		router: "",
	})
	async update(@Body() dto: SysRoleEditDto) {
		await this.sysRoleService.edit(dto)
		return R.success()
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
