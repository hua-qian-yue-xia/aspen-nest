import { Injectable, Logger } from "@nestjs/common"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import * as _ from "radash"

import { RedisTool } from "@aspen/aspen-core"
import { FrameFileConfigEntity } from "@aspen/aspen-framework"

@Injectable()
export class FrameFileConfigShare {
	private readonly logger = new Logger(FrameFileConfigShare.name)
	constructor(
		@InjectRepository(FrameFileConfigEntity) private readonly frameFileConfigRep: Repository<FrameFileConfigEntity>,
		private readonly redisTool: RedisTool,
	) {}

	// 配置名称是否重复
	async isConfigNameDuplicate(entity: FrameFileConfigEntity): Promise<boolean> {
		const queryBuilder = this.frameFileConfigRep.createQueryBuilder("a").where("a.name = :name", { name: entity.name })
		if (entity.configId) {
			queryBuilder.andWhere("a.config_id != :configId", { configId: entity.configId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}

	// 生成8位配置唯一code
	async generateUniqueCode(): Promise<string> {
		const _uniqueCode = _.uid(8)
		// 是否重复
		const count = await this.frameFileConfigRep.count({ where: { uniqueCode: _uniqueCode } })
		if (count > 0) {
			return await this.generateUniqueCode()
		}
		return _uniqueCode
	}
}
