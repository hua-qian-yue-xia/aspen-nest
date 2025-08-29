import { ConfigModule, ConfigService } from "@nestjs/config"
import { DynamicModule, Global, Logger, Module } from "@nestjs/common"

import { RedisModule, RedisModuleOptions } from "@liaoliaots/nestjs-redis"
import * as _ from "radash"

import { Application, RedisConfig } from "../index"

export const REDIS_TAG = "redis"

export type RedisCacheModuleOptions = {
	/**
	 * 是否全局模块
	 * @default true
	 */
	isGlobal?: boolean
}

@Global()
@Module({})
export class RedisCacheModule {
	static forRoot(options: RedisCacheModuleOptions): DynamicModule {
		return {
			module: RedisModule,
			global: options.isGlobal ?? true,
			imports: [
				ConfigModule,
				RedisModule.forRootAsync({
					imports: [ConfigModule],
					inject: [ConfigService],
					useFactory: async (config: ConfigService<Application, true>): Promise<RedisModuleOptions> => {
						const logger = new Logger(REDIS_TAG)
						const { host, port, password, db } = config.get<RedisConfig>("redis")
						if (_.isEmpty(host) || _.isEmpty(port) || _.isEmpty(db)) return {}
						logger.verbose(`连接redis参数host:<${host}>port:<${port}>password:<${password}>db:<${db}>`)
						return {
							config: {
								host: host,
								port: port,
								password: password,
								db: db,
							},
						}
					},
				}),
			],
		}
	}
}
