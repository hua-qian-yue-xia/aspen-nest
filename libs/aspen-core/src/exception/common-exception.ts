import { HttpException, HttpStatus } from "@nestjs/common"

/**
 * 运行时异常
 * 代码执行错误、如参数不合法、数据重复等返回http状态码为500
 */
export class RuntimeException extends HttpException {
	constructor(msg?: string) {
		super(msg, HttpStatus.INTERNAL_SERVER_ERROR)
	}
}
