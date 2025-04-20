import { Param } from "@nestjs/common"

import { R, router } from "@aspen/aspen-core"

import { SysUserService } from "apps/admin/src/module/sys/service"

@router.controller({ prefix: "sys/user", summary: "用户管理" })
export class SysUserController {
	constructor(private readonly sysUserController: SysUserService) {}

	@router.get({
		summary: "分页",
		router: "/page",
	})
	async page() {
		return R.success()
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
		router: "/get/:userId",
	})
	async getByUserId(@Param("userId") userId: string) {
		this.sysUserController.getByUserId(userId)
		return R.success()
	}
}
