import { Body, Param, ParseArrayPipe } from "@nestjs/common"

import { R, router } from "@aspen/aspen-core"

import { FrameDictItemService } from "../service/index"
import { FrameDictItemSaveDto, FrameDictItemEditDto } from "../dto/index"

@router.controller({ prefix: "frame/dict", summary: "字典项管理" })
export class FrameDictItemController {
	constructor(private readonly frameDictItemService: FrameDictItemService) {}

	@router.get({
		summary: "字典项分页",
		router: "/page",
	})
	async page() {
		const list = await this.frameDictItemService.page()
		return R.success(list)
	}

	@router.patch({
		summary: "根据dictItemId查询字典项",
		router: "/{dictId}",
	})
	async getByDictItemId(@Param("deptId") dictId: number) {
		const deptDetail = await this.frameDictItemService.getByDictItemId(dictId)
		return R.success(deptDetail)
	}

	@router.post({
		summary: "新增字典项",
		router: "",
	})
	async save(@Body() body: FrameDictItemSaveDto) {
		const list = await this.frameDictItemService.save(body)
		return R.success(list)
	}

	@router.put({
		summary: "修改字典项",
		router: "",
	})
	async edit(@Body() body: FrameDictItemEditDto) {
		await this.frameDictItemService.edit(body)
		return R.success()
	}

	@router.delete({
		summary: "删除字典项",
		router: "/{dictItemIds}",
	})
	async dictItemDelete(
		@Param("roleIds", new ParseArrayPipe({ items: Number, separator: "," }))
		dictItemIds: Array<number>,
	) {
		const delCount = await this.frameDictItemService.delByIds(dictItemIds)
		return R.success(delCount)
	}
}
