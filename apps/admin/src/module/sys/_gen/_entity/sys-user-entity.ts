import { Entity, JoinColumn, ManyToOne } from "typeorm"

import { BaseAdminUser } from "@aspen/aspen-core"
import { SysDeptEntity } from "apps/admin/src/module/sys/_gen/_entity/sys-dept-entity"

@Entity({ comment: "用户", name: "sys_user" })
export class SysUserEntity extends BaseAdminUser {
	@ManyToOne(() => SysDeptEntity, (sysDept) => sysDept.users)
	@JoinColumn({ name: "dept_id" })
	userDept: SysDeptEntity
}
