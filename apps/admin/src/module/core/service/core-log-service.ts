import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { CoreLogEntity } from "@aspen/aspen-core"

@Injectable()
export class CoreLogService {
	constructor(@InjectRepository(CoreLogEntity) private readonly coreLogEntity: Repository<CoreLogEntity>) {}

	scopePage() {
		return this.coreLogEntity.page()
	}

	// 根据接口id查询接口(有缓存)
	getByApiId(logId: number) {
		return this.coreLogEntity.findOneBy({ logId: logId })
	}
}
