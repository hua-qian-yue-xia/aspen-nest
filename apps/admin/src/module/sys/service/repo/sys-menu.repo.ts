import { Injectable } from "@nestjs/common"

import { BaseRepo } from "@aspen/aspen-core"

import { SysMenuEntity } from "../../common/entity/sys-menu-entity"

@Injectable()
export class SysMenuRepo extends BaseRepo<SysMenuEntity> {}
