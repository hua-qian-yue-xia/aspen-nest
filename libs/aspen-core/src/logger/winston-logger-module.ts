import { Module, Global } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { createWinstonLogger } from "./winston-logger"

export const WINSTON_INSTANCE = "WINSTON_INSTANCE"

@Global()
@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: WINSTON_INSTANCE,
			useFactory: (configService: ConfigService) => {
				const appCfg = configService.get<GlobalConfig.AppConfig>("app")
				const loggerCfg = configService.get<GlobalConfig.LoggerConfig>("logger")
				return createWinstonLogger(appCfg, loggerCfg)
			},
			inject: [ConfigService],
		},
	],
	exports: [WINSTON_INSTANCE],
})
export class WinstonLoggerModule {}
