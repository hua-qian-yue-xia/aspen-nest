import { DataSource, EntityTarget } from "typeorm"
import { Injectable } from "@nestjs/common"

import { BaseRepo } from "@aspen/aspen-core"

import { SysUserEntity } from "../../common/sys-entity"

@Injectable()
export class SysUserRepo extends BaseRepo<SysUserEntity> {}
