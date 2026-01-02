import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Transform } from "class-transformer"
import * as _ from "radash"

import { AspenSummary, BaseRecordDb, EnumValues } from "@aspen/aspen-core"

import { ComEnableEnum, comEnableEnum } from "../enum/com-enable.enum-gen"
import { FrameFileEntity } from "./frame-file-entity"

/**
 * 文件配置管理表
 */
@Entity({ name: "frame_file_config", comment: "文件配置管理" })
export class FrameFileConfigEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "文件配置id" })
	@AspenSummary({ summary: "文件配置id" })
	configId: string

	@Column({ type: "varchar", length: 64, comment: "文件配置名称" })
	@AspenSummary({ summary: "文件配置名称" })
	name: string

	@Index({ unique: true })
	@Column({ type: "varchar", length: 16, comment: "存储类型" })
	@AspenSummary({ summary: "存储类型" })
	uniqueCode: string

	@Index({ unique: true })
	@Column({ type: "varchar", length: 32, comment: "存储类型" })
	@AspenSummary({ summary: "存储类型" })
	type: string

	@Column({ type: "json", comment: "文件配置", nullable: true })
	@AspenSummary({ summary: "文件配置" })
	config?: Record<string, any>

	@Column({
		type: "enum",
		enum: comEnableEnum.getCodes(),
		default: comEnableEnum.NO.code,
		comment: "是否启用",
		transformer: comEnableEnum.typeOrmTransformer(),
	})
	@Transform(({ value }) => value.code)
	@AspenSummary({ summary: "是否启用" })
	default: EnumValues<ComEnableEnum>

	@Column({ type: "varchar", length: 500, comment: "文件配置描述", nullable: true })
	@AspenSummary({ summary: "文件配置描述" })
	description: string

	@OneToMany(() => FrameFileEntity, (file) => file.config)
	fileList: Array<FrameFileEntity>
}
