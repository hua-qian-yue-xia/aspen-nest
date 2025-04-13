import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

import { BaseRecordDb } from "@aspen/aspen-core"

@Entity({ comment: "api", name: "core_api" })
export class CoreApiEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn({ type: "bigint", comment: "api id" })
	apiId: number

	@Column({ type: "varchar", length: 64, comment: "接口作用描述" })
	summary: string

	@Column({ type: "varchar", length: 256, nullable: true, comment: "接口作用详细描述" })
	description: string

	@Column({ type: "varchar", length: 128, comment: "请求uri" })
	uri: string

	@Column({ type: "varchar", length: 16, comment: "请求方法" })
	uriMethod: string

	@Column({ type: "bit", default: true, comment: "是否需要鉴权" })
	isAuth: boolean
}
