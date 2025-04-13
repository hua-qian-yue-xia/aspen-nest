import {
	BadGatewayException,
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
	SetMetadata,
} from "@nestjs/common"
import { FastifyRequest, FastifyReply } from "fastify"
import { Reflector } from "@nestjs/core"
import { catchError, finalize, Observable, tap, throwError } from "rxjs"
import { DataSource } from "typeorm"

import * as _ from "radash"

import { DecoratorKey, ReqTag, CoreLogEntity } from "@aspen/aspen-core"

/******************** start type start ********************/

export type LogOption = {
	/**
	 * 定义该接口的摘要信息
	 */
	summary: string
	/**
	 * 接口tag
	 * @see ReqTag
	 */
	tag: ReqTag
	/**
	 * 是否保存请求的参数
	 * @define true
	 */
	isSaveRequestData?: boolean
	/**
	 * 是否保存响应的参数
	 * @define true
	 */
	isSaveResponseData?: boolean
}

/******************** end type end ********************/

export const AspenLog = (option: LogOption) =>
	SetMetadata(DecoratorKey.Log, { ...option, isSaveRequestData: true, isSaveResponseData: true })

@Injectable()
export class AspenLogInterceptor implements NestInterceptor {
	constructor(
		private readonly dataSource: DataSource,
		private readonly reflector: Reflector,
	) {}

	intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const logOption = this.reflector.get<LogOption>(DecoratorKey.Log, ctx.getHandler())
		if (_.isEmpty(logOption)) return next.handle()
		// 开始处理日志拦截器
		const now = Date.now()
		const coreLog = new CoreLogEntity()
		const { summary, tag, isSaveRequestData, isSaveResponseData } = logOption
		const request = ctx.switchToHttp().getRequest<FastifyRequest>()
		const { method, url, headers, params, body, ip } = request
		coreLog.tag = tag
		coreLog.summary = summary
		coreLog.ip = ip
		coreLog.uri = url
		coreLog.uriMethod = method
		coreLog.userAgent = headers["user-agent"]
		if (isSaveRequestData) {
			coreLog.reqParams = JSON.stringify(params)?.substring(0, 2000)
			coreLog.reqBody = JSON.stringify(body)?.substring(0, 2000)
		}
		return next.handle().pipe(
			tap((res) => {
				if (isSaveResponseData) {
					coreLog.resBody = JSON.stringify(res)?.substring(0, 2000)
				}
				return res
			}),
			catchError((error) => {
				coreLog.errorMsg = error.message
				coreLog.errorSatck = JSON.stringify(error.stack)?.substring(0, 2000)
				return throwError(() => new BadGatewayException())
			}),
			finalize(async () => {
				const { statusCode } = ctx.switchToHttp().getResponse<FastifyReply>()
				coreLog.cost = Date.now() - now
				coreLog.httpCode = statusCode
				await this.dataSource.getRepository(CoreLogEntity).save(coreLog)
			}),
		)
	}
}
