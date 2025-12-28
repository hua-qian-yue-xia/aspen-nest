import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"

import { AspenSummary, BaseRecordDb } from "@aspen/aspen-core"

import { comEnableEnum } from "../enum/com-enable.enum-gen"

/**
 * 插件管理表
 */
@Entity({ name: "frame_plugin", comment: "插件管理" })
export class FramePluginEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "插件id" })
	@AspenSummary({ summary: "插件id" })
	pluginId: string

	@Column({ type: "varchar", length: 100, comment: "插件名称" })
	@AspenSummary({ summary: "插件名称" })
	pluginName: string

	@Index({ unique: true })
	@Column({ type: "varchar", length: 100, comment: "插件编码" })
	@AspenSummary({ summary: "插件编码" })
	pluginCode: string

	@Column({ type: "varchar", length: 500, comment: "插件描述", nullable: true })
	@AspenSummary({ summary: "插件描述" })
	description: string

	@Column({ type: "varchar", length: 50, comment: "版本号", default: "1.0.0" })
	@AspenSummary({ summary: "版本号" })
	version: string

	@Column({ type: "varchar", length: 100, comment: "作者", nullable: true })
	@AspenSummary({ summary: "作者" })
	author: string

	@Column({ type: "varchar", length: 255, comment: "主页", nullable: true })
	@AspenSummary({ summary: "主页" })
	homepage: string

	@Column({
		type: "enum",
		enum: comEnableEnum.getCodes(),
		default: comEnableEnum.YES.code,
		comment: "是否启用",
	})
	@AspenSummary({ summary: "是否启用" })
	enable: string

	@Column({ type: "json", comment: "插件配置", nullable: true })
	@AspenSummary({ summary: "插件配置" })
	config: Record<string, any>
}
