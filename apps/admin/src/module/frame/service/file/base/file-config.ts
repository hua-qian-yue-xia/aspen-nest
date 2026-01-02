import * as _ from "radash"

import { AspenSummary } from "@aspen/aspen-core"

import { IFileConfig } from "./base-file-service"

/**
 * S3通用文件配置
 */
export class FileS3Config implements IFileConfig {
	@AspenSummary({ summary: "endpoint" })
	endpoint: string

	@AspenSummary({ summary: "domain" })
	domain: string

	@AspenSummary({ summary: "存储bucket" })
	bucket: string

	@AspenSummary({ summary: "访问key" })
	accessKey: string

	@AspenSummary({ summary: "访问secret" })
	accessSecret: string

	getTag(): string {
		return "S3通用文件配置"
	}

	validate(): string | null {
		const error = []
		if (!_.isString(this.endpoint)) {
			error.push("endpoint")
		}
		if (!_.isString(this.domain)) {
			error.push("domain")
		}
		if (!_.isString(this.bucket)) {
			error.push("bucket")
		}
		if (!_.isString(this.accessKey)) {
			error.push("accessKey")
		}
		if (!_.isString(this.accessSecret)) {
			error.push("accessSecret")
		}
		return error.length > 0 ? `请配置${error.join("、")}` : null
	}
}

/**
 * 本地文件配置管理表
 */
export class FileLocalConfig implements IFileConfig {
	/**
	 * @name 目录类型
	 * - root:服务器的根目录(/)
	 * - cwd:当前工作目录(process.cwd())
	 */
	@AspenSummary({ summary: "目录类型" })
	dirType: "root" | "cwd"

	/**
	 * @name 上传目录
	 * @description 本地文件上传目录
	 */
	@AspenSummary({ summary: "上传目录" })
	uploadDir: string

	/**
	 * @name 域名
	 * 1-通常是本地域名(开发模式)
	 * 2-nginx反向代理域名(生产模式)
	 * 3-为空(不主动拼接-可由前端动态拼接)
	 */
	@AspenSummary({ summary: "域名" })
	domain?: string

	getTag(): string {
		return "本地文件配置管理表"
	}

	validate(): string | null {
		const error = []
		if (!_.isString(this.dirType)) {
			error.push("目录类型")
		}
		if (!_.isString(this.uploadDir)) {
			error.push("上传目录")
		}
		return error.length > 0 ? `请配置${error.join("、")}` : null
	}
}
