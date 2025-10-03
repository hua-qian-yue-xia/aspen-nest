import { PickType } from "@nestjs/swagger"

import { FrameDictEntity } from "@aspen/aspen-framework"

// 新增字典
export class FrameDictSaveDto extends PickType(FrameDictEntity, ["code", "summary", "enable", "sort"]) {}

// 编辑字典
export class FrameDictEditDto extends PickType(FrameDictEntity, ["id", "code", "summary", "enable", "sort"]) {}
