import { Module } from "@nestjs/common"

import { ConfigModule, ConfigFactory, ConfigService } from "@nestjs/config"

import { ApplicationCls } from "./application-cls"
import { WinstonLogger } from "../logger/winston-logger"
import { WinstonLoggerModule, WINSTON_INSTANCE } from "../logger/winston-logger-module"
import { DatabaseModule } from "../database/database-module"
import { RedisCacheModule } from "../cache/redis-module"
import { LogModule } from "../decorator/log/log-module"
import { NoTokenModule } from "../decorator/no-token/no-token-module"

@Module({})
export class ApplicationModule {
	static forRoot(load: Array<ConfigFactory | Record<string, any>>, rootModule: any) {
		// 规范化 load：允许传对象，内部包裹成工厂函数
		const normalized = load.map((l: any) => (typeof l === "function" ? l : () => l))
		return {
			module: rootModule,
			imports: [
				// 引入配置模块(全局)
				ConfigModule.forRoot({ load: normalized as ConfigFactory[], isGlobal: true, cache: true }),
				// 引入 CLS 模块(全局)
				ApplicationCls.forRoot({ isGlobal: true }),
				// 引入数据库模块(全局)
				DatabaseModule.forRoot({ isGlobal: true, entityPattern: `${process.cwd()}/dist/**/*-entity{.ts,.js}` }),
				// 引入Redis缓存模块(全局)
				RedisCacheModule.forRoot({ isGlobal: true }),
				// 引入日志模块(全局)
				LogModule.forRoot({ isGlobal: true }),
				// 引入无Token模块(全局)
				NoTokenModule.forRoot({ isGlobal: true }),
				// 引入共享日志模块(全局)
				WinstonLoggerModule,
			],
			providers: [
				{
					provide: WinstonLogger,
					useFactory: (win: any) => new WinstonLogger(win),
					inject: [WINSTON_INSTANCE],
				},
			],
			exports: [WinstonLogger],
		}
	}
}
