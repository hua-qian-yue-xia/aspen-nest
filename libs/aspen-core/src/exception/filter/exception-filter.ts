import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common"
import { FastifyRequest, FastifyReply } from "fastify"

import { RuntimeException, R } from "@aspen/aspen-core"

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	private logger: Logger

	constructor() {
		this.logger = new Logger(HttpExceptionFilter.name)
	}

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<FastifyReply>()
		const request = ctx.getRequest<FastifyRequest>()
		const status = exception.getStatus()

		let result: R<any> = R.fail(exception.message)
		if (exception instanceof RuntimeException) {
			result = R.warn(exception.message)
			this.logger.warn(`请求异常:path<${request.url}>msg<${exception.message}>stack<${exception.stack}>`)
		}

		response.status(status).send(result)
	}
}
