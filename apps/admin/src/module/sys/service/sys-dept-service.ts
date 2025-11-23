import { Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { plainToInstance } from "class-transformer"

import * as _ from "radash"

import { exception, tool } from "@aspen/aspen-core"

import { SysDeptEntity, SysDeptQueryDto, SysDeptSaveDto } from "../common/entity/sys-dept-entity"
import { SysDeptShare } from "./share/sys-dept.share"

@Injectable()
export class SysDeptService {
	private readonly logger = new Logger(SysDeptService.name)

	constructor(
		@InjectRepository(SysDeptEntity) private readonly sysDeptRep: Repository<SysDeptEntity>,
		private readonly sysDeptShare: SysDeptShare,
	) {}

	// 权限分页查询
	async scopePage() {
		return this.sysDeptRep.page()
	}

	// 树状结构
	async tree(query: SysDeptQueryDto) {
		// 查询根部门
		const rootDept = await this.sysDeptShare.getOrCreateRootDept()
		if (!rootDept) throw new exception.runtime("根部门不存在")
		// 查询所有部门
		const deptListBuilder = this.sysDeptRep.createQueryBuilder("sys_dept")
		if (!_.isEmpty(query.deptNameLike)) {
			deptListBuilder.where("sys_dept.deptName like :deptNameLike", { deptNameLike: `%${query.deptNameLike}%` })
		}
		deptListBuilder.orderBy("sys_dept.sort", "DESC")
		const deptList = await deptListBuilder.getMany()
		// 转换为树状结构
		const tree = tool.tree.toTree(deptList, {
			idKey: "deptId",
			parentIdKey: "deptParentId",
			childrenKey: "children",
			rootParentValue: rootDept.deptParentId,
			sort: (a, b) => b.sort - a.sort,
			excludeKeys: ["delAt", "delBy", "updateBy", "updateAt"],
		})
		return tree
	}

	// 根据部门id查询部门
	async getByDeptId(deptId: string): Promise<SysDeptEntity | null> {
		return this.sysDeptRep.findOneBy({ deptId: deptId })
	}

	// 新增
	async save(dto: SysDeptSaveDto): Promise<SysDeptEntity> {
		console.log(this.sysDeptRep.create(dto.toEntity()))

		// 判断父部门是否存在
		const saveObj = await this.sysDeptRep.save(this.sysDeptRep.create(dto.toEntity()))
		return saveObj
	}

	// 修改
	async update(dto: SysDeptSaveDto): Promise<void> {
		const role = await this.getByDeptId(dto.deptId)
		if (!role) {
			throw new exception.validator(`部门id"${dto.deptId}"不存在`)
		}
		await this.sysDeptRep.update({ deptId: dto.deptId }, dto.toEntity())
	}
}
