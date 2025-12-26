import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import * as _ from "radash"

import { Application } from "@aspen/aspen-core"

import { SysRoleService } from "../../src/module/sys/service/sys-role-service"
import { SysRoleEntity, SysRoleSaveDto } from "../../src/module/sys/common/entity/sys-role-entity"
import { AppModule } from "apps/admin/src/app-module"

describe("sys-role测试", () => {
	const config = {
		generateRoleCount: 100,
	}

	let sysRoleService: SysRoleService
	let sysRoleRepo: Repository<SysRoleEntity>

	beforeEach(async () => {
		process.env.NODE_ENV = "dev"
		const srcPath = `${process.cwd()}/apps/admin/src`
		const app = await new Application().create(srcPath, AppModule, { test: true })
		sysRoleService = app.getApp().get<SysRoleService>(SysRoleService)
		sysRoleRepo = app.getApp().get<Repository<SysRoleEntity>>(getRepositoryToken(SysRoleEntity))
	})

	afterEach(async () => {})

	it.skip(`生成${config.generateRoleCount}个角色`, async () => {
		for (let i = 0; i < config.generateRoleCount; i++) {
			const dto: SysRoleSaveDto = new SysRoleSaveDto()
			dto.roleName = `auto-roleName-${i}`
			dto.roleCode = `auto-roleCode-${i}`
			dto.sort = i * 100
			const exists = await sysRoleService.getByRoleCode(dto.roleCode)
			if (!exists) {
				const role = await sysRoleService.save(dto)
				expect(role).toBeDefined()
			}
		}
	}, 60_000)

	it.only(`删除自动生成的${config.generateRoleCount}个角色`, async () => {
		await sysRoleRepo
			.createQueryBuilder()
			.delete()
			.from(SysRoleEntity)
			.where("role_code LIKE :roleCode", { roleCode: "auto-roleCode-%" })
			.execute()
	}, 60_000)
})
