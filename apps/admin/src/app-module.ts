import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { DemoController } from "apps/admin/src/domo/demo-controller"
import { AppClsModule, AspenCoreModule, readActiveYamlFile, registerRedis, registerDatabase } from "@aspen/aspen-core"

import { TestInjectable } from "apps/admin/src/domo/test"
import { SysModule } from "apps/admin/src/module/sys/sys-module"

@Module({
	imports: [
		ConfigModule.forRoot({ load: [readActiveYamlFile.bind(this, __dirname)], isGlobal: true, cache: true }),
		registerRedis(),
		registerDatabase(),
		AspenCoreModule,
		AppClsModule,
		SysModule,
	],
	providers: [TestInjectable],
	controllers: [DemoController],
})
export class AppModule {}
