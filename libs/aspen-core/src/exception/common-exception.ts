import { HttpException, HttpStatus } from "@nestjs/common"

/**
 * 运行时异常
 * 代码执行错误、如用户不存在等
 */
export class RuntimeException extends HttpException {
	constructor(msg?: string) {
		super(msg, HttpStatus.INTERNAL_SERVER_ERROR)
	}
}

/**
 * 校验错误
 * 参数校验失败等
 */
export class ValidatorException extends HttpException {
	constructor(msg?: string) {
		super(msg, HttpStatus.NOT_FOUND)
	}
}
