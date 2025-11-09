import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, Logger } from "@nestjs/common"
import { FastifyReply, FastifyRequest } from "fastify"

import { R } from "@aspen/aspen-core"

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
	private logger: Logger

	constructor() {
		this.logger = new Logger(ValidationExceptionFilter.name)
	}

	catch(exception: BadRequestException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<FastifyReply>()
		const request = ctx.getRequest<FastifyRequest>()
		const status = exception.getStatus()

		const exceptionResp = exception.getResponse() as any
		const messages: string[] = []
		const errors: Array<{ property?: string; constraints?: string[] }> = []

		// 兼容两种形态：默认 ValidationPipe（message 为 string[]）或自定义 exceptionFactory（message 为 ValidationError[]）
		const payload = exceptionResp?.message
		if (Array.isArray(payload)) {
			for (const item of payload) {
				if (typeof item === "string") {
					messages.push(item)
				} else if (item && typeof item === "object") {
					const property = item.property
					const constraintsObj = item.constraints
					const constraintList = constraintsObj ? (Object.values(constraintsObj) as string[]) : []
					if (constraintList.length) messages.push(`${property}: ${constraintList.join(", ")}`)
					errors.push({ property, constraints: constraintList })
				}
			}
		} else if (typeof payload === "string") {
			messages.push(payload)
		}

		const result = R.warn("参数验证失败")

		this.logger.warn(
			`参数校验异常:path<${request.url}>status<${status}>msg<${messages.join(";")}>stack<${exception.stack}>`,
		)

		response.status(status).send(result)
	}
}
