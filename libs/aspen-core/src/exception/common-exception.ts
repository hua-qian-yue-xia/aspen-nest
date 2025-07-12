import { HttpException, HttpStatus } from "@nestjs/common"

/**
 * 运行时异常
 * 代码执行错误、意外的错误
 */
class RuntimeException extends HttpException {
	constructor(msg?: string) {
		super(msg, HttpStatus.INTERNAL_SERVER_ERROR)
	}
}

/**
 * 校验错误
 * 参数校验失败等、如数据不存在、数据重复等
 */
class ValidatorException extends HttpException {
	constructor(msg?: string) {
		super(msg, HttpStatus.NOT_FOUND)
	}
}

export default {
	runtime: RuntimeException,
	validator: ValidatorException,
}
