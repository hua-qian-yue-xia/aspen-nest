import { NestFactory } from "@nestjs/core"
import { ConfigService } from "@nestjs/config"
import { ValidationPipe } from "@nestjs/common"
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify"

import { App, Application, doc } from "packages/aspen-core/src"

import { AppModule } from "./app-module"

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
	const config: ConfigService<Application, true> = app.get(ConfigService)
	const appConfig = config.get<App>("app")
	// 配置全局路由前缀
	app.setGlobalPrefix(appConfig.prefix)
	// 配置全局校验管道
	app.useGlobalPipes(new ValidationPipe({ transform: true }))
	// 配置swagger文档
	doc.registerSwaggerDoc(app, { title: "aspen-nest后台服务文档" })
	await app.listen(appConfig.port)
}

bootstrap().then(() => console.log("服务端已启动"))
