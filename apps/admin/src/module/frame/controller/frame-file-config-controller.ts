import { Body, Param, ParseArrayPipe } from "@nestjs/common"

import { R, router } from "@aspen/aspen-core"
import { FrameFileConfigEntity } from "@aspen/aspen-framework"

import { FrameFileConfigService } from "../service"

import { FrameFileConfigQueryDto, FrameFileConfigSaveDto } from "../common/entity/frame-file-config-entity"

@router.controller({ prefix: "/frame/file-config", summary: "文件配置" })
export class FrameFileConfigController {
	constructor(private readonly frameFileConfigService: FrameFileConfigService) {}

	@router.post({
		summary: "文件配置分页",
		router: "/page",
		resType: {
			wrapper: "page",
			type: FrameFileConfigEntity,
		},
	})
	async page(@Body() dto: FrameFileConfigQueryDto) {
		const list = await this.frameFileConfigService.page(dto)
		return R.success(list)
	}

	@router.get({
		summary: "根据configId查询文件配置(有缓存)",
		router: "/:configId",
		resType: {
			type: FrameFileConfigEntity,
		},
	})
	async getByConfigId(@Param("configId") configId: string) {
		const configDetail = await this.frameFileConfigService.getByConfigId(configId)
		return R.success(configDetail)
	}

	@router.post({
		summary: "新增文件配置",
		router: "",
	})
	async save(@Body() body: FrameFileConfigSaveDto) {
		const save = await this.frameFileConfigService.save(body)
		return R.success(save)
	}

	@router.put({
		summary: "更新文件配置",
		router: "",
	})
	async edit(@Body() body: FrameFileConfigSaveDto) {
		await this.frameFileConfigService.edit(body)
		return R.success()
	}

	@router.delete({
		summary: "删除文件配置",
		router: "/:configIds",
	})
	async delete(
		@Param("configIds", new ParseArrayPipe({ items: String, separator: "," }))
		configIds: Array<string>,
	) {
		const delCount = await this.frameFileConfigService.delByIds(configIds)
		return R.success(delCount)
	}
}
