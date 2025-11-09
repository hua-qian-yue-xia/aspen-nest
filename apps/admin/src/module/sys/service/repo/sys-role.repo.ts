import { Injectable } from "@nestjs/common"

import { BaseRepo } from "@aspen/aspen-core"

import { SysRoleEntity } from "../../common/entity/sys-role-entity"

@Injectable()
export class SysRoleRepo extends BaseRepo<SysRoleEntity> {}
