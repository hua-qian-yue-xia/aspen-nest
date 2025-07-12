import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { AppClsModule, readActiveYamlFile, registerRedis, registerDatabase, AspenCoreModule } from "@aspen/aspen-core"

import { SysModule } from "apps/admin/src/module/sys/sys-module"
import { CoreModule } from "apps/admin/src/module/core/core-module"

@Module({
	imports: [
		ConfigModule.forRoot({ load: [readActiveYamlFile.bind(this, __dirname)], isGlobal: true, cache: true }),
		registerRedis(),
		registerDatabase(),
		AspenCoreModule,
		AppClsModule,
		SysModule,
		CoreModule,
	],
	providers: [],
	controllers: [],
})
export class AppModule {}
