import { R, router } from "@aspen/aspen-core"
import { Param } from "@nestjs/common"

import { CoreApiService } from "apps/admin/src/module/core/service"

@router.controller({ prefix: "core/api", summary: "api管理" })
export class CoreApiController {
	constructor(private readonly coreApiService: CoreApiService) {}

	@router.get({
		summary: "分页",
		router: "/page",
	})
	async page() {
		const list = await this.coreApiService.scopePage()
		return R.success(list)
	}

	@router.get({
		summary: "下拉",
		description: "没有权限控制",
		router: "/select",
	})
	async select() {
		const list = await this.coreApiService.scopePage()
		return R.success(list)
	}

	@router.patch({
		summary: "根据接口id查询接口(有缓存)",
		router: "/id/:apiCode",
		log: {
			tag: "OTHER",
		},
	})
	async getByRoleId(@Param("apiCode") apiCode: string) {
		const deptDetail = await this.coreApiService.getByApiId(apiCode)
		return R.success(deptDetail)
	}
}
