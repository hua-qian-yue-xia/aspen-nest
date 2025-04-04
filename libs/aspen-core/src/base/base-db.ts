import { BaseEntity, Column } from "typeorm"

export class BaseDb extends BaseEntity {}

export class BaseRecordDb extends BaseDb {
	@Column({ type: "varchar", length: 64, comment: "新增人" })
	saveBy: string

	@Column({ type: "datetime", comment: "新增时间" })
	saveTime: Date

	@Column({ type: "varchar", length: 64, comment: "修改人" })
	editBy: string

	@Column({ type: "datetime", comment: "修改时间" })
	editTime: Date

	@Column({ type: "varchar", length: 64, comment: "删除人" })
	delBy: string

	@Column({ type: "datetime", comment: "删除时间" })
	delTime: Date
}
