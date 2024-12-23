import { applyDecorators } from "@nestjs/common"

import { ReqMethod, ReqMethodMap } from "packages/aspen-core/src/constant/decorator-constant"
import { AspenLog, LogOption } from "packages/aspen-core/src/decorator/log-decorator"
import { AspenRateLimit, RateLimitOption } from "packages/aspen-core/src/decorator/repeat-submit-decorator"

/******************** start type start ********************/

type CreateReqOptions = {
	/**
	 * 接口作用描述
	 */
	summary: string
	/**
	 * 接口作用详细描述
	 */
	description?: string
	/**
	 * 接口路由地址
	 */
	router: string
	/**
	 * 接口类型
	 */
	method: ReqMethod
	/**
	 * 日志配置信息
	 */
	log?: Omit<LogOption, "summary">
	/**
	 * 限流配置信息
	 */
	rateLimit?: RateLimitOption
}

export type MethodReqOptions = Omit<CreateReqOptions, "method">

/******************** end type end ********************/

function createReqDecorators(options: CreateReqOptions) {
	const { summary, router, method, log, rateLimit } = options
	const decorators = [ReqMethodMap[method](router)]
	if (log) {
		const logOptions: LogOption = {
			summary,
			...log,
		}
		decorators.push(AspenLog(logOptions))
	}
	if (rateLimit) {
		decorators.push(AspenRateLimit(rateLimit))
	}
	return applyDecorators(...decorators)
}

export const AspenGet = (options: MethodReqOptions) => {
	return createReqDecorators({ ...options, method: ReqMethod.Get })
}

export const AspenPost = (options: MethodReqOptions) => {
	return createReqDecorators({ ...options, method: ReqMethod.Post })
}

export const AspenPut = (options: MethodReqOptions) => {
	return createReqDecorators({ ...options, method: ReqMethod.Put })
}

export const AspenDelete = (options: MethodReqOptions) => {
	return createReqDecorators({ ...options, method: ReqMethod.Delete })
}

export const AspenPatch = (options: MethodReqOptions) => {
	return createReqDecorators({ ...options, method: ReqMethod.Patch })
}
