import { Param } from "@nestjs/common"

import { R, router } from "@aspen/aspen-core"

import { CoreLogService } from "apps/admin/src/module/core/service"

@router.controller({ prefix: "core/log", summary: "日志管理" })
export class CoreLogController {
	constructor(private readonly coreLogService: CoreLogService) {}

	@router.get({
		summary: "分页",
		router: "/page",
	})
	async page() {
		const list = await this.coreLogService.scopePage()
		return R.success(list)
	}

	@router.get({
		summary: "下拉",
		description: "没有权限控制",
		router: "/select",
	})
	async select() {
		const list = await this.coreLogService.scopePage()
		return R.success(list)
	}

	@router.patch({
		summary: "根据接口id查询接口(有缓存)",
		router: "/id/:logId",
		log: {
			tag: "OTHER",
		},
	})
	async getByRoleId(@Param("logId") logId: number) {
		const deptDetail = await this.coreLogService.getByApiId(logId)
		return R.success(deptDetail)
	}
}
