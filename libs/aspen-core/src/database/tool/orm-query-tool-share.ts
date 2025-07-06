import { Equal, Not, Like, In } from "typeorm"

export type ConditionObj = {
	field: string
	type: ConditionKeys
	key: string
	valueType: string
	valueDefault: any
	valueDescription: string
}

export type ConditionKeys = "eq" | "ne" | "like" | "in" | "notIn"

export const CONDITION_LIST = [
	{ key: "eq", desc: "相等查询", fn: Equal },
	{ key: "ne", desc: "不等查询", fn: Not },
	{ key: "like", desc: "模糊查询", fn: Like },
	{ key: "in", desc: "包含查询", fn: In },
	{ key: "notIn", desc: "不包含查询", fn: (arg: any) => Not(In(arg)) },
]

// swagger model key
export const API_MODEL_PROPERTIES_ARRAY = "swagger/apiModelPropertiesArray"
export const API_MODEL_PROPERTIES = "swagger/apiModelProperties"

// orm query key
export const ORM_QUERY_KEY = "ormQuery/array"
