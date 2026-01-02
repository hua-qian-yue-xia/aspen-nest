import { Logger } from "@nestjs/common"

import { exception } from "@aspen/aspen-core"

export interface UploadChunkDto {
	/**
	 * 文件唯一标识(MD5)
	 */
	identifier: string
	/**
	 * 当前分片序号
	 */
	chunkNumber: number
	/**
	 * 总分片数
	 */
	totalChunks: number
	/**
	 * 原始文件名
	 */
	filename: string
	/**
	 * 文件类型
	 */
	fileType: string
	/**
	 * 分片数据
	 */
	file: Buffer
}

export interface FileUploadVo {
	/**
	 * 文件名
	 */
	fileName: string
	/**
	 * 文件路径
	 */
	filePath: string
	/**
	 * 文件类型
	 */
	fileType: string
	/**
	 * 文件大小
	 */
	fileSize: number
	/**
	 * 完整路径(如果有配置域名会包含域名)
	 */
	fullPath: string
}

export interface IFileClientService {
	/**
	 * 获得客户端编号
	 */
	getId(): string

	/**
	 * 单文件上传文件(会有文件大小的限制比如大于10MB就不允许上传,请使用分片上传)
	 * @param file 文件流或Buffer
	 * @param filePath 存储路径,文件夹包括文件名`/logo/test_logo.png`
	 * @param fileType 文件类型
	 */
	uploadSingle(file: Buffer, filePath: string, fileType: string): Promise<FileUploadVo>

	/**
	 * 上传单个分片
	 */
	uploadChunk(dto: UploadChunkDto): Promise<void>

	/**
	 * 检查分片状态(用于秒传和断点续传)
	 * @param identifier 文件唯一标识(MD5)
	 * @returns 已上传的分片序号列表
	 */
	checkChunks(identifier: string): Promise<Array<number>>

	/**
	 * 合并分片
	 * @param identifier 文件唯一标识(MD5)
	 * @param filePath 存储路径,文件夹包括文件名`/logo/test_logo.png`
	 * @param fileType 文件类型
	 */
	mergeChunks(identifier: string, filePath: string, fileType: string): Promise<FileUploadVo>

	/**
	 * 删除文件
	 * @param filePath 文件路径
	 */
	delete(filePath: string): Promise<void>

	/**
	 * 获取文件内容
	 * @param filePath 文件路径
	 */
	getContent(filePath: string): Promise<Buffer>
}

export interface IFileConfig {
	/**
	 * 获取文件标签
	 */
	getTag(): string
}

export abstract class AbstractFileClient<C extends IFileConfig = any> implements IFileClientService {
	protected logger = new Logger(this.constructor.name)

	/**
	 * 配置编号
	 */
	private id: string
	/**
	 * 文件配置
	 */
	protected config: C

	constructor(id: string, config: C) {
		this.id = id
		this.config = config
	}

	/**
	 * 初始化
	 */
	private init() {
		this.doInit()
		this.log(`初始化文件客户端(${this.config.getTag()});配置:${JSON.stringify(this.config)};id:${this.id};`)
	}

	/**
	 * 自定义初始化
	 */
	protected doInit(): void {}

	/**
	 * 日志输出
	 */
	protected log(msg: string) {
		this.logger.log(`文件客户端(${this.config.getTag()});id:${this.id};${msg}`)
	}

	/**
	 * 刷新config
	 */
	public refreshConfig(config: C) {
		this.log(`刷新文件客户端(${this.config.getTag()});配置:${JSON.stringify(this.config)};id:${this.id};`)
		this.config = config
		// 初始化
		this.init()
	}

	getId(): string {
		return this.id
	}

	async uploadSingle(file: Buffer, filePath: string, fileType: string): Promise<FileUploadVo> {
		this.log("未实现upload方法")
		throw new exception.core("未实现upload方法")
	}

	async uploadChunk(dto: UploadChunkDto): Promise<void> {
		this.log("未实现uploadChunk方法")
		throw new exception.core("未实现uploadChunk方法")
	}

	async checkChunks(identifier: string): Promise<Array<number>> {
		this.log("未实现checkChunks方法")
		throw new exception.core("未实现checkChunks方法")
	}
	async mergeChunks(identifier: string, filePath: string, fileType: string): Promise<FileUploadVo> {
		this.log("未实现mergeChunks方法")
		throw new exception.core("未实现mergeChunks方法")
	}

	async delete(filePath: string): Promise<void> {
		this.log("未实现delete方法")
		throw new exception.core("未实现delete方法")
	}

	async getContent(filePath: string): Promise<Buffer> {
		this.log("未实现getContent方法")
		throw new exception.core("未实现getContent方法")
	}
}
