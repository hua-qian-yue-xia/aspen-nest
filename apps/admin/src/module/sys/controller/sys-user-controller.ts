import { Controller, Param } from "@nestjs/common"

import { R, router } from "@aspen/aspen-core"

import { SysUserService } from "../service"

@Controller("sys/user")
export class SysUserController {
	constructor(private readonly sysUserController: SysUserService) {}

	@router.get({
		summary: "分页",
		router: "/page",
	})
	async page(@Param("userId") userId: string) {
		this.sysUserController.getByUserId(userId)
		R.success()
	}

	@router.get({
		summary: "下拉",
		description: "没有权限控制",
		router: "/select",
	})
	async select(@Param("userId") userId: string) {
		this.sysUserController.getByUserId(userId)
		R.success()
	}

	@router.get({
		summary: "根据用户id查询用户",
		description: "有缓存",
		router: "/get/:userId",
	})
	async getByUserId(@Param("userId") userId: string) {
		this.sysUserController.getByUserId(userId)
		R.success()
	}
}
