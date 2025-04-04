import { Entity, ManyToOne } from "typeorm"

import { BaseAdminUser } from "@aspen/aspen-core"
import { SysDeptEntity } from "apps/admin/src/module/sys/_gen/_entity/sys-dept-entity"

@Entity({ comment: "用户" })
export class SysUserEntity extends BaseAdminUser {
	/**
	 * 用户部门
	 */
	@ManyToOne(() => SysDeptEntity, (sysDept) => sysDept.userList)
	userDept: SysDeptEntity
}
