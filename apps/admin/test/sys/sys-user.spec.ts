import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import * as _ from "radash"

import { Application } from "@aspen/aspen-core"

import { AppModule } from "apps/admin/src/app-module"
import { SysUserService } from "apps/admin/src/module/sys/service/sys-user-service"
import { SysUserEntity, SysUserSaveDto } from "apps/admin/src/module/sys/common/entity/sys-user-entity"
import { SysRoleEntity } from "apps/admin/src/module/sys/common/entity/sys-role-entity"
import { SysDeptEntity } from "apps/admin/src/module/sys/common/entity/sys-dept-entity"

describe("sys-user测试", () => {
	const config = {
		generateUserCount: 100,
	}

	let sysUserService: SysUserService
	let sysUserRepo: Repository<SysUserEntity>
	let sysRoleRepo: Repository<SysRoleEntity>
	let sysDeptRepo: Repository<SysDeptEntity>

	beforeEach(async () => {
		process.env.NODE_ENV = "dev"
		const srcPath = `${process.cwd()}/apps/admin/src`
		const app = await new Application().create(srcPath, AppModule, { test: true })
		sysUserService = app.getApp().get<SysUserService>(SysUserService)
		sysUserRepo = app.getApp().get<Repository<SysUserEntity>>(getRepositoryToken(SysUserEntity))
		sysRoleRepo = app.getApp().get<Repository<SysRoleEntity>>(getRepositoryToken(SysRoleEntity))
		sysDeptRepo = app.getApp().get<Repository<SysDeptEntity>>(getRepositoryToken(SysDeptEntity))
	})

	afterEach(async () => {})

	it(`生成${config.generateUserCount}个用户`, async () => {
		// 查询第一个部门
		const dept = await sysDeptRepo.findOne({
			where: {},
			order: {
				sort: "ASC",
				deptId: "ASC",
			},
		})
		if (_.isEmpty(dept)) throw new Error("未查询到部门")
		// 查询第一个角色
		const role = await sysRoleRepo.findOne({
			where: {},
			order: {
				sort: "ASC",
				roleId: "ASC",
			},
		})
		if (_.isEmpty(role)) throw new Error("未查询到角色")
		const userList: Array<SysUserSaveDto> = []
		for (let i = 0; i < config.generateUserCount; i++) {
			const obj: SysUserSaveDto = new SysUserSaveDto()
			obj.username = `auto-username-${i}`
			obj.userNickname = `auto-userNickname-${i}`
			obj.mobile = `1380000000${i}`
			obj.enable = true
			obj.sort = i * 100
			obj.deptIdList = [dept.deptId]
			obj.roleIdList = [role.roleId]
			await sysUserService.save(obj)
			userList.push(obj)
		}
	}, 60_000)

	it.skip(`删除自动生成的${config.generateUserCount}个用户`, async () => {
		const rows = await sysUserRepo
			.createQueryBuilder("a")
			.select(["a.user_id as userId"])
			.where("a.username LIKE :username", { username: "auto-username-%" })
			.getRawMany()
		if (rows.length === 0) return
		const ids = rows.map((r) => r.userId)

		const chunkSize = 1000
		const chunks = _.cluster(ids, chunkSize)

		for (const chunkIds of chunks) {
			await sysUserRepo.delete(chunkIds)
		}
	}, 60_000)
})
