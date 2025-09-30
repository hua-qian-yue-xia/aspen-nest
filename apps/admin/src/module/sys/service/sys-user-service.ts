import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { exception } from "@aspen/aspen-core"
import { cache } from "@aspen/aspen-framework"
import { JwtStrategy } from "libs/aspen-framework/src/guard/jwt"

import { SysUserEntity } from "apps/admin/src/module/sys/_gen/_entity/index"

import { SysUserAdminLoginDto } from "apps/admin/src/module/sys/dto/sys-user-dto"

@Injectable()
export class SysUserService {
	constructor(
		@InjectRepository(SysUserEntity) private readonly sysUserEntity: Repository<SysUserEntity>,
		private readonly jwtStrategy: JwtStrategy,
	) {}

	// 分页
	async scopePage() {
		return this.sysUserEntity.find()
	}

	// 根据用户id查询用户
	@cache.able({ key: "sys:user:id", value: ([userId]) => `${userId}`, expiresIn: "2h" })
	async getByUserId(userId: number) {
		return this.sysUserEntity.findOneBy({ userId: userId })
	}

	// admin登录
	async adminLogin(dto: SysUserAdminLoginDto) {
		const { username, password } = dto
		// 1.1 校验用户是否存在、密码是否正确
		const user = await this.sysUserEntity.findOneBy({ username: username })
		if (!user || !user.checkPassword(password)) {
			throw new exception.validator("用户名或密码错误")
		}
		// 1.2 校验用户是否启用
		if (!user.isEnable()) {
			throw new exception.validator("用户已被禁用")
		}
		// 2.1 生成token
		const token = await this.jwtStrategy.generateToken(user, { platform: "admin" })
		return token
	}

	// admin登出
	async adminLogout() {}
}
