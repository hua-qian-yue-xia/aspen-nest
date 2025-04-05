import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { BaseRecordDb } from "@aspen/aspen-core"

@Entity({ comment: "菜单", name: "sys_menu" })
export class SysMenuEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "菜单id" })
	menuId: number

	@Column({ type: "bigint", comment: "菜单父id" })
	parentId: number

	@Column({ type: "varchar", length: 64, comment: "菜单名" })
	menuName: string

	@Column({ type: "varchar", length: 64, comment: "菜单类型" })
	type: string

	@Column({ type: "varchar", length: 64, comment: "图标" })
	icon: string

	@Column({ type: "varchar", length: 128, comment: "组件" })
	component: string

	@Column({ type: "varchar", length: 128, comment: "路由地址" })
	path: string

	@Column({ type: "bit", default: true, comment: "是否显示" })
	visible: boolean

	@Column({ type: "bit", default: true, comment: "是否缓存" })
	keepAlive: boolean

	@Column({ type: "varchar", length: 128, unique: true, comment: "权限标识" })
	permission: string

	@Column({ type: "int", default: 0, comment: "排序" })
	sort: number
}
