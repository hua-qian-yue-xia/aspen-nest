import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import {
	FrameDictEntity,
	FrameDictItemEntity,
	FrameFileCategoryEntity,
	FrameFileConfigEntity,
	FrameFileEntity,
} from "@aspen/aspen-framework"

import {
	FrameDictController,
	FrameDictItemController,
	FrameFileCategoryController,
	FrameFileConfigController,
	FrameFileController,
} from "./controller/index"

import {
	FrameFileConfigShare,
	FrameDictService,
	FrameDictItemService,
	FrameFileCategoryService,
	FrameFileConfigService,
	FrameFileService,
} from "./service/index"

import { FileService } from "./service/file/index"

@Module({
	imports: [
		TypeOrmModule.forFeature([
			FrameDictEntity,
			FrameDictItemEntity,
			FrameFileCategoryEntity,
			FrameFileConfigEntity,
			FrameFileEntity,
		]),
	],
	controllers: [
		FrameDictController,
		FrameDictItemController,
		FrameFileCategoryController,
		FrameFileConfigController,
		FrameFileController,
	],
	providers: [
		FrameFileConfigShare,
		FrameDictService,
		FrameDictItemService,
		FrameFileCategoryService,
		FrameFileConfigService,
		FrameFileService,
		FileService,
	],
	exports: [FileService],
})
export class FrameModule {}
