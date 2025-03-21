import { BaseEntity, Column } from "typeorm"

export class BaseDb extends BaseEntity {}

export class BaseRecordDb extends BaseDb {
	/**
	 * 新增人
	 */
	@Column({ type: "varchar", length: 64 })
	saveBy: string
	/**
	 * 新增时间
	 */
	@Column({ type: "datetime" })
	saveTime: Date
	/**
	 * 修改人
	 */
	@Column({ type: "varchar", length: 64 })
	editBy: string
	/**
	 * 修改时间
	 */
	@Column({ type: "datetime" })
	editTime: Date
	/**
	 * 删除人
	 */
	@Column({ type: "varchar", length: 64 })
	delBy: string
	/**
	 * 删除时间
	 */
	@Column({ type: "datetime" })
	delTime: Date
}
