import { HttpException, HttpStatus } from "@nestjs/common"

/**
 * 核心异常
 * @description aspen-core等报错
 */
class CoreException extends HttpException {
	constructor(msg?: string) {
		super(msg, HttpStatus.OK)
	}
}

/**
 * 运行时异常
 * @description 代码执行错误、意外的错误
 */
class RuntimeException extends HttpException {
	constructor(msg?: string) {
		super(msg, HttpStatus.OK)
	}
}

/**
 * 校验错误
 * @description 参数校验失败等、如数据不存在、数据重复等
 */
class ValidatorException extends HttpException {
	constructor(msg?: string) {
		super(msg, HttpStatus.OK)
	}
}

export const exception = {
	core: CoreException,
	runtime: RuntimeException,
	validator: ValidatorException,
}
