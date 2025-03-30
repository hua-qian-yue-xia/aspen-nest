import { PrimaryColumn } from "typeorm"

import { BaseRecordDb } from "../index"

export class BaseAdminUser extends BaseRecordDb {
	@PrimaryColumn({ type: "bigint", length: 20, comment: "用户id" })
	userId: number

	@PrimaryColumn({ type: "varchar", length: 64, unique: true, comment: "登录名" })
	username: string

	@PrimaryColumn({ type: "varchar", length: 64, comment: "用户昵称" })
	userNickname: string

	@PrimaryColumn({ type: "varchar", length: 128, comment: "用户密码" })
	password: string

	@PrimaryColumn({ type: "varchar", length: 128, unique: true, comment: "用户手机号" })
	mobile: string

	/**
	 * 是否是超级管理员
	 */
	isSuperAdmin(): boolean {
		return false
	}
}
