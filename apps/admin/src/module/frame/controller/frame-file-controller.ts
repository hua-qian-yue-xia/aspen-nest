import { Body, Param, ParseArrayPipe } from "@nestjs/common"

import { R, router } from "@aspen/aspen-core"

import { FrameFileEntity } from "@aspen/aspen-framework"

import { FrameFileService } from "../service"
import { FrameFileQueryDto } from "../common/entity/frame-file-entity"

@router.controller({ prefix: "/frame/file", summary: "文件管理" })
export class FrameFileController {
	constructor(private readonly frameFileService: FrameFileService) {}

	@router.post({
		summary: "文件分页",
		router: "/page",
		resType: {
			wrapper: "page",
			type: FrameFileEntity,
		},
	})
	async page(@Body() dto: FrameFileQueryDto) {
		const list = await this.frameFileService.page(dto)
		return R.success(list)
	}

	@router.delete({
		summary: "删除文件",
		router: "/:fileIds",
	})
	async delete(
		@Param("fileIds", new ParseArrayPipe({ items: String, separator: "," }))
		fileIds: Array<string>,
	) {
		const delCount = await this.frameFileService.delByIds(fileIds)
		return R.success(delCount)
	}
}
