import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { Application, JwtConfig } from "@aspen/aspen-core"
import { Logger } from "@nestjs/common"
import * as _ from "radash"

export const AUTH_JWT = "auth-jwt"

export const registerAuthJwt = () => {
	return JwtModule.registerAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: (config: ConfigService<Application, true>) => {
			const logger = new Logger(AUTH_JWT)
			const { secret } = config.get<JwtConfig>("database")
			if (_.isEmpty(secret)) {
				logger.warn("启用jwt passport错误,未配置secret")
				return null
			}
			return {
				secret: secret,
				signOptions: {
					expiresIn: "60s",
				},
			}
		},
	})
}
