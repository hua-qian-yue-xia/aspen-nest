import { Global, Module } from "@nestjs/common"
import { FastifyRequest } from "fastify"

import { ClsModule } from "nestjs-cls"

import { BasePageTool } from "libs/aspen-core/src/base/base-page"

export type AppClsModuleOptions = {
	/**
	 * 是否全局模块
	 * @default true
	 */
	isGlobal?: boolean
}

@Global()
@Module({})
export class ApplicationCls {
	static forRoot(options: AppClsModuleOptions) {
		return {
			module: ApplicationCls,
			global: options.isGlobal ?? true,
			imports: [
				ClsModule.forRoot({
					global: options.isGlobal ?? true,
					middleware: {
						mount: true,
						setup: (cls, req: FastifyRequest) => {
							cls.set("page", BasePageTool.getPageByReq(req))
						},
					},
				}),
			],
		}
	}
}
