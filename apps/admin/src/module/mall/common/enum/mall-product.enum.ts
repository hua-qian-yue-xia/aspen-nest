import { AbstractEnumGroup } from "@aspen/aspen-core"
import { gen } from "@aspen/aspen-framework"

/*
 * ---------------------------------------------------------------
 * ## 商品相关
 * ---------------------------------------------------------------
 */
@gen.dictGroup({
	key: "mall_spu",
	summary: "商品类型",
})
export class MallProductEnum extends AbstractEnumGroup {
	readonly type = this.create("type", "商品类型", {
		PHYSICAL: {
			code: "PHYSICAL",
			summary: "普通实物",
		},
		VIRTUAL: {
			code: "VIRTUAL",
			summary: "虚拟商品(卡券/码)",
		},
		FOOD_DELIVERY: {
			code: "FOOD_DELIVERY",
			summary: "外卖/餐饮",
		},
		SERVICE: {
			code: "SERVICE",
			summary: "服务类(安装/维修)",
		},
	})
	readonly status = this.create("status", "商品状态", {
		DRAFT: {
			code: "DRAFT",
			summary: "草稿",
		},
		ENABLED: {
			code: "ENABLED",
			summary: "可用/上架",
		},
		DISABLED: {
			code: "DISABLED",
			summary: "不可用/下架",
		},
		ARCHIVED: {
			code: "ARCHIVED",
			summary: "归档",
		},
	})
	readonly source = this.create("source", "商品来源", {
		OWN: {
			code: "OWN",
			summary: "自有商品",
		},
		THIRD_PARTY: {
			code: "THIRD_PARTY",
			summary: "第三方商品",
		},
	})
}

export const mallProductEnum = new MallProductEnum()

/*
 * ---------------------------------------------------------------
 * ## 店铺相关
 * ---------------------------------------------------------------
 */
@gen.dictGroup({
	key: "mall_merchant",
	summary: "商户类型",
})
export class MallMerchantEnum extends AbstractEnumGroup {
	readonly type = this.create("type", "商户类型", {
		SELF: {
			code: "SELF",
			summary: "自营商家",
		},
		PICKUP_POINT: {
			code: "PICKUP_POINT",
			summary: "自提点",
		},
		THIRD_PARTY: {
			code: "THIRD_PARTY",
			summary: "第三方商家",
		},
	})
}

export const mallMerchantEnum = new MallMerchantEnum()
