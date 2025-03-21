import { Module } from "@nestjs/common"
import { FastifyRequest } from "fastify"

import { ClsModule } from "nestjs-cls"

import { BasePageTool } from "packages/aspen-core/src/base/base-page"

@Module({
	imports: [
		ClsModule.forRoot({
			global: true,
			middleware: {
				mount: true,
				setup: (cls, req: FastifyRequest) => {
					cls.set("page", BasePageTool.getPageByReq(req))
					cls.set("token", "1111")
				},
			},
		}),
	],
})
export class AppClsModule {}
