import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import * as _ from "radash"

import { Application } from "@aspen/aspen-core"

import { AppModule } from "apps/admin/src/app-module"
import { SysDeptService } from "apps/admin/src/module/sys/service/sys-dept-service"
import { SysDeptEntity, SysDeptQueryDto, SysDeptSaveDto } from "apps/admin/src/module/sys/common/entity/sys-dept-entity"

describe("sys-dept测试", () => {
	const config = {
		generateDeptCount: 200,
	}

	let sysDeptService: SysDeptService
	let sysDeptRepo: Repository<SysDeptEntity>

	beforeEach(async () => {
		process.env.NODE_ENV = "dev"
		const srcPath = `${process.cwd()}/apps/admin/src`
		const app = await new Application().create(srcPath, AppModule, { test: true })
		sysDeptService = app.getApp().get<SysDeptService>(SysDeptService)
		sysDeptRepo = app.getApp().get<Repository<SysDeptEntity>>(getRepositoryToken(SysDeptEntity))
	})

	afterEach(async () => {})

	it(`生成${config.generateDeptCount}个部门`, async () => {
		for (let i = 0; i < config.generateDeptCount; i++) {
			const obj: SysDeptSaveDto = new SysDeptSaveDto()
			obj.deptParentId = SysDeptEntity.getRootDeptId()
			obj.deptName = `auto-deptName-${i}`
			obj.sort = i * 100
			await sysDeptService.save(obj)
		}
	}, 60_000)

	it.skip(`删除自动生成的${config.generateDeptCount}个部门`, async () => {
		const rows = await sysDeptRepo
			.createQueryBuilder("a")
			.select(["a.dept_id as deptId"])
			.where("a.dept_name LIKE :deptName", { deptName: `auto-deptName-%` })
			.getRawMany()
		if (rows.length === 0) return
		const ids = rows.map((r) => r.deptId)

		const chunkSize = 1000
		const chunks = _.cluster(ids, chunkSize)

		for (const chunkIds of chunks) {
			await sysDeptRepo.delete(chunkIds)
		}
	}, 60_000)
})
