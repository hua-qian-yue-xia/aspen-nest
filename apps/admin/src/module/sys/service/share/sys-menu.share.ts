import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Brackets, Repository } from "typeorm"

import * as _ from "radash"

import { RedisTool } from "@aspen/aspen-core"

import { SysMenuEntity, SysMenuQueryDto } from "../../common/entity/sys-menu-entity"

@Injectable()
export class SysMenuShare {
	constructor(
		@InjectRepository(SysMenuEntity) private readonly sysMenuRep: Repository<SysMenuEntity>,
		private readonly redisTool: RedisTool,
	) {}
}
