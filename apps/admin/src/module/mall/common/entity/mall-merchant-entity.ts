import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"

import { BaseRecordDb, LocationColumn } from "@aspen/aspen-core"
import { enums } from "@aspen/aspen-framework"

const { comBoolEnum } = enums

Entity({ comment: "商户/店铺", name: "mall_merchant" })
export class MallMerchantEntity extends BaseRecordDb {
	@PrimaryGeneratedColumn("uuid", { comment: "主键ID" })
	id: string

	@Column({ type: "varchar", length: 64, comment: "商户编码(内部)" })
	code: string

	@Column({ type: "varchar", length: 256, comment: "商户名称" })
	name: string

	@Column({ type: "char", length: 32, comment: "商户类型(实体商家/自提点/第三方)" })
	type: string

	@Column({ type: "varchar", length: 64, nullable: true, comment: "第三方平台(如 JD/MT/ELM/TB)" })
	externalSource?: string

	@Column({ type: "varchar", length: 128, nullable: true, comment: "第三方商户唯一ID" })
	externalMerchantId?: string

	@Column((type) => LocationColumn)
	address?: LocationColumn

	@Column({ type: "json", nullable: true, comment: "联系电话" })
	contactPhone?: Array<ContactPhone>

	@Column({ type: "json", nullable: true, comment: "营业时间" })
	openTime?: Array<OpenTime>

	@Column({
		type: "enum",
		enum: comBoolEnum.getKeys(),
		default: comBoolEnum.YES.code,
		comment: "是否启用",
	})
	enable: typeof comBoolEnum

	@Column({ type: "int", default: 0, comment: "排序" })
	sort: number
}

/**
 * 营业时间
 */
export class OpenTime {
	/**
	 * 描述
	 * @example "周一至周五"
	 */
	summary?: string

	/**
	 * 开始时间
	 * @example "09:00"
	 */
	startTime?: string

	/**
	 * 结束时间
	 * @example "18:00"
	 */
	endTime?: string
}

/**
 * 联系电话
 */
export class ContactPhone {
	/**
	 * 昵称
	 * @example "客服A"
	 */
	nickname?: string
	/**
	 * 手机号
	 * @example "13800000000"
	 */
	phone?: string
}
