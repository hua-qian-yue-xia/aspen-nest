import { Body, Param, ParseArrayPipe } from "@nestjs/common"

import { R, router } from "@aspen/aspen-core"

import { SysRoleService } from "../service/sys-role-service"
import { SysRoleEntity, SysRoleSaveDto } from "../common/entity/sys-role-entity"

@router.controller({ prefix: "sys/role", summary: "角色管理" })
export class SysRoleController {
	constructor(private readonly sysRoleService: SysRoleService) {}

	@router.post({
		summary: "树状结构",
		router: "/tree",
		resType: {
			wrapper: "tree",
			type: SysRoleEntity,
		},
	})
	async tree(@Body() dto: SysRoleEntity) {
		const list = await this.sysRoleService.scopeTree(dto)
		return R.success(list)
	}

	@router.post({
		summary: "下拉(没有权限控制)",
		router: "/select",
		resType: {
			wrapper: "page",
			type: SysRoleEntity,
		},
	})
	async select(@Body() pa: SysRoleEntity) {
		const list = await this.sysRoleService.scopeTree(pa)
		return R.success(list)
	}

	@router.get({
		summary: "根据角色id查询角色(有缓存)",
		router: "/id/:roleId",
		resType: {
			type: SysRoleEntity,
		},
		log: {
			tag: "OTHER",
		},
	})
	async getByRoleId(@Param("roleId") roleId: string) {
		const roleDetail = await this.sysRoleService.getByRoleId(roleId)
		return R.success(roleDetail)
	}

	@router.get({
		summary: "根据角色code查询角色(有缓存)",
		router: "/code/:roleCode",
		resType: {
			type: SysRoleEntity,
		},
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
	async edit(@Body() dto: SysRoleSaveDto) {
		await this.sysRoleService.edit(dto)
		return R.success()
	}

	@router.delete({
		summary: "根据角色ids删除角色",
		router: "/delete/:roleIds",
	})
	async delByIds(
		@Param("roleIds", new ParseArrayPipe({ items: String, separator: "," }))
		roleIds: Array<string>,
	) {
		const delCount = await this.sysRoleService.delByIds(roleIds)
		return R.success(delCount)
	}
}
