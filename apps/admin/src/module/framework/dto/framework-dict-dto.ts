import { PickType } from "@nestjs/swagger"

import { FrameDictEntity } from "@aspen/aspen-framework"

// 字典分页查询参数
export class FrameDictQueryDto extends FrameDictEntity {}

// 新增字典
export class FrameDictSaveDto extends PickType(FrameDictEntity, ["code", "summary"]) {}

// 编辑字典
export class FrameDictEditDto extends PickType(FrameDictEntity, ["id", "code", "summary"]) {}
