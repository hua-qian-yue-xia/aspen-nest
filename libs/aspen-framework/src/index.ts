import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

export { JwtStrategy } from "libs/aspen-framework/src/guard/jwt/auth-jwt-strategy"

@Module({
	imports: [TypeOrmModule],
	providers: [],
	exports: [],
})
export class AspenFrameworkModule {}
