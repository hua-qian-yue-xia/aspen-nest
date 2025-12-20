import { BaseEnum } from "@aspen/aspen-core"
import { gen } from "@aspen/aspen-framework"

/*
 * ---------------------------------------------------------------
 * ## 商品相关
 * ---------------------------------------------------------------
 */
@gen.dict({
	key: "mall_spu_type",
	summary: "商品类型",
})
export class MallProductTypeEnum extends BaseEnum {
	readonly PHYSICAL = {
		code: "PHYSICAL",
		summary: "普通实物",
	}
	readonly VIRTUAL = {
		code: "VIRTUAL",
		summary: "虚拟商品(卡券/码)",
	}
	readonly FOOD_DELIVERY = {
		code: "FOOD_DELIVERY",
		summary: "外卖/餐饮",
	}
	readonly SERVICE = {
		code: "SERVICE",
		summary: "服务类(安装/维修)",
	}
}

export const mallProductTypeEnum = new MallProductTypeEnum()

@gen.dict({
	key: "mall_spu_status",
	summary: "商品状态",
})
export class MallProductStatusEnum extends BaseEnum {
	readonly DRAFT = {
		code: "DRAFT",
		summary: "草稿",
	}
	readonly ENABLED = {
		code: "ENABLED",
		summary: "可用/上架",
	}
	readonly DISABLED = {
		code: "DISABLED",
		summary: "不可用/下架",
	}
	readonly ARCHIVED = {
		code: "ARCHIVED",
		summary: "归档",
	}
}

export const mallProductStatusEnum = new MallProductStatusEnum()

@gen.dict({
	key: "mall_spu_source",
	summary: "商品来源",
})
export class MallProductSourceEnum extends BaseEnum {
	readonly OWN = {
		code: "OWN",
		summary: "自有商品",
	}
	readonly THIRD_PARTY = {
		code: "THIRD_PARTY",
		summary: "第三方商品",
	}
}

export const mallProductSourceEnum = new MallProductSourceEnum()

/*
 * ---------------------------------------------------------------
 * ## 店铺相关
 * ---------------------------------------------------------------
 */
@gen.dict({
	key: "mall_merchant_type",
	summary: "商户类型",
})
export class MallMerchantTypeEnum extends BaseEnum {
	readonly SELF = {
		code: "SELF",
		summary: "自营商家",
	}
	readonly PICKUP_POINT = {
		code: "PICKUP_POINT",
		summary: "自提点",
	}
	readonly THIRD_PARTY = {
		code: "THIRD_PARTY",
		summary: "第三方商家",
	}
}

export const mallMerchantTypeEnum = new MallMerchantTypeEnum()
