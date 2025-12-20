import { BaseDb } from "@aspen/aspen-core"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "mall_statistics", comment: "商品统计" })
export class MallStatisticsEntity extends BaseDb {
	@PrimaryGeneratedColumn("uuid", { comment: "主键ID" })
	id: string

	@Column({ type: "date", comment: "统计时间" })
	time: Date

	@Column({ type: "uuid", comment: "商品ID" })
	spuId: string

	@Column({ type: "int", default: 0, comment: "商品浏览量" })
	browseCount: number

	@Column({ type: "int", default: 0, comment: "商品浏览用户量" })
	browseUserCount: number

	@Column({ type: "int", default: 0, comment: "商品收藏量" })
	favoriteCount: number

	@Column({ type: "int", default: 0, comment: "商品加入购物车量" })
	cartCount: number

	@Column({ type: "int", default: 0, comment: "商品订单量" })
	orderCount: number

	@Column({ type: "int", default: 0, comment: "商品订单支付量" })
	orderPayCount: number

	@Column({ type: "decimal", default: 0, comment: "商品订单支付金额" })
	orderPayPrice: number

	@Column({ type: "int", default: 0, comment: "商品售后量" })
	afterSaleCount: number

	@Column({ type: "decimal", default: 0, comment: "商品售后退款金额" })
	afterSaleRefundPrice: number

	@Column({ type: "decimal", default: 0, comment: "商品浏览转化率" })
	browseConvertPercent: number
}
