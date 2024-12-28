import { NestFactory } from "@nestjs/core"
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify"

import { doc } from "packages/aspen-core/src"

import { AppModule } from "./app-module"

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
	doc.registerSwaggerDoc(app, { title: "aspen-nest后台服务文档" })
	await app.listen(7012)
}

bootstrap().then(() => console.log("服务端已启动"))
