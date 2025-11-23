import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { SysDeptEntity } from "./common/entity/sys-dept-entity"
import { SysMenuEntity } from "./common/entity/sys-menu-entity"
import { SysRoleEntity } from "./common/entity/sys-role-entity"
import { SysUserEntity } from "./common/entity/sys-user-entity"

import { SysDeptController } from "./controller/sys-dept-controller"
import { SysMenuController } from "./controller/sys-menu-controller"
import { SysRoleController } from "./controller/sys-role-controller"
import { SysUserController } from "./controller/sys-user-controller"

import { SysDeptService } from "./service/sys-dept-service"
import { SysMenuService } from "./service/sys-menu-service"
import { SysRoleService } from "./service/sys-role-service"
import { SysUserService } from "./service/sys-user-service"

import { SysDeptShare } from "./service/share/sys-dept.share"
import { SysMenuShare } from "./service/share/sys-menu.share"
import { SysRoleShare } from "./service/share/sys-role.share"
import { SysUserShare } from "./service/share/sys-user.share"

import { SysModuleInit } from "./common/init/sys-module-init"

@Module({
	imports: [TypeOrmModule.forFeature([SysDeptEntity, SysMenuEntity, SysRoleEntity, SysUserEntity])],
	controllers: [SysDeptController, SysMenuController, SysRoleController, SysUserController],
	providers: [
		SysDeptService,
		SysMenuService,
		SysRoleService,
		SysUserService,
		SysDeptShare,
		SysMenuShare,
		SysRoleShare,
		SysUserShare,
		SysModuleInit,
	],
})
export class SysModule {}
