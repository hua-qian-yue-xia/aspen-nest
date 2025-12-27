import { Module } from "@nestjs/common"

import { coreModule } from "@aspen/aspen-core"
import { frameworkModule } from "@aspen/aspen-framework"

import { SysModule } from "apps/admin/src/module/sys/sys-module"
import { FrameworkModule } from "apps/admin/src/module/framework/framework-module"
import { CoreApiModule } from "apps/admin/src/module/core/core-api-module"

@Module({
	imports: [
		frameworkModule.genDict.forRoot({ isGlobal: true, scanPatterns: ["**/dist/**/*.enum-gen.js"] }),
		frameworkModule.service.forRoot(),
		coreModule.authJwt.forRoot(),
		SysModule,
		FrameworkModule,
		CoreApiModule,
	],
	providers: [],
	controllers: [],
})
export class AppModule {}
