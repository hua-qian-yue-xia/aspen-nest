import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { BaseDb } from "@aspen/aspen-core"

import { MallSkuEntity } from "./mall-sku-entity"
import { MallSpuEntity } from "./mall-spu-entity"

@Entity({ comment: "SKU 规格", name: "mall_sku_spec" })
export class MallSkuSpecEntity extends BaseDb {
	@PrimaryGeneratedColumn("uuid", { comment: "主键ID" })
	id: string

	@ManyToOne(() => MallSpuEntity)
	@JoinColumn({ name: "spu_id", referencedColumnName: "id" })
	spu?: MallSpuEntity

	@ManyToOne(() => MallSkuEntity)
	@JoinColumn({ name: "sku_id", referencedColumnName: "id" })
	sku?: MallSkuEntity

	@Column({ type: "varchar", length: 64, comment: "规格名" })
	name: string

	@Column({ type: "varchar", length: 64, comment: "规格值" })
	value: string

	@Column({ type: "int", default: 0, comment: "排序" })
	sort: number
}
