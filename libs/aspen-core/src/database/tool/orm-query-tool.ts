import { Type } from "@nestjs/common"
import { ApiProperty } from "@nestjs/swagger"
import { FindOptionsWhere } from "typeorm"
import * as _ from "radash"

import { BaseRecordDb } from "@aspen/aspen-core"

interface DataBaseQueryOptions<T extends BaseRecordDb> {
	eq?: Partial<T>
	like?: Partial<T>
}

/**
 * 生成查询条件的swagger文档
 */
export function DataBaseQuery<T extends BaseRecordDb>(classRef: Type<T>, options: DataBaseQueryOptions<T>) {
	abstract class DataBaseQueryClass {
		constructor() {}
	}
	if (_.isEmpty(options)) return DataBaseQueryClass
	const { eq, like } = options
	// swagger
	const fields = Reflect.getMetadata("swagger/apiModelPropertiesArray", classRef.prototype).map((key: string) =>
		key.slice(1),
	)
	fields.forEach((key: any) => {
		const metadata = Reflect.getMetadata("swagger/apiModelProperties", classRef.prototype, key)
		const decoratorFactory = ApiProperty({ ...metadata, required: false })
		decoratorFactory(DataBaseQueryClass.prototype, key)
	})
	if (!_.isEmpty(eq)) {
		Object.keys(eq).forEach((key: any) => {
			console.log(`eq:${key}`)
		})
	}
	if (!_.isEmpty(like)) {
		Object.keys(like).forEach((key: any) => {
			console.log(`like:${key}`)
		})
	}
	return DataBaseQueryClass
}

export function genFindWhere<T extends BaseRecordDb>(where: DataBaseQueryOptions<T>): FindOptionsWhere<T> {
	const findWhere: FindOptionsWhere<T> = {}
	if (_.isEmpty(where)) return findWhere
	const { eq } = where
	if (!_.isEmpty(eq)) {
		console.log("eq", eq)
	}
	return findWhere
}
