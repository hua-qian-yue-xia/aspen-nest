import { R, router } from "@aspen/aspen-core"
import { Body, Param } from "@nestjs/common"

import { SysDeptService } from "apps/admin/src/module/sys/service"
import { SysDeptSaveDto, SysDeptEditDto } from "apps/admin/src/module/sys/dto/index"

@router.controller({ prefix: "sys/dept", summary: "部门管理" })
export class SysDeptController {
	constructor(private readonly sysDeptService: SysDeptService) {}

	@router.get({
		summary: "分页",
		router: "/page",
	})
	async page(@Body() body: SysDeptSaveDto) {
		console.log(body)
		const list = await this.sysDeptService.scopePage()
		return R.success(list)
	}

	@router.get({
		summary: "下拉",
		description: "没有权限控制",
		router: "/select",
	})
	async select() {
		const list = await this.sysDeptService.scopePage()
		return R.success(list)
	}

	@router.patch({
		summary: "根据部门id查询部门(有缓存)",
		router: "/id/:deptId",
		log: {
			tag: "OTHER",
		},
	})
	async getByRoleId(@Param("deptId") deptId: number) {
		const deptDetail = await this.sysDeptService.getByDeptId(deptId)
		return R.success(deptDetail)
	}

	@router.post({
		summary: "新增",
		router: "",
	})
	async save(@Body() dto: SysDeptSaveDto) {
		const roleDetail = await this.sysDeptService.save(dto)
		return R.success(roleDetail.deptId)
	}

	@router.put({
		summary: "修改",
		router: "",
	})
	async edit(@Body() dto: SysDeptEditDto) {
		await this.sysDeptService.update(dto)
		return R.success()
	}
}
