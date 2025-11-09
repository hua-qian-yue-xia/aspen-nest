import { Type } from "@nestjs/common"

import { BaseEntity } from "typeorm/repository/BaseEntity"

import { SysUserEntity } from "../../common/entity/sys-user-entity"

type ConditionKeys = "eq" | "ne" | "like" | "in" | "notIn"
// 查询令牌：操作符-字段名（不再强制绑定到实体的键，以适配自定义/别名字段）
type ConditionToken = `${ConditionKeys}-${string}`

// 单项查询配置：别名 + 实体 + 查询令牌数组（令牌使用 op-field 结构）
type QueryItem<A extends string, E extends BaseEntity, K extends ConditionToken> = {
	alias: A
	entity: Type<E>
	query: readonly K[]
}

// 从令牌中提取字段名
type ExtractField<K extends string> = K extends `${string}-${infer F}` ? F : never

// 根据列表推导返回对象类型：以 alias 为键、字段名为子键、值为原令牌字符串
type OutputOf<L extends readonly QueryItem<any, any, any>[]> = {
	[U in L[number] as U["alias"]]: U extends QueryItem<any, infer E, infer K>
		? { [P in K as ExtractField<P>]: P }
		: never
}

// 辅助构造器：不需要在调用处使用 as const，即可捕获 alias 和令牌的字面量类型
export function makeQueryItem<A extends string, E extends BaseEntity, K extends ConditionToken>(
	alias: A,
	entity: Type<E>,
	...query: K[]
): QueryItem<A, E, K> {
	return { alias, entity, query }
}

export abstract class OrmQuery {
	DataBaseQuickQuery<L extends readonly QueryItem<any, BaseEntity, any>[]>(list: L): OutputOf<L> {
		const result: Record<string, Record<string, string>> = {}
		for (const item of list) {
			const alias = item.alias
			if (!alias) continue
			if (!result[alias]) result[alias] = {}
			for (const q of item.query) {
				const token = String(q)
				const [op, field] = token.split("-", 2)
				// 仅当格式正确时记录：op-字段名
				if (op && field) {
					result[alias][field] = token
				}
			}
		}
		return result as OutputOf<L>
	}

	test1() {
		const generated = this.DataBaseQuickQuery([
			makeQueryItem("user", SysUserEntity, "eq-username"),
			makeQueryItem("dept", SysUserEntity, "eq-deptName"),
		])
		const _hint = generated.user.username
		//
		// const obj = {
		// 	user: {
		// 		name: "eq-name",
		// 	},
		// 	dept: {
		// 		name: "eq-deptName",
		// 	},
		// }
	}
}
