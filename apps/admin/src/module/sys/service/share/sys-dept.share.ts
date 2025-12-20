import { Injectable, Logger } from "@nestjs/common"

import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import * as _ from "radash"

import { exception, RedisTool } from "@aspen/aspen-core"

import { SysDeptEntity } from "../../common/entity/sys-dept-entity"
import { SysUserEntity } from "../../common/entity/sys-user-entity"
import { SysDeptCountTotalBO } from "../BO/sys-dept-bo"

@Injectable()
export class SysDeptShare {
	private readonly logger = new Logger(SysDeptShare.name)
	constructor(
		@InjectRepository(SysDeptEntity) private readonly sysDeptRep: Repository<SysDeptEntity>,
		@InjectRepository(SysUserEntity) private readonly sysUserRep: Repository<SysUserEntity>,
		private readonly redisTool: RedisTool,
	) {}

	// 获取或创建根部门
	async getOrCreateRootDept() {
		const rootDept = await this.sysDeptRep.findOne({
			where: {
				deptId: SysDeptEntity.getRootDeptId(),
			},
		})
		if (rootDept) return rootDept
		const newRootDept = this.sysDeptRep.create({
			deptId: SysDeptEntity.getRootDeptId(),
			deptParentId: SysDeptEntity.getNotExistRootDeptId(),
			deptName: "根部门",
			sort: 0,
		})
		return this.sysDeptRep.save(newRootDept)
	}

	// 判断传入的`deptIdList`是否存在,会抛出异常
	async checkExistThrow(str: Array<string> | string) {
		const checkDeptIdList = _.isArray(str) ? str : [str]
		if (_.isEmpty(checkDeptIdList)) return []
		// 查询所有的部门
		const deptList = await this.sysDeptRep.find()
		if (_.isEmpty(deptList)) return []
		const deptIdList = deptList.map((v) => v.deptId)
		for (const checkDeptId of checkDeptIdList) {
			if (!deptIdList.includes(checkDeptId)) {
				// TODO 高风险
				throw new exception.runtime(`传入的部门idList中存在不存在的部门id:${checkDeptId}`)
			}
		}
		return deptList.filter((v) => checkDeptIdList.includes(v.deptId))
	}

	// 查询部门统计
	async getDeptCountTotal(deptIdList: Array<string>) {
		if (_.isEmpty(deptIdList)) return []

		await this.checkExistThrow(deptIdList)

		const allDepts = await this.sysDeptRep.find({ select: ["deptId", "deptParentId", "deptName"] })
		const childrenMap = new Map<string, Array<string>>()
		for (const d of allDepts) {
			const pid = d.deptParentId
			if (!childrenMap.has(pid)) childrenMap.set(pid, [])
			childrenMap.get(pid)!.push(d.deptId)
		}

		const result: Array<SysDeptCountTotalBO> = []
		for (const rootId of deptIdList) {
			// 子部门
			const descendants: Array<string> = []
			// 本部门+子部门
			const personDeptIds: Array<string> = [rootId]
			const queue: Array<string> = [...(childrenMap.get(rootId) ?? [])]
			while (queue.length) {
				const id = queue.shift()!
				descendants.push(id)
				const kids = childrenMap.get(id)
				if (kids && kids.length) queue.push(...kids)
			}

			const bo = new SysDeptCountTotalBO()
			bo.dpetId = rootId
			bo.deptName = allDepts.find((v) => v.deptId === rootId)?.deptName ?? ""
			bo.dpetCount = descendants.length
			if (personDeptIds.length > 0) {
				const raw = await this.sysUserRep
					.createQueryBuilder("user")
					.innerJoin("user.userDepts", "dept")
					.where("dept.dept_id IN (:...ids)", { ids: personDeptIds })
					.select("COUNT(DISTINCT user.user_id)", "cnt")
					.getRawOne<{ cnt: string }>()
				bo.personCount = Number(raw?.cnt ?? 0)
			} else {
				bo.personCount = 0
			}
			result.push(bo)
		}

		return result
	}

	// 迁移用户的部门
	async migrateDeptUserThrow(sourceDeptId: string, targetDeptId: string) {
		// 查询源部门
		const sourceDept = await this.sysDeptRep.findOneBy({ deptId: sourceDeptId })
		if (_.isEmpty(sourceDept)) {
			throw new exception.runtime(`传入的源部门id:${sourceDeptId}不存在`)
		}
		// 查询目标部门
		const targetDept = await this.sysDeptRep.findOneBy({ deptId: targetDeptId })
		if (_.isEmpty(targetDept)) {
			throw new exception.runtime(`传入的目标部门id:${targetDeptId}不存在`)
		}
		// 查询用户
		const userList = await this.sysUserRep.find({
			where: {
				userDepts: {
					deptId: sourceDeptId,
				},
			},
		})
		if (_.isEmpty(userList)) return
		// 更新用户部门
		await this.sysUserRep.createQueryBuilder().relation("userDepts").of(userList).addAndRemove(targetDept, sourceDept)
		// 删除所有用户的缓存
		await this.redisTool.delByPattern(`sys:user:id:*`)
	}
}
