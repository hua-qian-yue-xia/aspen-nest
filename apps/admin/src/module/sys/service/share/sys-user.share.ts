import { Injectable } from "@nestjs/common"

import { DataSource, EntityTarget, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

import { SysUserEntity } from "../../common/entity/sys-user-entity"
import { exception } from "@aspen/aspen-core"

@Injectable()
export class SysUserShare {
	constructor(@InjectRepository(SysUserEntity) private readonly sysUserRepo: Repository<SysUserEntity>) {}

	// 查询用户是否存在
	async checkThrowExist(userId: string) {
		const user = await this.sysUserRepo.findOneBy({ userId: userId })
		if (!user) {
			throw new exception.runtime(`用户"${userId}"不存在`)
		}
		return user
	}

	// 用户名是否重复
	async isUsernameDuplicate(entity: SysUserEntity): Promise<boolean> {
		const queryBuilder = this.sysUserRepo
			.createQueryBuilder("user")
			.where("user.username = :username", { username: entity.username })
		if (entity.userId) {
			queryBuilder.andWhere("user.user_id != :userId", { userId: entity.userId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}

	// 用户手机号是否重复
	async isMobileDuplicate(entity: SysUserEntity): Promise<boolean> {
		const queryBuilder = this.sysUserRepo
			.createQueryBuilder("user")
			.where("user.mobile = :mobile", { mobile: entity.mobile })
		if (entity.userId) {
			queryBuilder.andWhere("user.user_id != :userId", { userId: entity.userId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}
}
