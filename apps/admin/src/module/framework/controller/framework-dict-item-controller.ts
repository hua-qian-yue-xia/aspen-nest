import { Body, Param, ParseArrayPipe } from "@nestjs/common"

import { R, router } from "@aspen/aspen-core"
import { FrameDictItemEntity } from "@aspen/aspen-framework"

import { FrameDictItemService } from "../service/index"
import { FrameDictItemSaveDto, FrameDictItemEditDto, FrameDictItemQueryDto } from "../dto/index"

@router.controller({ prefix: "/frame/dict-item", summary: "字典项管理" })
export class FrameDictItemController {
	constructor(private readonly frameDictItemService: FrameDictItemService) {}

	@router.post({
		summary: "字典项分页",
		router: "/page",
		resType: {
			wrapper: "page",
			type: FrameDictItemEntity,
		},
	})
	async page(@Body() dto: FrameDictItemQueryDto) {
		const list = await this.frameDictItemService.page(dto)
		return R.success(list)
	}

	@router.get({
		summary: "根据dictItemId查询字典项(有缓存)",
		router: "/:dictItemId",
		resType: {
			type: FrameDictItemEntity,
		},
	})
	async getByDictItemId(@Param("dictItemId") dictItemId: string) {
		const dictDetail = await this.frameDictItemService.getByDictItemId(dictItemId)
		return R.success(dictDetail)
	}

	@router.get({
		summary: "根据dictId查询字典项(有缓存)",
		router: "/dictCode/:dictCode",
		resType: {
			wrapper: "list",
			type: FrameDictItemEntity,
		},
	})
	async getListBydictCode(@Param("dictCode") dictCode: string) {
		const dictDetail = await this.frameDictItemService.getListBydictCode(dictCode)
		return R.success(dictDetail)
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
		router: "/:dictItemIds",
	})
	async dictItemDelete(
		@Param("dictItemIds", new ParseArrayPipe({ items: Number, separator: "," }))
		dictItemIds: Array<number>,
	) {
		const delCount = await this.frameDictItemService.delByIds(dictItemIds)
		return R.success(delCount)
	}
}
