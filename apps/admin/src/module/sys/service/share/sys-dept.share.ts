import { Injectable, Logger } from "@nestjs/common"

import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import * as _ from "radash"

import { exception, RedisTool } from "@aspen/aspen-core"

import { SysDeptEntity } from "../../common/entity/sys-dept-entity"
import { sysDeptTypeEnum } from "../../common/sys-enum.enum-gen"
import { SysUserEntity } from "../../common/entity/sys-user-entity"

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

	// 为`isCatalogueDpet`为`true`的目录的专属部门
	async generateOrUpdateCatalogueDpet(saveObj: SysDeptEntity) {
		const catalogueDpet = await this.sysDeptRep.findOneBy({
			deptParentId: saveObj.deptId,
			isCatalogueDpet: true,
		})
		const targetDeptType = saveObj.deptType
		// 把部门从`部门`修改到`部门目录`
		if (targetDeptType === sysDeptTypeEnum.DEPT_CATALOGUE.code) {
			const catalogueDpetObj = SysDeptEntity.generateCatalogueDpet(saveObj)
			// 新增
			if (_.isEmpty(catalogueDpet)) {
				catalogueDpetObj.deptId = undefined
				await this.sysDeptRep.save(catalogueDpetObj)
			}
			// 更新
			else {
				await this.sysDeptRep.update({ deptId: catalogueDpet.deptId }, catalogueDpetObj)
			}
			// 迁移部门用户
			await this.migrateDeptUserThrow(saveObj.deptId, catalogueDpetObj.deptId)
			return
		}
		// 把部门从`部门目录`修改到`部门`
		if (targetDeptType === sysDeptTypeEnum.DEPT.code) {
			if (!catalogueDpet) return
			// 迁移部门用户
			await this.migrateDeptUserThrow(catalogueDpet.deptId, saveObj.deptId)
			// 删除
			await this.sysDeptRep.delete({ deptId: catalogueDpet.deptId })
			return
		}
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

	// 迁移部门用户
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
