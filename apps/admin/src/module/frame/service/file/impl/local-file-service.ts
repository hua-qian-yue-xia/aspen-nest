import * as fs from "fs-extra"
import * as path from "path"
import * as _ from "radash"

import { AbstractFileClient, FileUploadVo, UploadChunkDto } from "../base/base-file-service"
import { FileLocalConfig } from "../base/file-config"

/**
 * 本地文件服务
 */
export default class LocalFileService extends AbstractFileClient<FileLocalConfig> {
	// 上传目录
	private uploadDir: string
	// 分片目录
	private chunkDir: string

	constructor(id: string, config: FileLocalConfig) {
		super(id, config)
	}

	doInit(): void {
		const dir = this.config.dirType === "root" ? "/" : process.cwd() + this.config.uploadDir
		// 确保目录存在
		fs.ensureDirSync(dir)
		this.uploadDir = dir
		this.chunkDir = path.join(this.uploadDir, "chunks")
		// 确保分片目录存在
		fs.ensureDirSync(this.chunkDir)
	}

	/**
	 * 单文件上传文件(会有文件大小的限制比如大于10MB就不允许上传,请使用分片上传)
	 * @param file 文件流或Buffer
	 * @param path 存储路径,文件夹包括文件名`/logo/test_logo.png`
	 * @param type 文件类型
	 */
	override async uploadSingle(file: Buffer, filePath: string, fileType: string): Promise<FileUploadVo> {
		const ext = path.extname(filePath)
		const newFileName = `${_.uid(16)}${ext}`
		const relativePath = path.join(path.dirname(filePath), newFileName)
		const absolutePath = path.join(this.uploadDir, relativePath)
		// 确保目录存在
		await fs.ensureDir(path.dirname(absolutePath))
		// @ts-ignore
		fs.writeFile(absolutePath, file)
		const stats = await fs.stat(absolutePath)
		return {
			fileName: newFileName,
			filePath: relativePath,
			fileType: ext.replace(".", ""),
			fileSize: stats.size,
			fullPath: `${this.config.domain}${relativePath}`,
		}
	}

	/**
	 * 上传单个分片
	 */
	async uploadChunk(dto: UploadChunkDto): Promise<void> {
		const chunks = await fs.readdir(this.chunkDir)
		// 按序号排序
		chunks.sort((a, b) => parseInt(a) - parseInt(b))
		// 创建合并后的临时文件
		const mergedFilePath = path.join(this.chunkDir, `${dto.identifier}_merged${path.extname(dto.filename)}`)
		const writeStream = fs.createWriteStream(mergedFilePath)
		for (const chunk of chunks) {
			const chunkPath = path.join(this.chunkDir, chunk)
			const data = await fs.readFile(chunkPath)
			writeStream.write(data)
		}
		writeStream.end()
		await new Promise((resolve) => writeStream.on("finish", resolve))
		// 调用最终的文件服务上传
		const fileBuffer = await fs.readFile(mergedFilePath)
		await this.uploadSingle(fileBuffer, dto.filename, dto.fileType)
		// 清理临时文件和分片目录
		await fs.remove(mergedFilePath)
		await fs.remove(path.join(this.chunkDir, dto.identifier))
	}

	/**
	 * 检查分片状态(用于秒传和断点续传)
	 * @param identifier 文件唯一标识(MD5)
	 * @returns 已上传的分片序号列表
	 */
	async checkChunks(identifier: string): Promise<Array<number>> {
		if (!(await fs.pathExists(this.chunkDir))) {
			return []
		}
		const files = await fs.readdir(this.chunkDir)
		// 分片顺序
		return files.map((f) => parseInt(f)).filter((n) => !isNaN(n))
	}

	/**
	 * 合并分片
	 * @param identifier 文件唯一标识(MD5)
	 * @param filePath 存储路径,文件夹包括文件名`/logo/test_logo.png`
	 * @param fileType 文件类型
	 */
	async mergeChunks(identifier: string, filePath: string, fileType: string): Promise<FileUploadVo> {
		const chunks = await fs.readdir(this.chunkDir)
		// 按序号排序
		chunks.sort((a, b) => parseInt(a) - parseInt(b))
		// 创建合并后的临时文件
		const mergedFilePath = path.join(this.uploadDir, filePath)
		const writeStream = fs.createWriteStream(mergedFilePath)
		for (const chunk of chunks) {
			const chunkPath = path.join(this.chunkDir, chunk)
			const data = await fs.readFile(chunkPath)
			writeStream.write(data)
		}
		writeStream.end()
		await new Promise((resolve) => writeStream.on("finish", resolve))
		// 调用最终的文件服务上传
		const fileBuffer = await fs.readFile(mergedFilePath)
		const result = await this.uploadSingle(fileBuffer, filePath, fileType)
		// 清理临时文件和分片目录
		await fs.remove(mergedFilePath)
		await fs.remove(path.join(this.chunkDir, identifier))
		return result
	}

	/**
	 * 删除文件
	 * @param filePath 文件路径
	 */
	async delete(filePath: string): Promise<void> {
		await fs.remove(path.join(this.uploadDir, filePath))
	}

	/**
	 * 获取文件内容
	 * @param filePath 文件路径
	 */
	async getContent(filePath: string): Promise<Buffer> {
		return await fs.readFile(path.join(this.uploadDir, filePath))
	}
}
