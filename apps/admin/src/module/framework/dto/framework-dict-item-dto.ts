import { PickType } from "@nestjs/swagger"

import { FrameDictItemEntity } from "@aspen/aspen-framework"

// 新增字典项
export class FrameDictItemSaveDto extends PickType(FrameDictItemEntity, ["code", "summary", "sort"]) {}

// 编辑字典项
export class FrameDictItemEditDto extends PickType(FrameDictItemEntity, ["id", "code", "summary", "sort"]) {}
