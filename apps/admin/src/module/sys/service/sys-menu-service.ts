import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { SysMenuEntity } from "apps/admin/src/module/sys/_gen/_entity/index"
import { Repository } from "typeorm"

@Injectable()
export class SysMenuService {
	constructor(@InjectRepository(SysMenuEntity) private readonly sysMenuEntity: Repository<SysMenuEntity>) {}

	// 权限分页查询
	async scopePage() {
		return await this.sysMenuEntity.page()
	}

	// 根据部门id查询部门
	async getByMenuId(menuId: number) {
		return this.sysMenuEntity.findOneBy({ menuId: menuId })
	}
}
