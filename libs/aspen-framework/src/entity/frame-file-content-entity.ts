import { AspenSummary, BaseRecordDb } from "@aspen/aspen-core"
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"

/**
 * 文件内容存储
 */
@Entity({ name: "frame_file_content", comment: "文件内容存储" })
export class FrameFileContentEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "文件内容id" })
	@AspenSummary({ summary: "文件内容id" })
	fileContentId: string

	@Index()
	@Column({ type: "varchar", length: 256, comment: "文件路径" })
	@AspenSummary({ summary: "文件路径" })
	filePath: string

	@Column({ type: "mediumblob", comment: "文件内容" })
	@AspenSummary({ summary: "文件内容" })
	content: Buffer
}
