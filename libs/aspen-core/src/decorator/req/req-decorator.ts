import { applyDecorators, Controller } from "@nestjs/common"

import * as _ from "radash"

import { ReqMethod, ReqMethodMap } from "libs/aspen-core/src/constant/decorator-constant"
import { AspenLog, LogOption } from "@aspen/aspen-core/decorator/log/log-decorator"
import { AspenRateLimit, RateLimitOption } from "@aspen/aspen-core/decorator/repeat-submit/repeat-submit-decorator"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

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

type AspenControllerOptions = {
	/**
	 * 控制器作用描述
	 */
	summary: string
	/**
	 * 控制器路由path前缀
	 */
	prefix: string | string[]
}

type MethodReqOptions = Omit<CreateReqOptions, "method">

/******************** end type end ********************/

function createReqDecorators(options: CreateReqOptions) {
	const { summary, description, router, method, log, rateLimit } = options
	const decorators = [ReqMethodMap[method](router)]
	const swagger = [ApiOperation({ summary: summary, description: description })]
	decorators.push(...swagger)
	if (!_.isEmpty(log)) {
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

const AspenGet = (options: MethodReqOptions) => {
	return createReqDecorators({ ...options, method: ReqMethod.Get })
}

const AspenPost = (options: MethodReqOptions) => {
	return createReqDecorators({ ...options, method: ReqMethod.Post })
}

const AspenPut = (options: MethodReqOptions) => {
	return createReqDecorators({ ...options, method: ReqMethod.Put })
}

const AspenDelete = (options: MethodReqOptions) => {
	return createReqDecorators({ ...options, method: ReqMethod.Delete })
}

const AspenPatch = (options: MethodReqOptions) => {
	return createReqDecorators({ ...options, method: ReqMethod.Patch })
}

const AspenController = (options: AspenControllerOptions) => {
	const { summary, prefix } = options
	const decorators = [Controller(prefix), ApiTags(summary)]
	return applyDecorators(...decorators)
}

export const router = {
	controller: AspenController,
	get: AspenGet,
	post: AspenPost,
	put: AspenPut,
	delete: AspenDelete,
	patch: AspenPatch,
}
