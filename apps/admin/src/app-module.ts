import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { readActiveYamlFile, module } from "@aspen/aspen-core"

import { SysModule } from "apps/admin/src/module/sys/sys-module"
import { CoreModule } from "apps/admin/src/module/core/core-module"

@Module({
	imports: [
		ConfigModule.forRoot({ load: [readActiveYamlFile.bind(this, __dirname)], isGlobal: true, cache: true }),
		module.database.forRoot({ isGlobal: true, entityPattern: `${process.cwd()}/dist/**/*-entity{.ts,.js}` }),
		module.redisCache.forRoot({ isGlobal: true }),
		module.log.forRoot({ isGlobal: true }),
		module.noToken.forRoot({ isGlobal: true }),
		module.appCls.forRoot({ isGlobal: true }),
		SysModule,
		CoreModule,
	],
	providers: [],
	controllers: [],
})
export class AppModule {}
