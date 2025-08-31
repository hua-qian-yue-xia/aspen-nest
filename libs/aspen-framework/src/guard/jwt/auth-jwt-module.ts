import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import * as _ from "radash"
import * as ms from "ms"

import { Application, JwtConfig, exception } from "@aspen/aspen-core"

import { JwtError } from "./common/error"

export const registerAuthJwt = () => {
	return JwtModule.registerAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: (config: ConfigService<Application, true>) => {
			const { secret, expiresIn = "1D" } = config.get<JwtConfig>("jwt")
			if (_.isEmpty(secret)) throw new exception.core(JwtError.JWT_SECRET_NOT_FOUND)
			return {
				secret: secret,
				signOptions: {
					expiresIn: ms(expiresIn),
				},
			}
		},
	})
}
