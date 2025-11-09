import { INestApplication, Type } from "@nestjs/common"

import { ClsService } from "nestjs-cls"
import * as _ from "radash"

import { exception } from "../exception/common-exception"

import { BaseUser, RedisTool, BasePage } from "../index"

/**
 * 应用上下文
 */
export class ApplicationCtx {
	private static instance: ApplicationCtx

	private static app: INestApplication

	private constructor() {}

	static getInstance(): ApplicationCtx {
		if (!ApplicationCtx.instance) {
			ApplicationCtx.instance = new ApplicationCtx()
		}
		return ApplicationCtx.instance
	}

	setApp(app: INestApplication) {
		ApplicationCtx.app = app
	}

	/**
	 * 获取应用上下文实例
	 */
	getApp(): INestApplication {
		if (!ApplicationCtx.app) throw new exception.core("|应用上下文|,获取上下文错误")
		return ApplicationCtx.app
	}

	get<T>(typeOrToken: any): Promise<T> {
		return ApplicationCtx.getInstance().getApp().resolve(typeOrToken)
	}

	getClsService(): Promise<ClsService> {
		return ApplicationCtx.getInstance().getApp().resolve(ClsService)
	}

	getRedisTool(): Promise<RedisTool> {
		return ApplicationCtx.getInstance().getApp().resolve(RedisTool)
	}

	/**
	 * 获取当前分页
	 * get请求默认从params中获取
	 * post请求默认从body中获取
	 *
	 *  @return BasePage
	 */
	async getPage(): Promise<BasePage> {
		const clsService = await ApplicationCtx.getInstance().getClsService()
		return clsService.get<BasePage>("page")
	}

	/**
	 * 获取当前登录用户
	 * @returns BaseUser?
	 */
	async getLoginAdminUser(): Promise<BaseUser | null> {
		const clsService = await ApplicationCtx.getInstance().getClsService()
		const token = clsService.get<string | undefined>("token")
		if (_.isEmpty(token)) return null
		// 从redis查询用户信息
		const redisTool = await ApplicationCtx.getInstance().getApp().resolve(RedisTool)
		const userJson = await redisTool.get(token)
		if (_.isEmpty(userJson)) return null
		return JSON.parse(userJson) as BaseUser
	}

	/**
	 * 更具当前用户获取包装对应数据权限的sql
	 *
	 * @param sql
	 * @returns string?
	 */
	async getLoginUserDataScope(sql: string): Promise<string | null> {
		const loginUser = await ApplicationCtx.instance.getLoginAdminUser()
		if (!loginUser) return null
		return sql
	}
}
