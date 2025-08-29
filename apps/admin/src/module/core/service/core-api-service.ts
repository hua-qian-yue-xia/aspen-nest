import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { CoreApiEntity } from "@aspen/aspen-core"

@Injectable()
export class CoreApiService {
	constructor(@InjectRepository(CoreApiEntity) private readonly coreApiEntity: Repository<CoreApiEntity>) {}

	async scopePage() {
		return null
	}

	// 根据接口id查询接口(有缓存)
	async getByApiId(apiId: number) {
		return this.coreApiEntity.findOneBy({ apiId: apiId })
	}
}
