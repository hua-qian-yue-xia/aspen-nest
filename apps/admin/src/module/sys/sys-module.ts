import { Module } from "@nestjs/common"

import {
	SysDeptController,
	SysMenuController,
	SysRoleController,
	SysUserController,
} from "apps/admin/src/module/sys/controller/index"
import { SysDeptService, SysMenuService, SysRoleService, SysUserService } from "apps/admin/src/module/sys/service/index"

@Module({
	imports: [],
	controllers: [SysDeptController, SysMenuController, SysRoleController, SysUserController],
	providers: [SysDeptService, SysMenuService, SysRoleService, SysUserService],
})
export class SysModule {}
