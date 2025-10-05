import { DataSource, EntityTarget } from "typeorm"
import { Injectable } from "@nestjs/common"

import { BaseRepo } from "@aspen/aspen-core"

import { SysUserEntity } from "../_gen/_entity"

@Injectable()
export class SysUserRepo extends BaseRepo<SysUserEntity> {}
