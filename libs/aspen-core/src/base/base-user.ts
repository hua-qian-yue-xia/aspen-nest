import { instanceToPlain, plainToClass } from "class-transformer"
import * as bcrypt from "bcrypt"

import { BaseRecordDb } from "../index"

export class BaseUser extends BaseRecordDb {
	// 用户id
	userId: string

	// 登录名
	username: string

	// 用户昵称
	userNickname: string

	// 用户密码
	password: string

	// 用户手机号
	mobile: string

	// 是否启用
	enable: boolean

	static toClass(obj: Record<string, any>): BaseUser {
		return plainToClass(BaseUser, obj)
	}

	/**
	 * 是否是超级管理员
	 */
	isSuperAdmin(): boolean {
		return false
	}

	/**
	 * 是否启用
	 */
	isEnable(): boolean {
		return this.enable
	}

	/**
	 * 密码是否正确
	 */
	checkPassword(password: string): boolean {
		return bcrypt.compareSync(password, this.password)
	}

	/**
	 * 密码加密
	 */
	encryptPassword(password: string, rounds = 10): string {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(rounds))
	}

	toObj() {
		return instanceToPlain(this)
	}
}
