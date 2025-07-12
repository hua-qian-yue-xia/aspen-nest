import { Global, Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { registerAuthJwt } from "./auth-jwt-module"
import { JwtStrategy } from "./auth-jwt-strategy"

import { RedisTool, registerRedis } from "@aspen/aspen-core"

export * from "./auth-jwt-strategy"

@Global()
@Module({
	imports: [PassportModule, registerAuthJwt(), registerRedis()],
	providers: [JwtStrategy, RedisTool],
	exports: [JwtStrategy, RedisTool],
})
export class AspenFrameworkJwtStrategyModule {}
