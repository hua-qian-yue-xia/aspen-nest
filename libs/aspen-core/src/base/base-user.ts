import { Column, PrimaryGeneratedColumn } from "typeorm"

import { BaseRecordDb } from "../index"

export class BaseAdminUser extends BaseRecordDb {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "用户id" })
	userId: number

	@Column({ type: "varchar", length: 64, unique: true, comment: "登录名" })
	username: string

	@Column({ type: "varchar", length: 64, comment: "用户昵称" })
	userNickname: string

	@Column({ type: "varchar", length: 128, comment: "用户密码" })
	password: string

	@Column({ type: "varchar", length: 128, unique: true, comment: "用户手机号" })
	mobile: string

	@Column({ type: "bit", default: true, comment: "是否启用" })
	enable: boolean

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
}
