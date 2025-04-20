import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm"

import { BaseAdminUser } from "@aspen/aspen-core"
import { SysDeptEntity, SysRoleEntity } from "apps/admin/src/module/sys/_gen/_entity"

@Entity({ comment: "用户", name: "sys_user" })
export class SysUserEntity extends BaseAdminUser {
	@ManyToMany(() => SysRoleEntity)
	@JoinTable({ name: "sys_user_role", joinColumn: { name: "user_id" }, inverseJoinColumn: { name: "role_id" } })
	roles: Array<SysRoleEntity>

	@ManyToOne(() => SysDeptEntity, (sysDept) => sysDept.users)
	@JoinColumn({ name: "dept_id" })
	userDept: SysDeptEntity
}
