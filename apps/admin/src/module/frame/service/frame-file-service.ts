import { Injectable } from "@nestjs/common"
import { In, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

import { FrameFileEntity, FrameFileQueryDto } from "../common/entity/frame-file-entity"

@Injectable()
export class FrameFileService {
	constructor(@InjectRepository(FrameFileEntity) private readonly frameFileRepo: Repository<FrameFileEntity>) {}

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
