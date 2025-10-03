import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { FrameApiEntity, FrameDictEntity, FrameDictItemEntity } from "@aspen/aspen-framework"

import { FrameDictController, FrameDictItemController } from "./controller/index"

import { FrameDictService, FrameDictItemService } from "./service/index"

@Module({
	imports: [TypeOrmModule.forFeature([FrameApiEntity, FrameDictEntity, FrameDictItemEntity])],
	controllers: [FrameDictController, FrameDictItemController],
	providers: [FrameDictService, FrameDictItemService],
})
export class FrameworkModule {}
