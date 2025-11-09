import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

import { plainToInstance } from "class-transformer"
import * as _ from "radash"

import { AspenRule, AspenSummary, BaseRecordDb } from "@aspen/aspen-core"

import { sysMenuTypeEnum } from "../sys-enum.enum-gen"

/*
 * ---------------------------------------------------------------
 * ## 菜单表
 * ---------------------------------------------------------------
 */
@Entity({ comment: "菜单", name: "sys_menu" })
export class SysMenuEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "菜单id" })
	@AspenSummary({ summary: "菜单id" })
	menuId: number

	@Column({ type: "bigint", comment: "菜单父id" })
	@AspenSummary({ summary: "菜单父id" })
	parentId: number

	@Column({ type: "varchar", length: 64, comment: "菜单名" })
	@AspenSummary({ summary: "菜单名" })
	menuName: string

	@Column({ type: "char", length: 32, comment: "菜单类型" })
	@AspenSummary({ summary: "菜单类型" })
	type: string

	@Column({ type: "char", length: 32, nullable: true, comment: "菜单位置" })
	@AspenSummary({ summary: "菜单位置" })
	position: string

	@Column({ type: "varchar", length: 64, nullable: true, comment: "图标" })
	@AspenSummary({ summary: "图标" })
	icon: string

	@Column({ type: "varchar", length: 128, nullable: true, comment: "路由地址" })
	@AspenSummary({ summary: "路由地址" })
	path: string

	@Column({ type: "bit", default: true, comment: "是否显示" })
	@AspenSummary({ summary: "是否显示" })
	visible: boolean

	@Column({ type: "bit", default: true, comment: "是否缓存" })
	@AspenSummary({ summary: "是否缓存" })
	keepAlive: boolean

	@Column({ type: "int", default: 0, comment: "排序" })
	@AspenSummary({ summary: "排序" })
	sort: number
}

/*
 * ---------------------------------------------------------------
 * ## 菜单-新增
 * ---------------------------------------------------------------
 */
export class SysMenuSaveDto {
	@AspenSummary({ summary: "菜单id", rule: AspenRule() })
	menuId: number

	@AspenSummary({ summary: "菜单父id", rule: AspenRule() })
	parentId: number

	@AspenSummary({ summary: "菜单名", rule: AspenRule().isNotEmpty() })
	menuName: string

	@AspenSummary({ summary: "菜单类型", rule: AspenRule().isNotEmpty() })
	type: string

	@AspenSummary({ summary: "菜单位置", rule: AspenRule() })
	position: string

	@AspenSummary({ summary: "图标", rule: AspenRule().isNotEmpty() })
	icon: string

	@AspenSummary({ summary: "路由地址", rule: AspenRule() })
	path: string

	@AspenSummary({ summary: "是否显示", rule: AspenRule() })
	visible: boolean

	@AspenSummary({ summary: "是否缓存", rule: AspenRule() })
	keepAlive: boolean

	@AspenSummary({ summary: "排序", rule: AspenRule() })
	sort: number

	toEntity() {
		if (this.type == sysMenuTypeEnum.CATALOGUE.code) {
			return this.toCatalogueEntity()
		}
		return this.toMenuEntity()
	}

	// 转换到菜单实体
	toMenuEntity() {
		const obj = plainToInstance(SysMenuEntity, this)
		if (_.isEmpty(obj.sort)) obj.sort = 0
		return obj
	}

	// 转换到目录实体
	toCatalogueEntity() {
		const obj = plainToInstance(SysMenuEntity, this)
		if (_.isEmpty(obj.sort)) obj.sort = 0
		obj.position = null
		obj.path = null
		obj.keepAlive = false
		return obj
	}
}
