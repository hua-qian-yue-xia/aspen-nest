import { DynamicModule, Global, Logger, Module } from "@nestjs/common"
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm"
import { SnakeNamingStrategy } from "typeorm-naming-strategies"
import { ConfigModule, ConfigService } from "@nestjs/config"

import { Application, DatabaseConfig } from "../index"
import * as _ from "radash"

const DATABASE_TAG = "database"

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
				TypeOrmModule.forRootAsync({
					imports: [ConfigModule],
					inject: [ConfigService],
					useFactory: async (config: ConfigService<Application, true>): Promise<TypeOrmModuleOptions> => {
						const logger = new Logger(DATABASE_TAG)
						const { type, host, port, username, password, database, dropSchema, synchronize } =
							config.get<DatabaseConfig>("database")
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
						logger.verbose(
							`连接数据库参数type:<${type}>host:<${host}>port:<${port}>username:<${username}>password:<${password}>database:<${database}>dropSchema:<${dropSchema}>synchronize:<${synchronize}>`,
						)
						return {
							type: type,
							host: host,
							port: port,
							username: username,
							password: password,
							database: database,
							dropSchema: dropSchema,
							synchronize: synchronize,
							logging: true,
							entities: [options.entityPattern],
							// 转换为蛇形命名
							namingStrategy: new SnakeNamingStrategy(),
						}
					},
				}),
			],
			exports: [TypeOrmModule],
		}
	}
}
