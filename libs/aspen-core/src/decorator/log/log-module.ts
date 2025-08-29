import { APP_INTERCEPTOR } from "@nestjs/core"
import { Global, Module } from "@nestjs/common"

import { AspenLogInterceptor } from "./log-decorator"

export type LogModuleOptions = {
	/**
	 * 是否全局模块
	 * @default true
	 */
	isGlobal?: boolean
}

@Global()
@Module({})
export class LogModule {
	static forRoot(options: LogModuleOptions) {
		return {
			module: LogModule,
			global: options.isGlobal ?? true,
			providers: [
				AspenLogInterceptor,
				{
					provide: APP_INTERCEPTOR,
					useClass: AspenLogInterceptor,
				},
			],
			exports: [AspenLogInterceptor],
		}
	}
}
