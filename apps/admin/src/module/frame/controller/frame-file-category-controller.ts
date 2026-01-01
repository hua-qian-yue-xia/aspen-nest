import { Body, Param, ParseArrayPipe } from "@nestjs/common"
import { R, router } from "@aspen/aspen-core"
import { FrameFileCategoryEntity } from "@aspen/aspen-framework"

import { FrameFileCategoryService } from "../service"
import { FrameFileCategoryQueryDto, FrameFileCategorySaveDto } from "../common/entity/frame-file-category-entity"

@router.controller({ prefix: "/frame/file-category", summary: "文件分类" })
export class FrameFileCategoryController {
	constructor(private readonly frameFileCategoryService: FrameFileCategoryService) {}

	@router.post({
		summary: "查询所有文件分类",
		router: "/all",
		resType: {
			wrapper: "list",
			type: FrameFileCategoryEntity,
		},
	})
	async all(@Body() dto: FrameFileCategoryQueryDto) {
		const list = await this.frameFileCategoryService.all(dto)
		return R.success(list)
	}

	@router.get({
		summary: "根据categoryId查询文件分类(有缓存)",
		router: "/:categoryId",
		resType: {
			type: FrameFileCategoryEntity,
		},
	})
	async getByCategoryId(@Param("categoryId") categoryId: string) {
		const categoryDetail = await this.frameFileCategoryService.getByCategoryId(categoryId)
		return R.success(categoryDetail)
	}

	@router.post({
		summary: "新增文件分类",
		router: "",
	})
	async save(@Body() body: FrameFileCategorySaveDto) {
		const save = await this.frameFileCategoryService.save(body)
		return R.success(save)
	}

	@router.put({
		summary: "更新文件分类",
		router: "",
	})
	async edit(@Body() body: FrameFileCategorySaveDto) {
		await this.frameFileCategoryService.edit(body)
		return R.success()
	}

	@router.delete({
		summary: "删除文件分类",
		router: "/:categoryIds",
	})
	async delete(
		@Param("categoryIds", new ParseArrayPipe({ items: String, separator: "," }))
		categoryIds: Array<string>,
	) {
		const delCount = await this.frameFileCategoryService.delByIds(categoryIds)
		return R.success(delCount)
	}
}
