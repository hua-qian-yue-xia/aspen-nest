import { Injectable } from "@nestjs/common"

import { BaseRepo } from "@aspen/aspen-core"

import { SysDeptEntity } from "../_gen/_entity"

@Injectable()
export class SysDeptRepo extends BaseRepo<SysDeptEntity> {}
