import { PickType } from "@nestjs/swagger"

import { FrameDictItemEntity } from "@aspen/aspen-framework"
import { AspenSummary } from "@aspen/aspen-core"

// 查询字典项分页
export class FrameDictItemQueryDto {
	@AspenSummary({ summary: "字典id" })
	dictId?: string
}

// 新增字典项
export class FrameDictItemSaveDto extends PickType(FrameDictItemEntity, ["code", "summary", "sort"]) {}

// 编辑字典项
export class FrameDictItemEditDto extends PickType(FrameDictItemEntity, ["id", "code", "summary", "sort"]) {}
