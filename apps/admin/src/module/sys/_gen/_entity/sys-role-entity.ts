import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { BaseRecordDb } from "@aspen/aspen-core"

@Entity({ comment: "角色", name: "sys_role" })
export class SysRoleEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "角色id" })
	roleId: number

	@Column({ type: "varchar", length: 64, comment: "角色名" })
	roleName: string

	@Column({ type: "varchar", length: 64, comment: "角色编码" })
	roleCode: string
}
