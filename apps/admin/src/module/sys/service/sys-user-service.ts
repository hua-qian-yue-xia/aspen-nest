import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { cache } from "@aspen/aspen-core"

import { SysUserEntity } from "apps/admin/src/module/sys/_gen/_entity/index"

@Injectable()
export class SysUserService {
	constructor(@InjectRepository(SysUserEntity) private readonly sysUserEntity: Repository<SysUserEntity>) {}

	// 根据用户id查询用户
	@cache.able({ key: "sys:user:id", values: ["#p{0}"], expiresIn: "2h" })
	async getByUserId(userId: number) {
		return this.sysUserEntity.findOneBy({ userId: userId })
	}
}
