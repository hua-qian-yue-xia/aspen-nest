import { ValueTransformer } from "typeorm"

import { BaseEnum } from "../../base/base-enum"

export const enumTransformer = <T extends BaseEnum>(enumObj: T): ValueTransformer => ({
	from: (value: string) => {
		const targetEnum = enumObj.getByCode(value)
		console.log("enumTransformer-targetEnum:", targetEnum)
		if (!targetEnum) return null
		return targetEnum.code
	},
	to: (value: T) => {
		console.log("enumTransformer-value:", value)
		if (value instanceof BaseEnum) {
			return value.code
		}
		return value
	},
})
