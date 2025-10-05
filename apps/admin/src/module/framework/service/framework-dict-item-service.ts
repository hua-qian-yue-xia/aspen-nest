import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { plainToInstance } from "class-transformer"

import { RedisTool } from "@aspen/aspen-core"
import { cache, FrameDictItemEntity } from "@aspen/aspen-framework"

import { FrameDictItemEditDto, FrameDictItemSaveDto } from "../dto"

@Injectable()
export class FrameDictItemService {
	constructor(
		@InjectRepository(FrameDictItemEntity) private readonly frameDictItemRep: Repository<FrameDictItemEntity>,

		private readonly redisTool: RedisTool,
	) {}

	// 字典项分页
	async page() {}

	// 根据dictItemId查询字典项
	@cache.able({ key: "frame:dict-item:id", value: ([dictId]) => `${dictId}`, expiresIn: "2h" })
	async getByDictItemId(dictId: number) {
		const dictDetail = await this.frameDictItemRep.findOne({
			where: {
				id: dictId,
			},
		})
		return dictDetail
	}

	// 根据dictItemCode查询字典项
	@cache.able({ key: "frame:dict-item:code", value: ([deptCode]) => `${deptCode}`, expiresIn: "2h" })
	async getByDictItemCode(deptCode: string) {
		const dictDetail = await this.frameDictItemRep.findOne({
			where: {
				code: deptCode,
			},
		})
		return dictDetail
	}

	// 新增字典项
	@cache.put([
		{ key: "frame:dict-item:id", value: (_, result) => `${result.id}`, expiresIn: "2h" },
		{ key: "frame:dict-item:code", value: (_, result) => `${result.code}`, expiresIn: "2h" },
	])
	async save(body: FrameDictItemSaveDto) {
		const saveObj = await this.frameDictItemRep.save(plainToInstance(FrameDictItemEntity, body))
		return saveObj
	}

	// 修改字典项
	@cache.evict([
		{ key: "frame:dict-item:id", value: ([dto]) => `${dto.id}` },
		{ key: "frame:dict-item:code", value: ([dto]) => `${dto.code}` },
	])
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
		this.redisTool.del(roleList.map((v) => `frame:dict-item:code:${v.code}`))
		return affected ?? 0
	}
}
