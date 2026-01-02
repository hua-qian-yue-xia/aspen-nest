import { Injectable, Scope } from "@nestjs/common"
import { plainToInstance } from "class-transformer"

import { exception } from "@aspen/aspen-core"

import { AbstractFileClient, IFileClientService } from "./base/base-file-service"
import { FileS3Config, FileLocalConfig } from "./base/file-config"
import MinioFileService from "./impl/min-io-file-service"
import LocalFileService from "./impl/local-file-service"

import { FrameFileConfigService } from "../frame-file-config-service"

import { frameFileConfigTypeEnum } from "../../common/frame-enum.enum-gen"

@Injectable({ scope: Scope.DEFAULT })
export class FileService {
	private readonly fileServiceMap = new Map<string, AbstractFileClient>()

	constructor(private readonly frameFileConfigService: FrameFileConfigService) {}

	async getFileService(code?: string): Promise<AbstractFileClient | null> {
		// 如果有code先查询code对应的配置,没有就查询默认配置
		const config = await this.frameFileConfigService.getConfigByCodeOrDefault(code)
		if (!config) {
			throw new exception.validator(`文件配置"${code ?? ""}"不存在`)
		}
		const fileConfig = config.config
		// 检查缓存
		if (this.fileServiceMap.has(config.uniqueCode)) {
			const fileService = this.fileServiceMap.get(config.uniqueCode)!
			fileService.refreshConfig(fileConfig)
			return fileService
		}

		let fileService: AbstractFileClient = null
		// 根据配置创建文件客户端
		switch (config.type) {
			case frameFileConfigTypeEnum.MINIO.code:
				fileService = new MinioFileService(config.uniqueCode, plainToInstance(FileS3Config, config.config))
				break
			case frameFileConfigTypeEnum.FILE.code:
				fileService = new LocalFileService(config.uniqueCode, plainToInstance(FileLocalConfig, config.config))
				break
			default:
				throw new exception.validator(`文件配置"${code ?? ""}"不存在`)
		}
		if (fileService) {
			fileService.refreshConfig(fileConfig)
			this.fileServiceMap.set(config.uniqueCode, fileService)
		}
		return fileService
	}

	/**
	 * 移除文件服务缓存
	 * @param code
	 */
	removeFileService(code: string) {
		this.fileServiceMap.delete(code)
	}
}
