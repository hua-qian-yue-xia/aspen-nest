import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { plainToInstance } from "class-transformer"

import { SysDeptEntity } from "apps/admin/src/module/sys/_gen/_entity/index"
import { SysDeptSaveDto, SysDeptEditDto } from "apps/admin/src/module/sys/dto/index"
import { RuntimeException } from "@aspen/aspen-core"

@Injectable()
export class SysDeptService {
	constructor(@InjectRepository(SysDeptEntity) private readonly sysDeptRep: Repository<SysDeptEntity>) {}

	// 权限分页查询
	async scopePage() {
		return this.sysDeptRep.page()
	}

	// 根据部门id查询部门
	async getByDeptId(deptId: number): Promise<SysDeptEntity | null> {
		return this.sysDeptRep.findOneBy({ deptId: deptId })
	}

	// 新增
	async save(dto: SysDeptSaveDto): Promise<SysDeptEntity> {
		const saveObj = await this.sysDeptRep.save(plainToInstance(SysDeptEntity, dto))
		return saveObj
	}

	// 修改
	async update(dto: SysDeptEditDto): Promise<void> {
		const role = await this.getByDeptId(dto.deptId)
		if (!role) {
			throw new RuntimeException(`部门id"${dto.deptId}"不存在`)
		}
		await this.sysDeptRep.update({ deptId: dto.deptId }, plainToInstance(SysDeptEntity, dto))
	}
}
