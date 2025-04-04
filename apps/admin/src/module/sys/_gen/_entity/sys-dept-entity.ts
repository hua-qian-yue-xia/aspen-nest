import { Entity, OneToMany, Column, PrimaryGeneratedColumn } from "typeorm"
import { BaseRecordDb } from "@aspen/aspen-core"
import { SysUserEntity } from "apps/admin/src/module/sys/_gen/_entity/sys-user-entity"

@Entity({ comment: "部门" })
export class SysDeptEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "部门id" })
	deptId: number

	@Column({ type: "bigint", comment: "部门父id" })
	deptParentId: number

	@Column({ type: "varchar", length: 64, comment: "部门名" })
	deptName: string

	@OneToMany(() => SysUserEntity, (sysUser) => sysUser.userDept)
	userList: SysUserEntity[]
}
