import { Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { plainToInstance } from "class-transformer"

import { exception } from "@aspen/aspen-core"

import { SysDeptEntity } from "../common/sys-entity"
import { SysDeptSaveDto, SysDeptEditDto } from "../controller/dto/sys-dept-dto"

@Injectable()
export class SysDeptService {
	private readonly logger = new Logger(SysDeptService.name)

	constructor(@InjectRepository(SysDeptEntity) private readonly sysDeptRep: Repository<SysDeptEntity>) {}

	// 权限分页查询
	async scopePage() {
		this.logger.debug("1")
		this.logger.log("2")
		this.logger.verbose("3")
		this.logger.warn("4")
		this.logger.fatal("5")
		return this.sysDeptRep.page()
	}

	// 根据部门id查询部门
	async getByDeptId(deptId: number): Promise<SysDeptEntity | null> {
		return this.sysDeptRep.findOneBy({ deptId: deptId })
	}

	// 新增
	async save(dto: SysDeptSaveDto): Promise<SysDeptEntity> {
		// 判断父部门是否存在
		const entity = this.sysDeptRep.create(dto)
		return entity
	}

	// 修改
	async update(dto: SysDeptEditDto): Promise<void> {
		const role = await this.getByDeptId(dto.deptId)
		if (!role) {
			throw new exception.validator(`部门id"${dto.deptId}"不存在`)
		}
		await this.sysDeptRep.update({ deptId: dto.deptId }, plainToInstance(SysDeptEntity, dto))
	}
}
