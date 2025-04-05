import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { BaseRecordDb } from "@aspen/aspen-core"

import { FramePluginEntity } from "./index"

@Entity({ comment: "插件 tag" })
export class FramePluginTagEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "插件tag id" })
	id: string

	@Column({ type: "varchar", length: 32, comment: "插件名称" })
	name: string

	@ManyToOne(() => FramePluginEntity, (plugin) => plugin.tagList)
	@JoinTable({ name: "pluginId" })
	plugin: FramePluginEntity
}
