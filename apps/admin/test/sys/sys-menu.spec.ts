import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import * as _ from "radash"

import { Application } from "@aspen/aspen-core"

import { AppModule } from "apps/admin/src/app-module"
import { SysMenuEntity, SysMenuSaveDto } from "apps/admin/src/module/sys/common/entity/sys-menu-entity"
import { SysMenuService } from "apps/admin/src/module/sys/service/sys-menu-service"
import { sysMenuTypeEnum } from "apps/admin/src/module/sys/common/sys-enum.enum-gen"
import { comEnableEnum } from "@aspen/aspen-framework/enum/com-enable.enum-gen"

describe("sys-menu测试", () => {
	const config = {
		generateMenuCount: 200,
	}

	let sysMenuService: SysMenuService
	let sysMenuRepo: Repository<SysMenuEntity>

	beforeEach(async () => {
		process.env.NODE_ENV = "dev"
		const srcPath = `${process.cwd()}/apps/admin/src`
		const app = await new Application().create(srcPath, AppModule, { test: true })
		sysMenuService = app.getApp().get<SysMenuService>(SysMenuService)
		sysMenuRepo = app.getApp().get<Repository<SysMenuEntity>>(getRepositoryToken(SysMenuEntity))
	})

	afterEach(async () => {})

	it.skip(`生成${config.generateMenuCount}个菜单`, async () => {
		for (let i = 0; i < config.generateMenuCount; i++) {
			const obj: SysMenuSaveDto = new SysMenuSaveDto()
			obj.parentId = SysMenuEntity.getNotExistRootMenuId()
			obj.menuName = `auto-menuName-${i}`
			obj.type = sysMenuTypeEnum.MENU.code
			obj.visible = comEnableEnum.YES.code
			obj.keepAlive = comEnableEnum.YES.code
			obj.sort = i * 100
			await sysMenuService.save(obj)
		}
	}, 60_000)

	it(`删除自动生成的${config.generateMenuCount}个菜单`, async () => {
		const rows = await sysMenuRepo
			.createQueryBuilder("a")
			.select(["a.menu_id as menuId"])
			.where("a.menu_name LIKE :menuName", { menuName: `auto-menuName-%` })
			.getRawMany()
		if (rows.length === 0) return
		const ids = rows.map((r) => r.menuId)

		const chunkSize = 1000
		const chunks = _.cluster(ids, chunkSize)

		for (const chunkIds of chunks) {
			await sysMenuRepo.delete(chunkIds)
		}
	}, 60_000)
})
