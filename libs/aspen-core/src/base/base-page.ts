import { ApiProperty } from "@nestjs/swagger"

import { FastifyRequest } from "fastify"

export class BasePage {
	static DEFAULT_PAGE: number = 1
	static DEFAULT_PAGE_SIZE: number = 10

	static MAX_PAGE_SIZE: number = 100

	/**
	 * 当前页码
	 */
	@ApiProperty({
		description: "当前页码",
		default: BasePage.DEFAULT_PAGE,
	})
	page: number = BasePage.DEFAULT_PAGE

	/**
	 * 分页大小
	 */
	@ApiProperty({
		description: "分页大小",
		default: BasePage.DEFAULT_PAGE_SIZE,
	})
	pageSize: number = BasePage.DEFAULT_PAGE_SIZE

	static default(): BasePage {
		return {
			page: BasePage.DEFAULT_PAGE,
			pageSize: BasePage.DEFAULT_PAGE_SIZE,
		}
	}
}

export class BasePageVo extends BasePage {
	/**
	 * 总页数
	 */
	@ApiProperty({
		description: "总页数",
		default: 0,
	})
	totalPage: number = 0
	/**
	 * 总记录数
	 */
	@ApiProperty({
		description: "总记录数",
		default: 0,
	})
	totalRecord: number = 0
	/**
	 * 数据列表
	 */
	records: Array<any> = []
}

export class BasePageTool {
	private static isValidNumber(value: any): boolean {
		return !isNaN(Number(value)) && typeof value !== "boolean"
	}

	private static getParamValue(req: FastifyRequest, key: string): number {
		const queryValue = req.query != null ? req.query[key] : NaN
		const bodyValue = req.body != null ? req.body[key] : NaN
		const value = queryValue !== undefined ? queryValue : bodyValue
		if (BasePageTool.isValidNumber(value)) {
			return Number(value)
		}
		return NaN
	}

	/**
	 * 获取分页信息
	 * 先从请求参数中获取，如果获取不到，则从body中获取
	 * @param req fastify请求对象
	 * @return BasePage
	 */
	static getPageByReq(req: FastifyRequest): BasePage {
		if (!req.query && !req.body) {
			return BasePage.default()
		}
		const page = BasePageTool.getParamValue(req, "page") || BasePage.DEFAULT_PAGE
		let pageSize = BasePageTool.getParamValue(req, "pageSize") || BasePage.DEFAULT_PAGE_SIZE
		if (pageSize > BasePage.MAX_PAGE_SIZE) {
			pageSize = BasePage.MAX_PAGE_SIZE
		}
		return {
			page,
			pageSize,
		}
	}
}
