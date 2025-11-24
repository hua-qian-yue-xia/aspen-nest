import { Injectable, Logger } from "@nestjs/common"

import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"

import * as _ from "radash"

import { exception, RedisTool } from "@aspen/aspen-core"

import { SysDeptEntity } from "../../common/entity/sys-dept-entity"
import { sysDeptTypeEnum } from "../../common/sys-enum.enum-gen"

@Injectable()
export class SysDeptShare {
	private readonly logger = new Logger(SysDeptShare.name)
	constructor(
		@InjectRepository(SysDeptEntity) private readonly sysDeptRep: Repository<SysDeptEntity>,
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
		if (saveObj.deptType === sysDeptTypeEnum.DEPT_CATALOGUE.code) {
			const catalogueDpetObj = SysDeptEntity.generateCatalogueDpet(saveObj)
			// 新增
			if (_.isEmpty(catalogueDpet)) {
				catalogueDpetObj.deptId = undefined
				await this.sysDeptRep.save(catalogueDpetObj)
				return
			}
			// 更新
			await this.sysDeptRep.update({ deptId: catalogueDpet.deptId }, catalogueDpetObj)
		} else {
			if (catalogueDpet) {
				// 判断`专属部门`下是否有人员

				// 删除
				await this.sysDeptRep.delete({ deptId: catalogueDpet.deptId })
			}
		}
	}

	// 判断传入的`deptIdList`是否存在,会抛出异常
	async checkThrowExist(str: Array<string> | string) {
		const checkDeptIdList = _.isArray(str) ? str : [str]
		// 查询所有的部门
		const deptList = await this.sysDeptRep.find({
			where: {
				deptType: sysDeptTypeEnum.DEPT.code,
			},
		})
		if (_.isEmpty(deptList)) {
			return []
		}
		const deptIdList = deptList.map((v) => v.deptId)
		for (const checkDeptId of checkDeptIdList) {
			if (!deptIdList.includes(checkDeptId)) {
				// TODO 高风险
				throw new exception.runtime(`传入的部门idList中存在不存在的部门id:${checkDeptId}`)
			}
		}
		return deptList.filter((v) => checkDeptIdList.includes(v.deptId))
	}
}
