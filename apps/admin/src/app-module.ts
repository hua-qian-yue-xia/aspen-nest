import { Module } from "@nestjs/common"

import { DemoController } from "apps/admin/src/domo/demo-controller"

@Module({
	controllers: [DemoController],
})
export class AppModule {}
