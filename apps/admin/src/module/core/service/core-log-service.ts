import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { CoreLogEntity } from "@aspen/aspen-core"

@Injectable()
export class CoreLogService {
	constructor(@InjectRepository(CoreLogEntity) private readonly sysRoleRep: Repository<CoreLogEntity>) {}
}
