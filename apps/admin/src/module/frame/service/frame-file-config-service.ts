import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import { exception, RedisTool } from "@aspen/aspen-core"
import { cache, comEnums } from "@aspen/aspen-framework"

import {
	FrameFileConfigEntity,
	FrameFileConfigQueryDto,
	FrameFileConfigSaveDto,
} from "../common/entity/frame-file-config-entity"
import { FrameFileConfigShare } from "./share/frame-file-config-share"

@Injectable()
export class FrameFileConfigService {
	constructor(
		@InjectRepository(FrameFileConfigEntity) private readonly frameFileConfigRep: Repository<FrameFileConfigEntity>,
		private readonly redisTool: RedisTool,

		private readonly frameFileConfigShare: FrameFileConfigShare,
	) {}

	// 文件配置分页
	async page(dto: FrameFileConfigQueryDto) {
		return dto.createQueryBuilder(this.frameFileConfigRep).pageMany()
	}

	// 根据configId查询文件配置(有缓存)
	@cache.able({ key: "frame:file-config:id", value: ([configId]) => `${configId}`, expiresIn: "2h" })
	async getByConfigId(configId: string) {
		const dictDetail = await this.frameFileConfigRep.findOne({
			where: {
				configId,
			},
		})
		return dictDetail
	}

	// 根据uniqueCode查询文件配置,如果没有code就查询默认配置
	async getConfigByCodeOrDefault(uniqueCode?: string) {
		let config: FrameFileConfigEntity | null = null
		if (uniqueCode) {
			config = await this.frameFileConfigRep.findOne({
				where: {
					uniqueCode,
				},
			})
		}
		if (!config) {
			config = await this.frameFileConfigRep.findOne({
				where: {
					default: "NO",
				},
			})
		}
		return config
	}

	// 新增文件配置
	@cache.put([{ key: "frame:file-config:id", value: (_, result) => `${result.configId}`, expiresIn: "2h" }])
	async save(body: FrameFileConfigSaveDto) {
		const entity = body.toEntity()
		if (await this.frameFileConfigShare.isConfigNameDuplicate(entity)) {
			throw new exception.validator(`文件配置名称"${body.name}"重复`)
		}
		// 生成唯一code
		entity.uniqueCode = await this.frameFileConfigShare.generateUniqueCode()
		const saveObj = await this.frameFileConfigRep.save(entity)
		return saveObj
	}

	// 更新文件配置
	@cache.evict([{ key: "frame:file-config:id", value: ([body]) => `${body.configId}` }])
	async edit(body: FrameFileConfigSaveDto) {
		const entity = body.toEntity()
		if (await this.frameFileConfigShare.isConfigNameDuplicate(entity)) {
			throw new exception.validator(`文件配置名称"${body.name}"重复`)
		}
		await this.frameFileConfigRep.update({ configId: body.configId }, entity)
	}

	// 删除文件配置
	async delByIds(configIds: Array<string>) {
		// 查询存不存在
		const roleList = await this.frameFileConfigRep.find({ where: { configId: In(configIds) } })
		if (!roleList.length) return 0
		// 删除数据
		const { affected } = await this.frameFileConfigRep.softDelete(configIds)
		// 删除缓存
		this.redisTool.del(roleList.map((v) => `frame:file-config:id:${v.configId}`))
		return affected ?? 0
	}
}
