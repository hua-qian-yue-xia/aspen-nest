import { BaseRepo } from "@aspen/aspen-core"

import { SysRoleEntity } from "../_gen/_entity"
import { Injectable } from "@nestjs/common"

@Injectable()
export class SysRoleRepo extends BaseRepo<SysRoleEntity> {}
