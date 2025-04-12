import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

import { AspenValidator, AspenRule, BaseRecordDb, SortColumn } from "@aspen/aspen-core"

@Entity({ comment: "角色", name: "sys_role" })
export class SysRoleEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "角色id" })
	@AspenValidator({ summary: "角色id", rule: AspenRule().isNotEmpty() })
	roleId: number

	@Column({ type: "varchar", length: 64, comment: "角色名" })
	@AspenValidator({ summary: "角色名", rule: AspenRule().isNotEmpty() })
	roleName: string

	@Column({ type: "varchar", length: 64, comment: "角色编码" })
	@AspenValidator({ summary: "角色编码", rule: AspenRule().isNotEmpty() })
	roleCode: string

	@Column(() => SortColumn, { prefix: false })
	sort: SortColumn
}
