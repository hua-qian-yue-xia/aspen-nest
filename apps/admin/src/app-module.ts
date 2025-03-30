import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { DemoController } from "apps/admin/src/domo/demo-controller"
import { AppClsModule, AspenCoreModule, readActiveYamlFile, registerRedis } from "@aspen/aspen-core"
import { TestInjectable } from "apps/admin/src/domo/test"

@Module({
	imports: [
		ConfigModule.forRoot({ load: [readActiveYamlFile.bind(this, __dirname)], isGlobal: true, cache: true }),
		registerRedis(),
		AspenCoreModule,
		AppClsModule,
	],
	providers: [TestInjectable],
	controllers: [DemoController],
})
export class AppModule {}
