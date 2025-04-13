import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { CoreApiEntity } from "@aspen/aspen-core"

@Injectable()
export class CoreApiService {
	constructor(@InjectRepository(CoreApiEntity) private readonly sysRoleRep: Repository<CoreApiEntity>) {}
}
