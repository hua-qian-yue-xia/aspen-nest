import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { plainToInstance } from "class-transformer"

import { RedisTool } from "@aspen/aspen-core"
import { cache, FrameDictEntity, FrameDictItemEntity } from "@aspen/aspen-framework"

import { FrameDictEditDto, FrameDictSaveDto } from "../dto"

@Injectable()
export class FrameDictService {
	constructor(
		@InjectRepository(FrameDictEntity) private readonly frameDictRep: Repository<FrameDictEntity>,
		@InjectRepository(FrameDictItemEntity) private readonly frameDictItemRep: Repository<FrameDictItemEntity>,

		private readonly redisTool: RedisTool,
	) {}

	async page() {
		return null
	}

	// 根据dictId查询字典
	@cache.able({ key: "frame:dict:id", value: ([dictId]) => `${dictId}`, expiresIn: "2h" })
	async getByDictId(dictId: number) {
		const dictDetail = await this.frameDictRep.findOne({
			where: {
				id: dictId,
			},
		})
		return dictDetail
	}

	// 新增字典
	@cache.put({ key: "frame:dict:id", value: (_, result) => `${result.id}`, expiresIn: "2h" })
	async save(body: FrameDictSaveDto) {
		const saveObj = await this.frameDictRep.save(plainToInstance(FrameDictEntity, body))
		return saveObj
	}

	// 修改字典
	@cache.evict({ key: "frame:dict:id", value: ([dto]) => `${dto.id}` })
	async edit(body: FrameDictEditDto) {
		await this.frameDictRep.update({ id: body.id }, plainToInstance(FrameDictEntity, body))
	}

	// 删除字典
	async delByIds(dictIds: Array<number>) {
		// 查询存不存在
		const roleList = await this.frameDictRep.find({ where: { id: In(dictIds) } })
		if (!roleList.length) return 0
		// 删除数据
		const { affected } = await this.frameDictRep.delete(dictIds)
		// 删除缓存
		this.redisTool.del(dictIds.map((v) => `frame:dict:id:${v}`))
		return affected ?? 0
	}
}
