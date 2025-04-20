import { Entity, OneToMany, Column, PrimaryGeneratedColumn } from "typeorm"
import { AspenRule, AspenValidator, BaseRecordDb } from "@aspen/aspen-core"
import { SysUserEntity } from "apps/admin/src/module/sys/_gen/_entity/sys-user-entity"

@Entity({ comment: "部门", name: "sys_dept" })
export class SysDeptEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "部门id" })
	@AspenValidator({ summary: "部门id", rule: AspenRule().isNotEmpty() })
	deptId: number

	@Column({ type: "bigint", comment: "部门父id" })
	@AspenValidator({ summary: "部门父id", rule: AspenRule().isNotEmpty() })
	deptParentId: number

	@Column({ type: "varchar", length: 64, comment: "部门名" })
	@AspenValidator({ summary: "部门名", rule: AspenRule().isNotEmpty() })
	deptName: string

	@OneToMany(() => SysUserEntity, (sysUser) => sysUser.userDept)
	users: Array<SysUserEntity>
}
