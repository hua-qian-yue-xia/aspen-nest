import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { DemoController } from "apps/admin/src/domo/demo-controller"
import { AspenCoreModule, readActiveYamlFile, registerRedis } from "packages/aspen-core/src"

@Module({
	imports: [
		ConfigModule.forRoot({ load: [readActiveYamlFile.bind(this, __dirname)], isGlobal: true, cache: true }),
		registerRedis(),
		AspenCoreModule,
	],
	controllers: [DemoController],
})
export class AppModule {}
