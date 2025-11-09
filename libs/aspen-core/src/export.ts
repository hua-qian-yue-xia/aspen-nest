import { ApplicationCls } from "./app/application-cls"

import { RedisCacheModule } from "./cache/redis-module"

import { DatabaseModule } from "./database/database-module"

import { LogModule } from "./decorator/log/log-module"

import { NoTokenModule } from "./decorator/no-token/no-token-module"

export const coreModule = {
	redisCache: RedisCacheModule,
	database: DatabaseModule,
	log: LogModule,
	noToken: NoTokenModule,
	appCls: ApplicationCls,
}
