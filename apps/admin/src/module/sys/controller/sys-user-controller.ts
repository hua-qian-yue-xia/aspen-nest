import { Body, Param } from "@nestjs/common"

import { R, router } from "@aspen/aspen-core"

import { SysUserService } from "apps/admin/src/module/sys/service"
import { SysUserAdminLoginDto } from "apps/admin/src/module/sys/dto/sys-user-dto"

@router.controller({ prefix: "sys/user", summary: "用户管理" })
export class SysUserController {
	constructor(private readonly sysUserService: SysUserService) {}

	@router.get({
		summary: "分页",
		router: "/page",
	})
	async page() {
		const list = await this.sysUserService.scopePage()
		return R.success(list)
	}

	@router.get({
		summary: "下拉",
		description: "没有权限控制",
		router: "/select",
	})
	async select() {
		return R.success()
	}

	@router.patch({
		summary: "根据用户id查询用户",
		description: "有缓存",
		router: "/id/:userId",
	})
	async getByUserId(@Param("userId") userId: number) {
		this.sysUserService.getByUserId(userId)
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
		await this.sysUserService.adminLogin(dto)
		return R.success()
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
