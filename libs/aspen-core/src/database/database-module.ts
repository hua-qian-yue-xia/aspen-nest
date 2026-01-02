import { DynamicModule, Global, Logger, Module } from "@nestjs/common"
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm"
import { SnakeNamingStrategy } from "typeorm-naming-strategies"
import { ConfigModule, ConfigService } from "@nestjs/config"
import type { Logger as WinstonLogger } from "winston"
import { createWinstonLogger } from "../logger/winston-logger"

import { WinstonLoggerModule, WINSTON_INSTANCE } from "../logger/winston-logger-module"
import { OrmLogger } from "./tool/orm-logger"

import * as _ from "radash"

export type DatabaseModuleOptions = {
	/**
	 * 是否全局模块
	 * @default true
	 */
	isGlobal?: boolean

	/**
	 * 实体文件路径模式
	 */
	entityPattern: string
}

@Global()
@Module({})
export class DatabaseModule {
	static forRoot(options: DatabaseModuleOptions): DynamicModule {
		return {
			module: DatabaseModule,
			global: options.isGlobal ?? true,
			imports: [
				ConfigModule,
				WinstonLoggerModule,
				TypeOrmModule.forRootAsync({
					imports: [ConfigModule, WinstonLoggerModule],
					inject: [ConfigService, WINSTON_INSTANCE],
					useFactory: async (
						config: ConfigService<GlobalConfig.Application, true>,
						win: WinstonLogger,
					): Promise<TypeOrmModuleOptions> => {
						const logger = new Logger(DatabaseModule.name)
						const { type, host, port, username, password, database, dropSchema, synchronize } =
							config.get<GlobalConfig.DatabaseConfig>("database")
						if (
							_.isEmpty(type) ||
							_.isEmpty(host) ||
							_.isEmpty(port) ||
							_.isEmpty(username) ||
							_.isEmpty(password) ||
							_.isEmpty(database)
						) {
							return null
						}
						logger.debug(
							`连接数据库参数type:<${type}>host:<${host}>port:<${port}>username:<${username}>password:<${password}>database:<${database}>dropSchema:<${dropSchema}>synchronize:<${synchronize}>`,
						)
						const appCfg = config.get<GlobalConfig.AppConfig>("app")
						const loggerCfg = config.get<GlobalConfig.LoggerConfig>("logger")
						const w = win ?? createWinstonLogger(appCfg, loggerCfg)
						return {
							type: type,
							host: host,
							port: port,
							username: username,
							password: password,
							database: database,
							dropSchema: dropSchema,
							synchronize: synchronize,
							logging: ["error", "warn", "schema", "migration"],
							entities: [options.entityPattern],
							autoLoadEntities: true,
							// 转换为蛇形命名
							namingStrategy: new SnakeNamingStrategy(),
							// 全局类型转换
							extra: {
								typeCast: (field: any, next: () => any) => {
									const value: any = next()
									// 将单字节 Buffer 按 0/1 转换为 boolean
									if (Buffer.isBuffer(value) && field.type === "BIT" && value.length === 1) {
										return value[0] === 1
									}
									return value
								},
							},
							logger: new OrmLogger(w),
						}
					},
				}),
			],
			exports: [TypeOrmModule],
		}
	}
}
