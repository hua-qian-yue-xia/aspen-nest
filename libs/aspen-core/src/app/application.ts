import * as path from "node:path"
import * as fs from "node:fs"

import * as yaml from "js-yaml"
import * as _ from "radash"

import { NestFactory, Reflector } from "@nestjs/core"

import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify"
import { ConfigFactory, ConfigService } from "@nestjs/config"

import { ApplicationCtx } from "./application-ctx"
import { ApplicationModule } from "./application-module"
import { registerSwaggerDoc } from "../doc/swagger"
import { HttpExceptionFilter } from "../exception/filter/exception-filter"
import { ValidationExceptionFilter } from "../exception/filter/validation-exception-filter"
import { WinstonLogger } from "../logger/winston-logger"
import { ClassSerializerInterceptor, ValidationPipe, BadRequestException } from "@nestjs/common"

export class Application {
	private app: NestFastifyApplication
	private config: ConfigService<GlobalConfig.Application, true>

	public constructor() {}

	async create(configFilePath: string, module: any): Promise<Application> {
		this.app = await NestFactory.create<NestFastifyApplication>(
			ApplicationModule.forRoot([this.readActiveYamlFile(configFilePath)], module),
			new FastifyAdapter({
				logger: false,
			}),
			{ bufferLogs: true },
		)
		// 设置应用上下文
		ApplicationCtx.getInstance().setApp(this.app)

		this.config = this.app.get(ConfigService)
		const appConfig = this.config.get<GlobalConfig.AppConfig>("app")

		this.app.enableCors()

		// 配置全局路由前缀
		this.app.setGlobalPrefix(appConfig.prefix)

		this.app.useGlobalPipes(
			// 启用全局校验管道
			new ValidationPipe({
				transform: true,
				whitelist: true,
				forbidNonWhitelisted: false,
				forbidUnknownValues: false,
			}),
		)

		// 配置全局异常过滤器（先注册 Http，再注册 Validation；逆序执行使 Validation 优先处理 400）
		this.app.useGlobalFilters(new HttpExceptionFilter(), new ValidationExceptionFilter())

		// 日志处理：注入 WinstonLogger
		this.app.useLogger(this.app.get(WinstonLogger))

		// 配置全局序列化拦截器
		this.app.useGlobalInterceptors(new ClassSerializerInterceptor(this.app.get(Reflector)))

		// 配置swagger文档
		registerSwaggerDoc(this.app, {
			address: `127.0.0.1:${appConfig.port}${appConfig.prefix === "/" ? "" : appConfig.prefix}`,
			title: "aspen-nest后台服务文档",
		})
		return this
	}

	async listen() {
		const appConfig = this.config.get<GlobalConfig.AppConfig>("app")
		await this.app.listen(appConfig.port)
		console.log(`|应用启动|,地址:127.0.0.1:${appConfig.port}/${appConfig.prefix}`)
	}

	/**
	 * 读取活动的yaml配置文件
	 */
	private readActiveYamlFile = (cwdPath: string): ConfigFactory => {
		let defaultConf = this.readYamlFile(cwdPath, "")
		defaultConf = _.assign(
			{
				app: this.getAppDefault(),
				redis: this.getRedisDefault(),
				database: this.getDatabaseDefault(),
				jwt: this.getJwtConfig(),
				logger: this.getLoggerDefault(),
			},
			defaultConf,
		)
		const envModeConfig = this.readYamlFile(cwdPath, this.readEnvMode())
		const configObj = _.assign(defaultConf, envModeConfig)

		return configObj as any
	}

	/**
	 * 读取yaml配置文件
	 */
	private readYamlFile = (cwdPath: string, type: Env.Mode) => {
		const filename = type ? `-${type}` : type
		const filePath: string = path.join(cwdPath, "config", `application${filename}.yaml`)
		return yaml.load(fs.readFileSync(filePath, "utf-8")) as Record<string, any>
	}

	/**
	 * 根据运行命令判断环境,使用NODE_ENV
	 */
	private readEnvMode = (): Env.Mode => {
		return process.env.NODE_ENV as Env.Mode
	}

	/**
	 * 获取app默认配置
	 */
	private getAppDefault = () => {
		return {
			port: 7001,
		} as GlobalConfig.AppConfig
	}

	/**
	 * 获取redis默认配置
	 */
	private getRedisDefault = () => {
		return {
			port: 6379,
			password: "",
			db: 0,
		} as GlobalConfig.RedisConfig
	}

	/**
	 * 获取database默认配置
	 */
	private getDatabaseDefault = () => {
		return {
			type: "mysql",
			host: "localhost",
			port: 3306,
			username: "root",
			password: "root",
			database: "",
			dropSchema: false,
			synchronize: false,
		} as GlobalConfig.DatabaseConfig
	}

	/**
	 * 获取jwt默认配置
	 */
	private getJwtConfig = () => {
		return {
			secret: "",
			expiresIn: "1Y",
		} as GlobalConfig.JwtConfig
	}

	/**
	 * 获取logger默认配置
	 */
	private getLoggerDefault = () => {
		return {
			level: "info",
			zippedArchive: true,
			maxSize: "20m",
			maxFiles: "3m",
		} as GlobalConfig.LoggerConfig
	}
}
