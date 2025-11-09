import { DynamicModule, Global, Logger, Module } from "@nestjs/common"
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm"
import { SnakeNamingStrategy } from "typeorm-naming-strategies"
import { ConfigModule, ConfigService } from "@nestjs/config"
import type { Logger as TypeOrmLogger, QueryRunner } from "typeorm"
import type { Logger as WinstonLogger } from "winston"
import { createWinstonLogger } from "../logger/winston-logger"
import { WinstonLoggerModule, WINSTON_INSTANCE } from "../logger/winston-logger-module"

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
							logger: new TypeOrmWinstonLogger(w),
						}
					},
				}),
			],
			exports: [TypeOrmModule],
		}
	}
}

class TypeOrmWinstonLogger implements TypeOrmLogger {
	constructor(private readonly w: WinstonLogger) {}

	// 将 TypeORM 的通用日志映射到 Winston（info/warn），用于输出一般信息与警告
	log(level: "log" | "info" | "warn", message: any, _queryRunner?: QueryRunner) {
		if (level === "warn") {
			this.w.warn({ msg: message })
		} else {
			this.w.info({ msg: message })
		}
	}

	// 记录执行的 SQL 语句(开发调试用，生产可按需关闭或降低级别)
	logQuery(query: string, parameters?: unknown[], _queryRunner?: QueryRunner) {
		this.w.debug({ msg: "typeorm:query", query, parameters })
	}

	// 记录 SQL 错误(包含语句与参数),便于快速定位问题
	logQueryError(error: string | Error, query: string, parameters?: unknown[], _queryRunner?: QueryRunner) {
		this.w.error({ msg: "typeorm:query-error", query, parameters, error: String(error) })
	}

	// 记录慢查询(阈值由 TypeORM 控制),用于性能分析与优化
	logQuerySlow(time: number, query: string, parameters?: unknown[], _queryRunner?: QueryRunner) {
		this.w.warn({ msg: "typeorm:query-slow", time, query, parameters })
	}

	// 记录架构构建过程(建表/结构同步等),用于迁移与初始化阶段的可观测性
	logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
		this.w.info({ msg: "typeorm:schema-build", message })
	}

	// 记录数据库迁移执行信息(版本、步骤、状态),用于迁移与初始化阶段的可观测性
	logMigration(message: string, _queryRunner?: QueryRunner) {
		this.w.info({ msg: "typeorm:migration", message })
	}
}
