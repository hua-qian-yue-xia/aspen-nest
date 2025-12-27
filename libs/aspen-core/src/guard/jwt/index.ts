import { ConfigModule } from "@nestjs/config"
import { Global, Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { registerAuthJwt } from "./auth-jwt-module"
import { JwtStrategy } from "./auth-jwt-strategy"

import { RedisTool } from "@aspen/aspen-core"

export * from "./auth-jwt-strategy"

@Global()
@Module({})
export class JwtStrategyModule {
	static forRoot() {
		return {
			module: JwtStrategyModule,
			global: true,
			imports: [PassportModule, registerAuthJwt(), ConfigModule],
			providers: [JwtStrategy],
			exports: [JwtStrategy],
		}
	}
}
