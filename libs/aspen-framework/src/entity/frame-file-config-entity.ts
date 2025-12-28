import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm"

import { AspenSummary, BaseRecordDb } from "@aspen/aspen-core"
import { comEnableEnum } from "../enum/com-enable.enum-gen"
import { FrameFileEntity } from "./frame-file-entity"

/**
 * 文件配置管理表
 */
@Entity({ name: "frame_file_config", comment: "文件配置管理" })
export class FrameFileConfigEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "文件配置id" })
	@AspenSummary({ summary: "文件配置id" })
	configId: string

	@Column({ type: "varchar", length: 100, comment: "文件配置名称" })
	@AspenSummary({ summary: "文件配置名称" })
	name: string

	@Index({ unique: true })
	@Column({ type: "varchar", length: 100, comment: "存储类型" })
	@AspenSummary({ summary: "存储类型" })
	type: string

	@Column({ type: "json", comment: "文件配置", nullable: true })
	@AspenSummary({ summary: "文件配置" })
	config: Record<string, any>

	@Column({
		type: "enum",
		enum: comEnableEnum.getCodes(),
		default: comEnableEnum.YES.code,
		comment: "是否启用",
	})
	@AspenSummary({ summary: "是否启用" })
	enable: string

	@Column({ type: "varchar", length: 500, comment: "文件配置描述", nullable: true })
	@AspenSummary({ summary: "文件配置描述" })
	description: string

	@OneToMany(() => FrameFileEntity, (file) => file.config)
	fileList: Array<FrameFileEntity>
}

/**
 * s3文件配置管理表
 */
export class FrameFileS3ConfigEntity {
	@AspenSummary({ summary: "endpoint" })
	endpoint: string

	@AspenSummary({ summary: "domain" })
	domain: string

	@AspenSummary({ summary: "存储bucket" })
	bucket: string

	@AspenSummary({ summary: "访问key" })
	accessKey: string

	@AspenSummary({ summary: "访问secret" })
	accessSecret: string
}
