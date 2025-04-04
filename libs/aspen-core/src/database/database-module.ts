import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm"
import { SnakeNamingStrategy } from "typeorm-naming-strategies"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { Logger } from "@nestjs/common"

import { Application, DatabaseConfig } from "../index"
import * as _ from "radash"

export const DATABASE_TAG = "database"

export const registerDatabase = () => {
	return TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: async (config: ConfigService<Application, true>): Promise<TypeOrmModuleOptions> => {
			const logger = new Logger(DATABASE_TAG)
			const { type, host, port, username, password, database } = config.get<DatabaseConfig>("database")
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
				`连接数据库成功type:<${type}>host:<${host}>port:<${port}>username:<${username}>password:<${password}>database:<${database}>`,
			)
			console.log(__dirname)
			const entityDir = `${process.cwd()}/dist/**/admin/**/*-entity{.ts,.js}`
			return {
				type: type,
				host: host,
				port: port,
				username: username,
				password: password,
				database: database,
				dropSchema: true,
				synchronize: true,
				logging: "all",
				entities: [entityDir],
				namingStrategy: new SnakeNamingStrategy(),
			}
		},
	})
}
