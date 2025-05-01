import { Global, Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"

import { registerAuthJwt } from "./auth-jwt-module"
import { JwtStrategy } from "./auth-jwt-strategy"

export * from "./auth-jwt-strategy"

@Global()
@Module({
	imports: [PassportModule, registerAuthJwt()],
	providers: [JwtStrategy],
	exports: [JwtStrategy],
})
export class AspenFrameworkJwtStrategyModule {}
