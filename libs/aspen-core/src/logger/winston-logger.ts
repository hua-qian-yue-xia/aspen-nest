import * as os from "node:os"

import { Injectable, Scope, LoggerService } from "@nestjs/common"

import { createLogger, format, transports, config, Logger } from "winston"
import * as DailyRotateFile from "winston-daily-rotate-file"

import { tool } from "../tool/index"

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLogger implements LoggerService {
	private context?: string

	private readonly winstonLogger: Logger

	constructor(winstonLogger: Logger) {
		this.winstonLogger = winstonLogger
	}

	// Nest 标准 log → Winston info
	public log(message: any, context?: string): any {
		context = context || this.context
		if (!!message && "object" === typeof message) {
			const { message: msg, level = "info", ...meta } = message
			return this.winstonLogger.log(level, msg as string, { context, ...meta })
		}
		return this.winstonLogger.info(message, { context })
	}

	// Nest 标准 fatal → Winston fatal
	public fatal(message: any, trace?: string, context?: string): any {
		context = context || this.context
		if (message instanceof Error) {
			const { message: msg, name, stack, ...meta } = message
			return this.winstonLogger.log({
				level: "fatal",
				message: msg,
				context,
				stack: [trace || stack],
				error: message,
				...meta,
			})
		}
		if (!!message && "object" === typeof message) {
			const { message: msg, ...meta } = message
			return this.winstonLogger.log({ level: "fatal", message: msg, context, stack: [trace], ...meta })
		}
		return this.winstonLogger.log({ level: "fatal", message, context, stack: [trace] })
	}

	// Nest warn → Winston warn
	public warn(message: any, context?: string) {
		context = context || this.context
		if (!!message && "object" === typeof message) {
			const { message: msg, ...meta } = message
			return this.winstonLogger.warn(msg as string, { context, ...meta })
		}
		return this.winstonLogger.warn(message, { context })
	}

	// Nest error → Winston error
	public error(message: any, trace?: string, context?: string): any {
		context = context || this.context
		if (message instanceof Error) {
			const { message: msg, name, stack, ...meta } = message
			return this.winstonLogger.error(msg, { context, stack: [trace || message.stack], error: message, ...meta })
		}
		if (!!message && "object" === typeof message) {
			const { message: msg, ...meta } = message

			return this.winstonLogger.error(msg as string, { context, stack: [trace], ...meta })
		}
		return this.winstonLogger.error(message, { context, stack: [trace] })
	}

	// Nest debug → Winston debug
	public debug?(message: any, context?: string): any {
		context = context || this.context
		if (!!message && "object" === typeof message) {
			const { message: msg, ...meta } = message
			return this.winstonLogger.debug(msg as string, { context, ...meta })
		}
		return this.winstonLogger.debug(message, { context })
	}

	// Nest verbose → Winston verbose
	public verbose?(message: any, context?: string): any {
		context = context || this.context
		if (!!message && "object" === typeof message) {
			const { message: msg, ...meta } = message
			return this.winstonLogger.verbose(msg as string, { context, ...meta })
		}
		return this.winstonLogger.verbose(message, { context })
	}

	public getWinstonLogger(): Logger {
		return this.winstonLogger
	}
}

const pad = (s: any, w: number) => {
	const str = (s ?? "").toString()
	return str.length >= w ? str.slice(0, w) : str.padEnd(w, " ")
}

const colorLevel = (raw: string, fixed: string) => {
	switch ((raw || "").toLowerCase()) {
		case "error":
			return `\x1b[31m${fixed}\x1b[0m` // red
		case "warn":
			return `\x1b[33m${fixed}\x1b[0m` // yellow
		case "info":
			return `\x1b[32m${fixed}\x1b[0m` // green
		case "http":
			return `\x1b[36m${fixed}\x1b[0m` // cyan
		case "debug":
			return `\x1b[34m${fixed}\x1b[0m` // blue
		case "verbose":
			return `\x1b[35m${fixed}\x1b[0m` // magenta
		case "silly":
			return `\x1b[90m${fixed}\x1b[0m` // gray
		default:
			return fixed
	}
}

export const createWinstonLogger = (appConfig: GlobalConfig.AppConfig, loggerConfig: GlobalConfig.LoggerConfig) => {
	// 控制台彩色可读格式（开发友好）
	const consoleFormat = format.combine(
		// 不使用全局 colorize，避免影响对齐；改为在 printf 内对 level 上色
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
		format.errors({ stack: true }),
		format.printf(({ timestamp, level, message, context, ...rest }) => {
			const lvl = `[${colorLevel(level, pad(level.toUpperCase(), 5))}]`
			const ctxFixed = context ? `[${pad(context, 20)}] ` : "[]"
			const msg = typeof message === "string" ? message : JSON.stringify(message)
			return `${timestamp} ${lvl} ${ctxFixed}${msg}`
		}),
	)

	// 文件 JSON 格式（便于 Promtail/Loki 采集）
	const jsonFormat = format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
		format.errors({ stack: true }),
		format.json(),
	)

	// 兼容 default 导出与命名空间导出
	const RotateClass: any = (DailyRotateFile as any).default || (DailyRotateFile as any)

	return createLogger({
		levels: config.npm.levels,
		level: loggerConfig.level,
		exitOnError: false,
		defaultMeta: {
			app: appConfig.name,
			env: process.env.NODE_ENV,
			os: os.hostname(),
			instance: tool.os.getResolveInstance(),
		},
		transports: [
			new transports.Console({
				level: loggerConfig.level,
				format: consoleFormat,
				handleExceptions: true,
				handleRejections: true,
			}),
			new RotateClass({
				dirname: `logs/${appConfig.name}`,
				filename: `${appConfig.name}-%DATE%.log`,
				datePattern: "YYYY-MM-DD",
				zippedArchive: loggerConfig.zippedArchive,
				maxSize: loggerConfig.maxSize,
				maxFiles: loggerConfig.maxFiles,
				handleExceptions: true,
				handleRejections: true,
				format: jsonFormat,
			}),
		],
	})
}
