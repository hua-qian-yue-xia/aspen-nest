import { Injectable } from "@nestjs/common"
import { In, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { MemoryStorageFile } from "@blazity/nest-file-fastify"

import {
	FrameFileChunkUploadDto,
	FrameFileEntity,
	FrameFileQueryDto,
	FrameFileSingleUploadDto,
} from "../common/entity/frame-file-entity"
import { FileService } from "./file"

@Injectable()
export class FrameFileService {
	constructor(
		@InjectRepository(FrameFileEntity) private readonly frameFileRepo: Repository<FrameFileEntity>,
		private readonly fileService: FileService,
	) {}

	// 单文件上传
	async uploadSimple(file: MemoryStorageFile, dto: FrameFileSingleUploadDto) {
		const fileService = await this.fileService.getFileService()
		return fileService.uploadSingle(file.buffer, dto.filename, file.mimetype)
	}

	// 分片文件上传
	async uploadChunk(file: MemoryStorageFile, dto: FrameFileChunkUploadDto) {
		const fileService = await this.fileService.getFileService()
		return fileService.uploadChunk({
			identifier: dto.identifier,
			chunkNumber: dto.chunkNumber,
			totalChunks: dto.totalChunks,
			filename: dto.filename,
			fileType: file.mimetype,
			file: file.buffer,
		})
	}

	// 文件分页
	async page(dto: FrameFileQueryDto) {
		const queryBuilder = dto.createQueryBuilder(this.frameFileRepo)
		const list = await queryBuilder.getMany()
		return list
	}

	// 删除文件
	async delByIds(fileIds: Array<string>) {
		// 查询存不存在
		const roleList = await this.frameFileRepo.find({ where: { fileId: In(fileIds) } })
		if (!roleList.length) return 0
		// 删除数据
		const { affected } = await this.frameFileRepo.softDelete(fileIds)
		return affected ?? 0
	}
}
