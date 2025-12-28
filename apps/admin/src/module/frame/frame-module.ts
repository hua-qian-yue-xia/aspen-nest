import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import {
	FrameDictEntity,
	FrameDictItemEntity,
	FrameFileConfigEntity,
	FrameFileContentEntity,
	FrameFileEntity,
} from "@aspen/aspen-framework"

import {
	FrameDictController,
	FrameDictItemController,
	FrameFileConfigController,
	FrameFileContentController,
	FrameFileController,
} from "./controller/index"

import {
	FrameDictService,
	FrameDictItemService,
	FrameFileConfigService,
	FrameFileContentService,
	FrameFileService,
} from "./service/index"

@Module({
	imports: [
		TypeOrmModule.forFeature([
			FrameDictEntity,
			FrameDictItemEntity,
			FrameFileConfigEntity,
			FrameFileContentEntity,
			FrameFileEntity,
		]),
	],
	controllers: [
		FrameDictController,
		FrameDictItemController,
		FrameFileConfigController,
		FrameFileContentController,
		FrameFileController,
	],
	providers: [
		FrameDictService,
		FrameDictItemService,
		FrameFileConfigService,
		FrameFileContentService,
		FrameFileService,
	],
})
export class FrameModule {}
