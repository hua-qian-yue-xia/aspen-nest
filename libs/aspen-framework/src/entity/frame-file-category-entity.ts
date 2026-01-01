import { AspenSummary, BaseRecordDb } from "@aspen/aspen-core"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

/**
 * 文件分类
 */
@Entity({ name: "frame_file_category", comment: "文件分类管理" })
export class FrameFileCategoryEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "文件分类id" })
	@AspenSummary({ summary: "文件分类id" })
	categoryId: string

	@Column({ type: "varbinary", length: 64, comment: "文件分类名称" })
	@AspenSummary({ summary: "文件分类名称" })
	categoryName: string

	@Column({ type: "int", comment: "排序", default: 0 })
	@AspenSummary({ summary: "排序" })
	sort: number
}
