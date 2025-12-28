import { AspenSummary, BaseRecordDb } from "@aspen/aspen-core"
import { Column, Entity, Index, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { FrameFileConfigEntity } from "./frame-file-config-entity"

/**
 * 文件配置管理表
 */
@Entity({ name: "frame_file", comment: "文件配置管理" })
export class FrameFileEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "文件id" })
	@AspenSummary({ summary: "文件id" })
	fileId: string

	@ManyToOne(() => FrameFileConfigEntity)
	@JoinTable({ name: "config_id" })
	config: FrameFileConfigEntity

	@Column({ type: "varchar", length: 64, comment: "文件名" })
	@AspenSummary({ summary: "文件名" })
	fileName: string

	@Index()
	@Column({ type: "varchar", length: 256, comment: "文件路径" })
	@AspenSummary({ summary: "文件路径" })
	filePath: string

	@Column({ type: "varchar", length: 512, comment: "文件完整路径" })
	@AspenSummary({ summary: "文件完整路径" })
	fileFullPath: string

	@Index()
	@Column({ type: "varchar", length: 64, comment: "文件类型" })
	@AspenSummary({ summary: "文件类型" })
	fileType: string

	@Column({ type: "int", comment: "文件大小(k)" })
	@AspenSummary({ summary: "文件大小(k)" })
	fileSize: number
}
