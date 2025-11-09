import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { CoreLogEntity } from "@aspen/aspen-core"

@Injectable()
export class CoreLogService {
	constructor(@InjectRepository(CoreLogEntity) private readonly coreLogEntity: Repository<CoreLogEntity>) {}

	scopePage() {
		return null
	}

	// 根据接口id查询接口(有缓存)
	getByApiId(logCode: string) {
		return this.coreLogEntity.findOneBy({ logCode: logCode })
	}
}
