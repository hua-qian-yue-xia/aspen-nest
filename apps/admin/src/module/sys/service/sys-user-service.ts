import { Injectable } from "@nestjs/common"
import { In, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"

import * as _ from "radash"

import { BasePageVo, exception, RedisTool } from "@aspen/aspen-core"
import { cache } from "@aspen/aspen-framework"
import { JwtStrategy } from "libs/aspen-framework/src/guard/jwt"

import { SysUserEntity, SysUserAdminLoginDto, SysUserSaveDto } from "../common/entity/sys-user-entity"
import { SysDeptShare } from "./share/sys-dept.share"
import { SysRoleShare } from "./share/sys-role.share"
import { SysUserShare } from "./share/sys-user.share"

@Injectable()
export class SysUserService {
	constructor(
		@InjectRepository(SysUserEntity) private readonly sysUserRepo: Repository<SysUserEntity>,
		private readonly sysUserShare: SysUserShare,
		private readonly sysDeptShare: SysDeptShare,
		private readonly sysRoleShare: SysRoleShare,

		private readonly jwtStrategy: JwtStrategy,
		private readonly redisTool: RedisTool,
	) {}

	// 分页查询用户
	async scopePage(dto: SysUserEntity): Promise<BasePageVo<SysUserEntity>> {
		return this.sysUserRepo.page({ relations: ["userRoles", "userDepts"] })
	}

	// 根据用户id查询用户
	@cache.able({ key: "sys:user:id", value: ([userId]) => `${userId}`, expiresIn: "2h" })
	async getByUserId(userId: string) {
		const entity = await this.sysUserRepo.findOne({
			where: { userId: userId },
			relations: { userRoles: true, userDepts: true },
		})

		return entity
	}

	// 新增用户
	@cache.put({ key: "sys:user:id", value: (_, result) => `${result.userId}`, expiresIn: "2h" })
	async save(dto: SysUserSaveDto) {
		const entity = dto.toEntity()
		if (await this.sysUserShare.isUsernameDuplicate(entity)) {
			throw new exception.validator(`用户名"${dto.username}"重复`)
		}
		if (await this.sysUserShare.isMobileDuplicate(entity)) {
			throw new exception.validator(`手机号"${dto.mobile}"重复`)
		}
		// 判断部门列表
		if (!_.isEmpty(dto.deptIdList)) {
			const deptList = await this.sysDeptShare.checkExistThrow(dto.deptIdList)
			if (!_.isEmpty(deptList)) {
				entity.userDepts = deptList
			}
		}
		// 判断角色列表
		if (!_.isEmpty(dto.roleIdList)) {
			const roleList = await this.sysRoleShare.checkThrowExist(dto.roleIdList)
			if (!_.isEmpty(roleList)) {
				entity.userRoles = roleList
			}
		}
		const saveObj = await this.sysUserRepo.save(entity)
		return saveObj
	}

	// 修改用户
	@cache.evict({ key: "sys:user:id", value: ([dto]) => `${dto.userId}` })
	async edit(dto: SysUserSaveDto) {
		const entity = dto.toEntity()
		if (await this.sysUserShare.isUsernameDuplicate(entity)) {
			throw new exception.validator(`用户名"${dto.username}"重复`)
		}
		if (await this.sysUserShare.isMobileDuplicate(entity)) {
			throw new exception.validator(`手机号"${dto.mobile}"重复`)
		}

		// (1) 先更新标量字段，避免在 update 中携带多对多关系导致错误
		const partial = this.sysUserRepo.create(entity)
		await this.sysUserRepo.update({ userId: dto.userId }, partial)

		// (2) 再单独更新多对多关系
		const current = await this.sysUserRepo.findOne({
			where: { userId: dto.userId },
			relations: { userDepts: true, userRoles: true },
		})
		// 更新部门关系：当传入为空数组时清空；未传入时保持不变
		if (!_.isEmpty(dto.deptIdList)) {
			const deptList = await this.sysDeptShare.checkExistThrow(dto.deptIdList)
			await this.sysUserRepo
				.createQueryBuilder()
				.relation(SysUserEntity, "userDepts")
				.of(dto.userId)
				.addAndRemove(deptList, current?.userDepts ?? [])
		}
		if (!_.isEmpty(dto.roleIdList)) {
			const roleList = await this.sysRoleShare.checkThrowExist(dto.roleIdList)
			await this.sysUserRepo
				.createQueryBuilder()
				.relation(SysUserEntity, "userRoles")
				.of(dto.userId)
				.addAndRemove(roleList, current?.userRoles ?? [])
		}
	}

	// 根据用户ids删除用户
	async delByIds(userIds: Array<string>) {
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
	async adminLogin(dto: SysUserAdminLoginDto) {
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
}
