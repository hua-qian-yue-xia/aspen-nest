import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { IsNotEmpty } from "class-validator"

import { BaseRecordDb, GroupEnum } from "@aspen/aspen-core"

@Entity({ comment: "角色", name: "sys_role" })
export class SysRoleEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "角色id" })
	roleId: number

	@Column({ type: "varchar", length: 64, comment: "角色名" })
	@IsNotEmpty({ message: "角色名不能为空", groups: [GroupEnum.ADMIN_SAVE] })
	roleName: string

	@Column({ type: "varchar", length: 64, comment: "角色编码" })
	@IsNotEmpty({ message: "角色编码不能为空", groups: [GroupEnum.ADMIN_SAVE] })
	roleCode: string
}
