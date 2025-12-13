import { R, router } from "@aspen/aspen-core"
import { Body, Param, ParseArrayPipe } from "@nestjs/common"

import { SysDeptService } from "../service/sys-dept-service"

import { SysDeptQueryDto, SysDeptSaveDto, SysDeptEntity } from "../common/entity/sys-dept-entity"

@router.controller({ prefix: "sys/dept", summary: "部门管理" })
export class SysDeptController {
	constructor(private readonly sysDeptService: SysDeptService) {}

	@router.post({
		summary: "分页",
		router: "/page",
		resType: {
			type: SysDeptEntity,
			wrapper: "page",
		},
	})
	async page(@Body() body: SysDeptQueryDto) {
		const list = await this.sysDeptService.scopePage()
		return R.success(list)
	}

	@router.post({
		summary: "下拉",
		description: "没有权限控制",
		router: "/select",
		resType: {
			type: SysDeptEntity,
			wrapper: "page",
		},
	})
	async select(@Body() body: SysDeptQueryDto) {
		const list = await this.sysDeptService.scopePage()
		return R.success(list)
	}

	@router.post({
		summary: "树状结构",
		description: "",
		router: "/tree",
		resType: {
			type: SysDeptEntity,
			wrapper: "tree",
		},
	})
	async tree(@Body() query: SysDeptQueryDto) {
		const treeList = await this.sysDeptService.tree(query)
		return R.success(treeList)
	}

	@router.get({
		summary: "根据部门id查询部门(有缓存)",
		router: "/id/:deptId",
		resType: {
			type: SysDeptEntity,
		},
		log: {
			tag: "OTHER",
		},
	})
	async getByDeptId(@Param("deptId") deptId: string) {
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
	async edit(@Body() dto: SysDeptSaveDto) {
		await this.sysDeptService.update(dto)
		return R.success()
	}

	@router.delete({
		summary: "删除",
		router: "/:deptIds",
	})
	async delete(
		@Param("deptIds", new ParseArrayPipe({ items: String, separator: "," }))
		deptIds: Array<string>,
	) {
		await this.sysDeptService.delete(deptIds)
		return R.success()
	}
}
