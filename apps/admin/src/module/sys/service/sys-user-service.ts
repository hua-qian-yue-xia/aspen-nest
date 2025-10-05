import { Injectable } from "@nestjs/common"
import { In, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { plainToInstance } from "class-transformer"

import { BasePageVo, exception, RedisTool } from "@aspen/aspen-core"
import { cache } from "@aspen/aspen-framework"
import { JwtStrategy } from "libs/aspen-framework/src/guard/jwt"

import { SysUserEntity } from "apps/admin/src/module/sys/_gen/_entity/index"

import { SysUserAdminLoginDto, SysUserEditDto, SysUserSaveDto } from "apps/admin/src/module/sys/dto/sys-user-dto"

@Injectable()
export class SysUserService {
	constructor(
		@InjectRepository(SysUserEntity) private readonly sysUserRepo: Repository<SysUserEntity>,
		private readonly jwtStrategy: JwtStrategy,
		private readonly redisTool: RedisTool,
	) {}

	// 分页查询用户
	async scopePage(): Promise<BasePageVo<SysUserEntity>> {
		return this.sysUserRepo.page()
	}

	// 根据用户id查询用户
	@cache.able({ key: "sys:user:id", value: ([userId]) => `${userId}`, expiresIn: "2h" })
	async getByUserId(userId: number) {
		return this.sysUserRepo.findOneBy({ userId: userId })
	}

	// 新增用户
	@cache.put({ key: "sys:user:id", value: (_, result) => `${result.userId}`, expiresIn: "2h" })
	async save(dto: SysUserSaveDto) {
		if (await this.isUsernameDuplicate(dto.username, null)) {
			throw new exception.validator(`用户名"${dto.username}"重复`)
		}
		if (await this.isMobileDuplicate(dto.mobile, null)) {
			throw new exception.validator(`手机号"${dto.mobile}"重复`)
		}
		const obj = plainToInstance(SysUserEntity, dto)
		obj.enable = true
		obj.password = obj.encryptPassword("123456")
		const saveObj = await this.sysUserRepo.save(obj)
		return saveObj
	}

	// 修改用户
	@cache.evict({ key: "sys:user:id", value: ([dto]) => `${dto.userId}` })
	async edit(dto: SysUserEditDto) {
		if (await this.isUsernameDuplicate(dto.username, dto.userId)) {
			throw new exception.validator(`用户名"${dto.username}"重复`)
		}
		if (await this.isMobileDuplicate(dto.mobile, dto.userId)) {
			throw new exception.validator(`手机号"${dto.mobile}"重复`)
		}
		const obj = plainToInstance(SysUserEntity, dto)
		await this.sysUserRepo.update({ userId: dto.userId }, obj)
	}

	// 根据用户ids删除用户
	async delByIds(userIds: Array<number>) {
		// 查询存不存在
		const userList = await this.sysUserRepo.find({ where: { userId: In(userIds) } })
		if (!userList.length) return 0
		const delUserIds = userList.map((v) => v.userId)
		// 删除数据
		const { affected } = await this.sysUserRepo.softDelete(delUserIds)
		// 删除缓存
		this.redisTool.del(delUserIds.map((v) => `sys:user:id:${v}`))
		return affected ?? 0
	}

	// admin登录
	async adminLogin(dto: SysUserAdminLoginDto): Promise<object> {
		const { username, password } = dto
		// 1.1 校验用户是否存在、密码是否正确
		const user = await this.sysUserRepo.findOneBy({ username: username })
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

	// 用户名是否重复
	async isUsernameDuplicate(username: string, userId?: number): Promise<boolean> {
		const queryBuilder = this.sysUserRepo.createQueryBuilder("user").where("user.username = :username", { username })
		if (userId) {
			queryBuilder.andWhere("user.userId != :userId", { userId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}

	// 用户手机号是否重复
	async isMobileDuplicate(mobile: string, userId?: number): Promise<boolean> {
		const queryBuilder = this.sysUserRepo.createQueryBuilder("user").where("user.mobile = :mobile", { mobile })
		if (userId) {
			queryBuilder.andWhere("user.userId != :userId", { userId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}
}
