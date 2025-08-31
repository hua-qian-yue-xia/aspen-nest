import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { readActiveYamlFile, coreModule } from "@aspen/aspen-core"
import { frameworkModule } from "@aspen/aspen-framework"

import { SysModule } from "apps/admin/src/module/sys/sys-module"
import { CoreModule } from "apps/admin/src/module/core/core-module"

@Module({
	imports: [
		ConfigModule.forRoot({ load: [readActiveYamlFile.bind(this, __dirname)], isGlobal: true, cache: true }),
		coreModule.database.forRoot({ isGlobal: true, entityPattern: `${process.cwd()}/dist/**/*-entity{.ts,.js}` }),
		coreModule.redisCache.forRoot({ isGlobal: true }),
		coreModule.log.forRoot({ isGlobal: true }),
		coreModule.noToken.forRoot({ isGlobal: true }),
		coreModule.appCls.forRoot({ isGlobal: true }),
		frameworkModule.genDict.forRoot({ isGlobal: true, scanPatterns: ["**/dist/**/*.enum-gen.js"] }),
		frameworkModule.jwtStrategy.forRoot(),
		SysModule,
		CoreModule,
	],
	providers: [],
	controllers: [],
})
export class AppModule {}
