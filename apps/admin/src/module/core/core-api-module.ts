import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { CoreApiEntity, CoreLogEntity } from "@aspen/aspen-core"

import { CoreApiController, CoreLogController } from "apps/admin/src/module/core/controller"
import { CoreApiService, CoreLogService } from "apps/admin/src/module/core/service"

@Module({
	imports: [TypeOrmModule.forFeature([CoreApiEntity, CoreLogEntity])],
	controllers: [CoreApiController, CoreLogController],
	providers: [CoreApiService, CoreLogService],
})
export class CoreApiModule {}
