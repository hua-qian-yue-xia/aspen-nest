import { Body, Param, ParseArrayPipe } from "@nestjs/common"

import { R, router } from "@aspen/aspen-core"

import { FrameDictService } from "../service/framework-dict-service"
import { FrameDictSaveDto, FrameDictEditDto } from "../dto/index"

@router.controller({ prefix: "frame", summary: "字典管理" })
export class FrameDictController {
	constructor(private readonly frameDictService: FrameDictService) {}

	@router.get({
		summary: "字典分页",
		router: "/page",
	})
	async page() {
		const list = await this.frameDictService.page()
		return R.success(list)
	}

	@router.patch({
		summary: "根据dictId查询字典(有缓存)",
		router: "/:dictId",
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
	async edit(@Body() body: FrameDictEditDto) {
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
