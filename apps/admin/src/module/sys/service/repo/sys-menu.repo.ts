import { Injectable } from "@nestjs/common"

import { BaseRepo } from "@aspen/aspen-core"

import { SysMenuEntity } from "../../common/sys-entity"

@Injectable()
export class SysMenuRepo extends BaseRepo<SysMenuEntity> {}
