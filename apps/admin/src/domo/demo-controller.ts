import { Controller, createParamDecorator, ExecutionContext } from "@nestjs/common"

import { router } from "packages/aspen-core/src"

@Controller("/demo")
export class DemoController {
	@router.get({
		summary: "查询下拉",
		router: "/select",
	})
	async list() {
		const user = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
			console.log(ctx, data)
			return "--"
		})
		console.log(user(), "11")
		return "查询下拉"
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
	})
	del() {
		return "删除"
	}
}
