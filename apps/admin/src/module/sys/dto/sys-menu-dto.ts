import { PickType } from "@nestjs/swagger"

import { SysMenuEntity } from "apps/admin/src/module/sys/_gen/_entity/index"

// 查询菜单
export class SysMenuQueryDto extends PickType(SysMenuEntity, []) {}

// 新增菜单
export class SysMenuSaveDto extends PickType(SysMenuEntity, ["parentId", "menuName", "type", "icon", "path"]) {}

// 修改菜单
export class SysMenuEditDto extends PickType(SysMenuEntity, [
	"menuId",
	"parentId",
	"menuName",
	"type",
	"icon",
	"path",
]) {}
