import { ConfigModule, ConfigService } from "@nestjs/config"
import { Logger } from "@nestjs/common"

import { RedisModule, RedisModuleOptions } from "@liaoliaots/nestjs-redis"
import * as _ from "radash"

import { Application, RedisConfig } from "packages/aspen-core/src"

export const REDIS_TAG = "redis"

export const registerRedis = () => {
	return RedisModule.forRootAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: async (config: ConfigService<Application, true>): Promise<RedisModuleOptions> => {
			const logger = new Logger(REDIS_TAG)
			const { host, port, password, db } = config.get<RedisConfig>("redis")
			if (_.isEmpty(host) || _.isEmpty(port) || _.isEmpty(db)) return {}
			logger.debug(`连接redis成功host:<${host}>port:<${port}>password:<${password}>db:<${db}>`)
			return {
				config: {
					host: host,
					port: port,
					password: password,
					db: db,
				},
			}
		},
	})
}
