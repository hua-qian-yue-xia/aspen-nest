import { Controller } from "@nestjs/common"

import { router } from "packages/aspen-core/src/index"

@Controller("/demo")
export class DemoController {
	@router.Get({
		summary: "查询下拉",
		router: "/select",
	})
	list() {
		return "查询下拉"
	}

	@router.Get({
		summary: "查询分页",
		router: "/page",
	})
	page() {
		return "查询下拉"
	}

	@router.Patch({
		summary: "查询详情",
		router: "/detail",
	})
	detail() {
		return "查询详情"
	}

	@router.Put({
		summary: "更新",
		router: "/update",
	})
	update() {
		return "更新"
	}

	@router.Post({
		summary: "新增",
		router: "/create",
	})
	create() {
		return "更新"
	}

	@router.Delete({
		summary: "删除",
		router: "/del",
	})
	del() {
		return "删除"
	}
}
