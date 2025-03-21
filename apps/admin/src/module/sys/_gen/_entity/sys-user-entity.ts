import { Entity, ManyToOne } from "typeorm"

import { BaseAdminUser } from "packages/aspen-core/src"
import { SysDeptEntity } from "apps/admin/src/module/sys/_gen/_entity/sys-dept-entity"

@Entity()
export class SysUserEntity extends BaseAdminUser {
	/**
	 * 用户部门
	 */
	@ManyToOne(() => SysDeptEntity, (sysDept) => sysDept.userList)
	userDept: SysDeptEntity
}
