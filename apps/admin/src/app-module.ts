import { Module } from "@nestjs/common"

import { coreModule } from "@aspen/aspen-core"
import { frameworkModule } from "@aspen/aspen-framework"

import { SysModule } from "apps/admin/src/module/sys/sys-module"
import { FrameModule } from "apps/admin/src/module/frame/frame-module"
import { CoreApiModule } from "apps/admin/src/module/core/core-api-module"

@Module({
	imports: [
		frameworkModule.genDict.forRoot({ isGlobal: true, scanPatterns: ["**/{libs,admin}/**/*.enum-gen.{js,ts}"] }),
		frameworkModule.service.forRoot(),
		coreModule.authJwt.forRoot(),
		SysModule,
		FrameModule,
		CoreApiModule,
	],
	providers: [],
	controllers: [],
})
export class AppModule {}
