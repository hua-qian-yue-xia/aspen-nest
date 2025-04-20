import { OmitType } from "@nestjs/swagger"
import { SysDeptEntity } from "apps/admin/src/module/sys/_gen/_entity/index"

// 新增部门
export class SysDeptSaveDto extends OmitType(SysDeptEntity, ["deptId"]) {}

// 编辑部门
export class SysDeptEditDto extends SysDeptEntity {}
