import { Type } from "@nestjs/common"
import { ApiProperty } from "@nestjs/swagger"

import { Expose } from "class-transformer"
import { IsOptional } from "class-validator"

import { BaseEntity, FindOptionsWhere } from "typeorm"
import * as _ from "radash"

import {
	ConditionObj,
	ConditionKeys,
	CONDITION_LIST,
	API_MODEL_PROPERTIES_ARRAY,
	API_MODEL_PROPERTIES,
} from "./orm-query-tool-share"

// 支持 {eq-name} {ne-user} 这样的动态键名结构
type DynamicQueryCondition<T extends BaseEntity> = {
	[K in `${ConditionKeys}-${string & keyof T}`]?: any
}

// 根据查询条件数组生成对应的类型
type QueryConditionType<T extends BaseEntity, K extends keyof DynamicQueryCondition<T>> = {
	[P in K]?: any
}

export abstract class OrmQuery {
	static DataBaseQuery<T extends BaseEntity, KEY extends keyof DynamicQueryCondition<T>>(
		classRef: Type<T>,
		query: Array<KEY>,
	): Type<QueryConditionType<T, KEY>> {
		if (_.isEmpty(query) || !query.length) {
			return class {} as any
		}

		// 收集所有的entity查询条件
		const conditionList: Array<ConditionObj> = []
		for (const queryKey of query) {
			const [operator, field] = (queryKey as string).split("-")
			const condition = CONDITION_LIST.find((item) => item.key === operator)
			if (condition) {
				conditionList.push({
					field: queryKey as string,
					type: operator as ConditionKeys,
					key: field,
					valueType: "string",
					valueDefault: null,
					valueDescription: `${condition.desc}-${field}`,
				})
			}
		}

		// 获取所有swagger的元数据
		const swaggerProperties = Reflect.getMetadata(API_MODEL_PROPERTIES_ARRAY, classRef.prototype) || []
		for (const i of swaggerProperties) {
			if (_.isString(i) && i.charAt(0) === ":") {
				const key = i.slice(1)
				const metadata = Reflect.getMetadata(API_MODEL_PROPERTIES, classRef.prototype, key)
				if (!metadata) continue
				for (const j of conditionList) {
					if (j.key === key) {
						j.valueType = metadata.type?.name || "string"
						j.valueDescription += metadata.description || ""
					}
				}
			}
		}

		class DataBaseQueryClass {
			constructor() {
				// 初始化查询条件属性
				for (const condition of conditionList) {
					this[condition.field] = condition.valueDefault
				}
			}
		}

		// 生成swagger文档和验证装饰器
		for (const condition of conditionList) {
			// Swagger 文档装饰器
			const apiPropertyDecorator = ApiProperty({
				type: condition.valueType as any,
				required: false,
				description: condition.valueDescription,
				default: condition.valueDefault,
			})
			apiPropertyDecorator(DataBaseQueryClass.prototype, condition.field)

			// class-transformer 装饰器
			const exposeDecorator = Expose()
			exposeDecorator(DataBaseQueryClass.prototype, condition.field)

			// class-validator 装饰器
			const isOptionalDecorator = IsOptional()
			isOptionalDecorator(DataBaseQueryClass.prototype, condition.field)
		}

		return DataBaseQueryClass as unknown as Type<QueryConditionType<T, KEY>>
	}

	static getWhereOptions<T>(target: any): FindOptionsWhere<T> {
		if (!target) return
		const where: FindOptionsWhere<T> = {}
		for (const i of CONDITION_LIST) {
			for (const key in target) {
				const [operator, field] = (key as string).split("-")
				if (i.key === operator && target[key] != undefined) {
					where[field] = i.fn(target[key])
				}
			}
		}
		return where
	}
}
