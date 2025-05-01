import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AspenFrameworkJwtStrategyModule } from "libs/aspen-framework/src/guard/jwt"

import {
	SysDeptEntity,
	SysMenuEntity,
	SysRoleEntity,
	SysUserEntity,
} from "apps/admin/src/module/sys/_gen/_entity/index"
import {
	SysDeptController,
	SysMenuController,
	SysRoleController,
	SysUserController,
} from "apps/admin/src/module/sys/controller/index"
import { SysDeptService, SysMenuService, SysRoleService, SysUserService } from "apps/admin/src/module/sys/service/index"

@Module({
	imports: [
		TypeOrmModule.forFeature([SysDeptEntity, SysMenuEntity, SysRoleEntity, SysUserEntity]),
		AspenFrameworkJwtStrategyModule,
	],
	controllers: [SysDeptController, SysMenuController, SysRoleController, SysUserController],
	providers: [SysDeptService, SysMenuService, SysRoleService, SysUserService],
})
export class SysModule {}
