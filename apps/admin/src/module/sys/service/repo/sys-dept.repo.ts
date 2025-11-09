import { Injectable } from "@nestjs/common"

import { BaseRepo } from "@aspen/aspen-core"

import { SysDeptEntity } from "../../common/entity/sys-dept-entity"

@Injectable()
export class SysDeptRepo extends BaseRepo<SysDeptEntity> {}
