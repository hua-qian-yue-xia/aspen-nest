import { Controller, Param } from "@nestjs/common"

import { router } from "@aspen/aspen-core"

import { SysUserService } from "../service"

@Controller("sys/user")
export class SysUserController {
	constructor(private readonly sysUserController: SysUserService) {}

	@router.get({
		summary: "根据用户id查询用户",
		description: "有缓存",
		router: "/get/:userId",
	})
	async getByUserId(@Param("userId") userId: string) {
		await this.sysUserController.getByUserId(userId)
	}
}
