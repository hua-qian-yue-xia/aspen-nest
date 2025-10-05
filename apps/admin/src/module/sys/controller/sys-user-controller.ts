import { Body, Param, Query } from "@nestjs/common"

import { BasePage, R, router } from "@aspen/aspen-core"

import { SysUserService } from "apps/admin/src/module/sys/service"
import { SysUserAdminLoginDto, SysUserEditDto, SysUserSaveDto } from "apps/admin/src/module/sys/dto/sys-user-dto"

import { SysUserEntity } from "../_gen/_entity"

@router.controller({ prefix: "sys/user", summary: "用户管理" })
export class SysUserController {
	constructor(private readonly sysUserService: SysUserService) {}

	@router.get({
		summary: "分页",
		router: "/page",
		resType: {
			type: SysUserEntity,
			wrapper: "page",
		},
	})
	async page(@Query() page: BasePage) {
		const pageList = await this.sysUserService.scopePage()
		return R.success(pageList)
	}

	@router.get({
		summary: "下拉",
		description: "没有权限控制",
		router: "/select",
		resType: {
			type: SysUserEntity,
			wrapper: "list",
		},
	})
	async select() {
		return R.success()
	}

	@router.patch({
		summary: "根据用户id查询用户",
		description: "有缓存",
		router: "/id/:userId",
		resType: {
			type: SysUserEntity,
		},
	})
	async getByUserId(@Param("userId") userId: number) {
		const detail = await this.sysUserService.getByUserId(userId)
		return R.success(detail)
	}

	@router.post({
		summary: "新增用户",
		description: "有缓存",
		router: "/",
	})
	async save(@Body() dto: SysUserSaveDto) {
		await this.sysUserService.save(dto)
		return R.success()
	}

	@router.put({
		summary: "修改用户",
		description: "有缓存",
		router: "/",
	})
	async edit(@Body() dto: SysUserEditDto) {
		await this.sysUserService.edit(dto)
		return R.success()
	}

	@router.post({
		summary: "admin登录",
		description: "admin登录,会校验用户名、密码、用户是否启用、用户是否有权限登录管理后台",
		router: "/admin/login",
		log: {
			tag: "ADMIN",
		},
	})
	async adminLogin(@Body() dto: SysUserAdminLoginDto) {
		const result = await this.sysUserService.adminLogin(dto)
		return R.success(result)
	}

	@router.get({
		summary: "admin登出",
		description: "用户手动退出时调用,会清空redis中的token,用户下次需要重新登录",
		router: "/admin/logout",
		log: {
			tag: "ADMIN",
		},
	})
	async adminLogout() {
		await this.sysUserService.adminLogout()
		return R.success()
	}
}
