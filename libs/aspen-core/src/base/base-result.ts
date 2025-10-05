import { ApiProperty } from "@nestjs/swagger"
import { HttpCodeEnum } from "libs/aspen-core/src/constant/http-constant"

/**
 * 响应结果
 */
export class R<T> extends Map<string, any> {
	@ApiProperty({
		description: "状态码",
	})
	private code: HttpCodeEnum

	@ApiProperty({
		description: "状态描述",
	})
	private msg: string

	@ApiProperty({
		description: "数据",
	})
	private data: T

	constructor(code: HttpCodeEnum, msg: string, data: T) {
		super()
		this.code = code
		this.msg = msg
		this.data = data
	}

	/**
	 * 成功
	 */
	static success(): R<null>
	static success<T>(msg: string): R<T>
	static success<T>(data: T): R<T>
	static success<T>(data?: T, msg?: string): R<T> | R<null> {
		if (msg != undefined && typeof msg == "string" && data == undefined) {
			return new R<null>(HttpCodeEnum.SUCCESS, msg, null)
		}
		if (data != undefined && msg == undefined) {
			return new R<T>(HttpCodeEnum.SUCCESS, "操作成功", data)
		}
		return new R<T>(HttpCodeEnum.SUCCESS, msg, data)
	}

	/**
	 * 失败
	 */
	static fail(): R<null>
	static fail<T>(data: T): R<T>
	static fail<T>(msg: string): R<T>
	static fail<T>(msg?: string, data?: T): R<T> | R<null> {
		if (msg == undefined && data == undefined) {
			return new R<null>(HttpCodeEnum.ERROR, "操作失败", null)
		}
		if (msg == undefined) {
			return new R<T>(HttpCodeEnum.ERROR, "操作失败", data)
		}
		if (data == undefined) {
			return new R<T>(HttpCodeEnum.ERROR, msg, null)
		}
		return new R<T>(HttpCodeEnum.ERROR, msg, data)
	}

	/**
	 * 警告
	 */
	static warn<T>(msg: string): R<T>
	static warn<T>(msg: string, data?: T): R<T> | R<null> {
		if (data == undefined) {
			return new R<T>(HttpCodeEnum.WARN, msg, null)
		}
		return new R<T>(HttpCodeEnum.ERROR, msg, data)
	}

	override set(key: string, value: any) {
		super.set(key, value)
		return this
	}
}
