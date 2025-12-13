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
		const deptListBuilder = this.sysDeptRep.createQueryBuilder("sys_dept").orderBy("sys_dept.sort", "DESC")
		const deptList = await deptListBuilder.getMany()
		// 转换为树状结构
		let tree = tool.tree.toTree(deptList, {
			idKey: "deptId",
			parentIdKey: "deptParentId",
			childrenKey: "children",
			rootParentValue: rootDept.deptParentId,
			sort: (a, b) => {
				return b.sort - a.sort
			},
			excludeKeys: ["delAt", "delBy", "updateBy", "updateAt"],
		})
		if (!_.isEmpty(query.deptNameLike)) {
			tree = tool.tree.filter(
				tree,
				(node) => {
					return node.deptName.includes(query.deptNameLike)
				},
				"children",
			)
		}
		return tree
	}

	// 根据部门id查询部门
	async getByDeptId(deptId: string): Promise<SysDeptEntity | null> {
		return this.sysDeptRep.findOneBy({ deptId: deptId })
	}

	// 新增
	async save(dto: SysDeptSaveDto): Promise<SysDeptEntity> {
		// 判断父部门是否存在
		const saveObj = await this.sysDeptRep.save(this.sysDeptRep.create(dto.toEntity()))
		return saveObj
	}

	// 修改
	async update(dto: SysDeptSaveDto): Promise<void> {
		const [deptDetail] = await this.sysDeptShare.checkExistThrow(dto.deptId)
		if (!deptDetail) {
			throw new exception.validator(`部门id"${dto.deptId}"不存在`)
		}
		const entity = dto.toEntity()
		await this.sysDeptRep.update({ deptId: dto.deptId }, entity)
	}

	// 删除部门
	async delete(deptIds: Array<string>) {
		this.sysDeptShare.checkExistThrow(deptIds)
		const deptCountTotalList = await this.sysDeptShare.getDeptCountTotal(deptIds)
		for (const dept of deptCountTotalList) {
			if (dept.dpetCount > 0) {
				throw new exception.validator(`部门"${dept.deptName}"下存在子部门,不能删除`)
			}
			if (dept.personCount > 0) {
				throw new exception.validator(`部门"${dept.deptName}"下存在用户,不能删除`)
			}
		}
		await this.sysDeptRep.softDelete(deptIds)
	}
}
