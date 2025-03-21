import { Entity, OneToMany, PrimaryColumn } from "typeorm"
import { BaseRecordDb } from "packages/aspen-core/src"
import { SysUserEntity } from "apps/admin/src/module/sys/_gen/_entity/sys-user-entity"

@Entity()
export class SysDeptEntity extends BaseRecordDb {
	@PrimaryColumn({ type: "bigint", length: 20, comment: "部门id" })
	deptId: number

	@PrimaryColumn({ type: "bigint", length: 20, comment: "部门父id" })
	deptParentId: number

	@PrimaryColumn({ type: "varchar", length: 64, comment: "部门名" })
	deptName: string

	@OneToMany(() => SysUserEntity, (sysUser) => sysUser.userDept)
	userList: SysUserEntity[]
}
