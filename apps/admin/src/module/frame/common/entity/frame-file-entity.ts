import { Brackets, Repository } from "typeorm"
import { plainToInstance } from "class-transformer"
import * as _ from "radash"

import { FrameFileEntity } from "@aspen/aspen-framework"
import { AspenRule, AspenSummary } from "@aspen/aspen-core"

/*
 * ---------------------------------------------------------------
 * ## 文件内容存储
 * ---------------------------------------------------------------
 */
export { FrameFileEntity }

/*
 * ---------------------------------------------------------------
 * ## 文件内容存储-新增
 * ---------------------------------------------------------------
 */
export class FrameFileSaveDto {
	@AspenSummary({ summary: "文件id" })
	fileId?: string

	@AspenSummary({ summary: "父文件id" })
	parentFileId: string

	@AspenSummary({ summary: "文件名" })
	fileName: string

	@AspenSummary({ summary: "文件路径" })
	filePath: string

	@AspenSummary({ summary: "文件完整路径" })
	fileFullPath: string

	@AspenSummary({ summary: "文件类型" })
	fileType: string

	toEntity() {
		const obj = plainToInstance(FrameFileEntity, this)
		if (_.isEmpty(obj.fileId)) obj.fileId = undefined
		return obj
	}
}

/*
 * ---------------------------------------------------------------
 * ## 文件内容存储-查询
 * ---------------------------------------------------------------
 */

export class FrameFileQueryDto {
	@AspenSummary({ summary: "文件名/文件路径/文件完整路径", rule: AspenRule() })
	quick?: string

	@AspenSummary({ summary: "文件类型", rule: AspenRule() })
	fileType?: string

	createQueryBuilder(repo: Repository<FrameFileEntity>) {
		const query = repo.createQueryBuilder("a")
		if (!_.isEmpty(this.quick)) {
			query.where(
				new Brackets((qb) => {
					qb.andWhere("a.file_name LIKE :fileName", { fileName: `%${this.quick}%` })
					qb.andWhere("a.file_path LIKE :filePath", { filePath: `%${this.quick}%` })
					qb.andWhere("a.file_full_path LIKE :fileFullPath", { fileFullPath: `%${this.quick}%` })
				}),
			)
		}
		if (!_.isEmpty(this.fileType)) {
			query.andWhere("a.file_type = :fileType", { fileType: this.fileType })
		}
		query.orderBy("a.create_at", "DESC").addOrderBy("a.file_type", "DESC").addOrderBy("a.file_id", "DESC")
		return query
	}
}
