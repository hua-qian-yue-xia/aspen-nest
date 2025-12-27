import { ApplicationCls } from "./app/application-cls"

import { RedisCacheModule } from "./cache/redis-module"

import { DatabaseModule } from "./database/database-module"

import { LogModule } from "./decorator/log/log-module"

import { NoTokenModule } from "./decorator/no-token/no-token-module"

import { JwtStrategyModule } from "./guard/jwt/index"

import { JwtAuthGuard } from "./guard/jwt/auth-jwt-guard"

export const coreModule = {
	redisCache: RedisCacheModule,
	database: DatabaseModule,
	log: LogModule,
	noToken: NoTokenModule,
	appCls: ApplicationCls,
	authJwt: JwtStrategyModule,
}

export const coreGuard = {
	authJwt: JwtAuthGuard,
}
