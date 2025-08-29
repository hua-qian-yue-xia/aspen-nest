import { AppClsModule } from "./app/app-cls-module"

import { RedisCacheModule } from "./cache/redis-module"

import { DatabaseModule } from "./database/database-module"

import { LogModule } from "./decorator/log/log-module"

import { NoTokenModule } from "./decorator/no-token/no-token-module"

export const module = {
	redisCache: RedisCacheModule,
	database: DatabaseModule,
	log: LogModule,
	noToken: NoTokenModule,
	appCls: AppClsModule,
}
