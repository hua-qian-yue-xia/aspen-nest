import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { DemoController } from "apps/admin/src/domo/demo-controller"
import { readActiveYamlFile } from "packages/aspen-core/src/config/read-config"

@Module({
	imports: [ConfigModule.forRoot({ load: [readActiveYamlFile.bind(this, __dirname)], isGlobal: true, cache: true })],
	controllers: [DemoController],
})
export class AppModule {}
