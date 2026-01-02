import { Body, Param, ParseArrayPipe, UseInterceptors } from "@nestjs/common"
import { UploadedFile, FileInterceptor, MemoryStorageFile } from "@blazity/nest-file-fastify"

import { exception, R, router } from "@aspen/aspen-core"
import { FrameFileEntity } from "@aspen/aspen-framework"

import { FrameFileService } from "../service"
import {
	FrameFileChunkUploadDto,
	FrameFileQueryDto,
	FrameFileSingleUploadDto,
} from "../common/entity/frame-file-entity"

@router.controller({ prefix: "/frame/file", summary: "文件管理" })
export class FrameFileController {
	constructor(private readonly frameFileService: FrameFileService) {}

	@router.post({
		summary: "单文件上传",
		router: "/upload/simple",
		resType: {
			type: FrameFileEntity,
		},
	})
	@UseInterceptors(FileInterceptor("file"))
	async uploadSimple(@UploadedFile() file: MemoryStorageFile, @Body() dto: FrameFileSingleUploadDto) {
		if (!file) throw new exception.validator("请上传文件")
		const list = await this.frameFileService.uploadSimple(file, dto)
		return R.success(list)
	}

	@router.post({
		summary: "分片文件上传",
		router: "/upload/chunk",
		resType: {
			type: FrameFileEntity,
		},
	})
	@UseInterceptors(FileInterceptor("file"))
	async uploadChunk(@UploadedFile() file: MemoryStorageFile, @Body() dto: FrameFileChunkUploadDto) {
		if (!file) throw new exception.validator("请上传文件")
		const list = await this.frameFileService.uploadChunk(file, dto)
		return R.success(list)
	}

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
