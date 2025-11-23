import { Injectable, Logger } from "@nestjs/common"

import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { RedisTool } from "@aspen/aspen-core"

import { SysDeptEntity } from "../../common/entity/sys-dept-entity"

@Injectable()
export class SysDeptShare {
	private readonly logger = new Logger(SysDeptShare.name)
	constructor(
		@InjectRepository(SysDeptEntity) private readonly sysDeptRepo: Repository<SysDeptEntity>,
		private readonly redisTool: RedisTool,
	) {}

	// 获取或创建根部门
	async getOrCreateRootDept() {
		const rootDept = await this.sysDeptRepo.findOne({
			where: {
				deptId: SysDeptEntity.getRootDeptId(),
			},
		})
		if (rootDept) return rootDept
		const newRootDept = this.sysDeptRepo.create({
			deptId: SysDeptEntity.getRootDeptId(),
			deptParentId: SysDeptEntity.getNotExistRootDeptId(),
			deptName: "根部门",
			sort: 0,
		})
		return this.sysDeptRepo.save(newRootDept)
	}
}
