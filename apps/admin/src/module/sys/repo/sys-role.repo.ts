import { Injectable } from "@nestjs/common"

import { BaseRepo } from "@aspen/aspen-core"

import { SysRoleEntity } from "../_gen/_entity"

@Injectable()
export class SysRoleRepo extends BaseRepo<SysRoleEntity> {}
