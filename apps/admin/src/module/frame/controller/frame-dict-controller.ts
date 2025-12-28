import { Body, Param, ParseArrayPipe } from "@nestjs/common"

import { R, router } from "@aspen/aspen-core"

import { FrameDictService } from "../service/frame-dict-service"
import { FrameDictEntity, FrameDictQueryDto, FrameDictSaveDto } from "../common/entity/frame-dict-entity"

@router.controller({ prefix: "/frame/dict", summary: "字典管理" })
export class FrameDictController {
	constructor(private readonly frameDictService: FrameDictService) {}

	@router.post({
		summary: "字典分页",
		router: "/page",
		resType: {
			wrapper: "page",
			type: FrameDictEntity,
		},
	})
	async page(@Body() dto: FrameDictQueryDto) {
		const list = await this.frameDictService.page(dto)
		return R.success(list)
	}

	@router.get({
		summary: "查询所有字典code",
		router: "/all/dict-code",
		resType: {
			wrapper: "list",
			type: String,
		},
	})
	async allDictCode() {
		const list = await this.frameDictService.allDictCode()
		return R.success(list)
	}

	@router.get({
		summary: "根据dictId查询字典(有缓存)",
		router: "/:dictId",
		resType: {
			type: FrameDictEntity,
		},
	})
	async getByDictId(@Param("dictId") dictId: string) {
		const dictDetail = await this.frameDictService.getByDictId(dictId)
		return R.success(dictDetail)
	}

	@router.post({
		summary: "新增字典",
		router: "",
	})
	async save(@Body() body: FrameDictSaveDto) {
		const list = await this.frameDictService.save(body)
		return R.success(list)
	}

	@router.put({
		summary: "修改字典",
		router: "",
	})
	async edit(@Body() body: FrameDictSaveDto) {
		await this.frameDictService.edit(body)
		return R.success()
	}

	@router.delete({
		summary: "删除字典",
		router: "/:dictIds",
	})
	async delete(
		@Param("dictIds", new ParseArrayPipe({ items: Number, separator: "," }))
		dictIds: Array<number>,
	) {
		const delCount = await this.frameDictService.delByIds(dictIds)
		return R.success(delCount)
	}
}
