import { Type } from "@nestjs/common"
import { ApiProperty } from "@nestjs/swagger"
import * as _ from "radash"
import { inheritPropertyInitializers, inheritTransformationMetadata } from "@nestjs/mapped-types"
import { BaseRecordDb } from "@aspen/aspen-core"

export interface DataBaseQueryOptions<T extends BaseRecordDb> {
	eq?: Partial<T>
	ne?: Partial<T>
	like?: Partial<T>
	in?: Partial<T>
	notIn?: Partial<T>
}

/**
 * 生成查询条件的swagger文档
 */
export function DataBaseQuery<T extends BaseRecordDb>(classRef: Type<T>, options: DataBaseQueryOptions<T>): Type<T> {
	abstract class DataBaseQueryClass {
		constructor() {
			inheritPropertyInitializers(this, classRef, (key: string) => {
				console.log(key, "1231231")
				return false
			})

			console.log(classRef.prototype["roldId"])
		}
	}
	inheritTransformationMetadata(classRef, DataBaseQueryClass, (key: string) => {
		console.log(key)
		return false
	})
	const queryFields: Array<{ field: string; desc: string }> = []
	if (_.isEmpty(options)) return DataBaseQueryClass as Type<T>
	// swagger 文档生成
	const fields = Reflect.getMetadata("swagger/apiModelPropertiesArray", classRef.prototype).map((key: string) =>
		key.slice(1),
	)
	fields.forEach((key: any) => {
		const metadata = Reflect.getMetadata("swagger/apiModelProperties", classRef.prototype, key)
		queryFields.push({
			field: key,
			desc: metadata.description,
		})
	})
	// keys
	const eqConditionKeys = options?.eq ? Object.keys(options.eq) : []
	const neConditionKeys = options?.ne ? Object.keys(options.ne) : []
	const likeConditionKeys = options?.like ? Object.keys(options?.like) : []
	const inConditionKeys = options?.in ? Object.keys(options.in) : []
	const notInConditionKeys = options?.notIn ? Object.keys(options.notIn) : []
	// condition
	const eqConditions: Array<{ field: string; desc: string }> = []
	const neConditions: Array<{ field: string; desc: string }> = []
	const likeConditions: Array<{ field: string; desc: string }> = []
	const inConditions: Array<{ field: string; desc: string }> = []
	const notInConditions: Array<{ field: string; desc: string }> = []
	if (queryFields.length) {
		for (let i = 0; i < queryFields.length; i++) {
			const element = queryFields[i]
			const { field } = element
			if (eqConditionKeys.includes(field)) {
				eqConditions.push(element)
			}
			if (neConditionKeys.includes(field)) {
				neConditions.push(element)
			}
			if (likeConditionKeys.includes(field)) {
				likeConditions.push(element)
			}
			if (inConditionKeys.includes(field)) {
				inConditions.push(element)
			}
			if (notInConditionKeys.includes(field)) {
				notInConditions.push(element)
			}
		}
	}
	// 生成文档
	if (eqConditions.length) {
		ApiProperty({
			description: "相等查询",
			type: "object",
			properties: getProperties(eqConditions),
		})(DataBaseQueryClass.prototype, "eq")
	}
	if (neConditions.length) {
		ApiProperty({
			description: "不等查询",
			type: "object",
			properties: getProperties(neConditions),
		})(DataBaseQueryClass.prototype, "ne")
	}
	if (likeConditions.length) {
		ApiProperty({
			description: "模糊查询",
			type: "object",
			properties: getProperties(likeConditions),
		})(DataBaseQueryClass.prototype, "like")
	}
	if (inConditions.length) {
		ApiProperty({
			description: "包含查询",
			type: "object",
			properties: getProperties(inConditions),
		})(DataBaseQueryClass.prototype, "in")
	}
	if (notInConditions.length) {
		ApiProperty({
			description: "不包含查询",
			type: "object",
			properties: getProperties(notInConditions),
		})(DataBaseQueryClass.prototype, "notIn")
	}
	// 组合 DataBaseQueryClass
	return DataBaseQueryClass as Type<T>
}

// 生成 ApiProperty 的 properties
function getProperties(conditions: Array<{ field: string; desc: string }>) {
	const obj = {}
	for (let i = 0; i < conditions.length; i++) {
		const { field, desc } = conditions[i]
		obj[field] = {
			description: desc,
			type: "string",
			example: "",
			required: false,
		}
	}
	return obj
}
