import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { coreModule } from "@aspen/aspen-core"
import { frameworkModule } from "@aspen/aspen-framework"

import { SysModule } from "apps/admin/src/module/sys/sys-module"
import { FrameworkModule } from "apps/admin/src/module/framework/framework-module"
import { CoreModule } from "apps/admin/src/module/core/core-module"

@Module({
	imports: [
		frameworkModule.genDict.forRoot({ isGlobal: true, scanPatterns: ["**/dist/**/*.enum-gen.js"] }),
		frameworkModule.jwtStrategy.forRoot(),
		SysModule,
		FrameworkModule,
		CoreModule,
	],
	providers: [],
	controllers: [],
})
export class AppModule {}
