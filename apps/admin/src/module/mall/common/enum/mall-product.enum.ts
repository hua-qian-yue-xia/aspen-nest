export enum MallProductType {
	PHYSICAL = "PHYSICAL", // 普通实物
	VIRTUAL = "VIRTUAL", // 虚拟商品(卡券/码)
	FOOD_DELIVERY = "FOOD_DELIVERY", // 外卖/餐饮
	SERVICE = "SERVICE", // 服务类(安装/维修)
}

export enum MallProductStatus {
	DRAFT = "DRAFT", // 草稿
	ENABLED = "ENABLED", // 可用/上架
	DISABLED = "DISABLED", // 不可用/下架
	ARCHIVED = "ARCHIVED", // 归档
}

export enum MallProductSource {
	OWN = "OWN", // 自有商品
	THIRD_PARTY = "THIRD_PARTY", // 第三方商品
}
