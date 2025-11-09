import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { plainToInstance } from "class-transformer"

import { RedisTool } from "@aspen/aspen-core"
import { cache, FrameDictEntity, FrameDictItemEntity } from "@aspen/aspen-framework"

import { FrameDictItemEditDto, FrameDictItemQueryDto, FrameDictItemSaveDto } from "../dto"

@Injectable()
export class FrameDictItemService {
	constructor(
		@InjectRepository(FrameDictEntity) private readonly frameDictRep: Repository<FrameDictEntity>,
		@InjectRepository(FrameDictItemEntity) private readonly frameDictItemRep: Repository<FrameDictItemEntity>,

		private readonly redisTool: RedisTool,
	) {}

	// 字典项分页
	async page(dto: FrameDictItemQueryDto) {
		const pageListBuild = this.frameDictItemRep.createQueryBuilder("dictItem")
		if (dto && dto.dictId) {
			pageListBuild.where("dictItem.dict_id = :dictId", { dictId: dto.dictId })
		}
		const pageList = await pageListBuild.orderBy("dictItem.dict_id", "DESC").orderBy("dictItem.sort", "DESC").pageMany()
		return pageList
	}

	// 根据dictItemId查询字典项
	@cache.able({ key: "frame:dict-item:id", value: ([dictItemId]) => `${dictItemId}`, expiresIn: "2h" })
	async getByDictItemId(dictItemId: string) {
		const dictDetail = await this.frameDictItemRep.findOne({
			where: {
				id: dictItemId,
			},
		})
		return dictDetail
	}

	// 根据dictCode查询字典项
	async getListBydictCode(dictCode: string) {
		const dict = await this.frameDictRep.findOne({
			where: {
				code: dictCode,
			},
		})
		if (!dict) return []
		const dictDetail = await this.frameDictItemRep.find({
			where: {
				dict: {
					id: dict.id,
				},
			},
		})
		return dictDetail
	}

	// 新增字典项
	@cache.put({ key: "frame:dict-item:id", value: (_, result) => `${result.id}`, expiresIn: "2h" })
	async save(body: FrameDictItemSaveDto) {
		const saveObj = await this.frameDictItemRep.save(plainToInstance(FrameDictItemEntity, body))
		return saveObj
	}

	// 修改字典项
	@cache.evict({ key: "frame:dict-item:id", value: ([body]) => `${body.id}` })
	async edit(body: FrameDictItemEditDto) {
		await this.frameDictItemRep.update({ id: body.id }, plainToInstance(FrameDictItemEntity, body))
	}

	// 删除字典项
	async delByIds(dictIds: Array<number>) {
		// 查询存不存在
		const roleList = await this.frameDictItemRep.find({ where: { id: In(dictIds) } })
		if (!roleList.length) return 0
		// 删除数据
		const { affected } = await this.frameDictItemRep.softDelete(dictIds)
		// 删除缓存
		this.redisTool.del(roleList.map((v) => `frame:dict-item:id:${v.id}`))
		return affected ?? 0
	}
}
