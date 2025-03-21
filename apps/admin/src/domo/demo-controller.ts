import { Controller, Inject } from "@nestjs/common"

import { router, AppCtx } from "packages/aspen-core/src"
import { REQUEST } from "@nestjs/core"

@Controller("/demo")
export class DemoController {
	constructor(@Inject(REQUEST) private readonly request: Request) {}

	@router.get({
		summary: "查询下拉",
		router: "/select",
	})
	async list() {
		const page = AppCtx.getInstance().getPage()
		return page
	}

	@router.get({
		summary: "查询分页",
		router: "/page",
	})
	page() {
		return "查询下拉"
	}

	@router.patch({
		summary: "查询详情",
		router: "/detail",
	})
	detail() {
		return "查询详情"
	}

	@router.put({
		summary: "更新",
		router: "/update",
	})
	update() {
		return "更新"
	}

	@router.post({
		summary: "新增",
		router: "/create",
	})
	create() {
		return "更新"
	}

	@router.delete({
		summary: "删除",
		router: "/del",
		log: {
			tag: "DELETE",
		},
	})
	del() {
		return "删除"
	}
}
