import { CallHandler, ExecutionContext, Injectable, NestInterceptor, SetMetadata } from "@nestjs/common"

import { DecoratorKey, ReqTag } from "libs/aspen-core/src/constant/decorator-constant"
import { Observable } from "rxjs"

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

export const AspenLog = (option: LogOption) => SetMetadata(DecoratorKey.Log, option)

@Injectable()
export class LogInterceptor implements NestInterceptor {
	intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		return next.handle()
	}
}
