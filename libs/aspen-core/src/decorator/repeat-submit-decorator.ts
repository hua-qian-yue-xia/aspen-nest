import { SetMetadata } from "@nestjs/common"

import { HttpLimitEnum } from "libs/aspen-core/src/constant/http-constant"
import { DecoratorKey } from "libs/aspen-core/src/constant/decorator-constant"

/******************** start type start ********************/

export type RateLimitOption = {
	/**
	 * 限流时间,单位秒
	 * @default 60
	 */
	time?: number
	/**
	 * 限流次数
	 * @default 100
	 */
	count?: number
	/**
	 * 限流类型
	 * @see HttpLimitEnum
	 * @default DEFAULT
	 */
	limitType?: HttpLimitEnum
}

/******************** end type end ********************/

const defaultRateLimitOption: RateLimitOption = {
	time: 60,
	count: 100,
	limitType: HttpLimitEnum.DEFAULT,
}

export const AspenRateLimit = (option?: RateLimitOption) => {
	return SetMetadata(DecoratorKey.RateLimit, {
		...defaultRateLimitOption,
		...option,
	})
}
