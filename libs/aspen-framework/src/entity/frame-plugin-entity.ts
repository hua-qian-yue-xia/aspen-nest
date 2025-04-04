import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

import { BaseRecordDb } from "@aspen/aspen-core"

import { FramePluginTagEntity } from "./index"

@Entity({ comment: "插件" })
export class FramePluginEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "插件id" })
	id: string

	@Column({ type: "varchar", length: 32, comment: "插件名称" })
	name: string

	@Column({ type: "varchar", length: 32, comment: "插件作者" })
	author: string

	@Column({ type: "varchar", length: 16, comment: "插件版本" })
	version: string

	@Column({ type: "varchar", length: 256, comment: "插件描述" })
	desc: string

	@Column({ type: "bit", length: 1, comment: "是否启用" })
	enable: boolean

	@OneToMany(() => FramePluginTagEntity, (tag) => tag.plugin)
	tagList: FramePluginTagEntity[]
}
