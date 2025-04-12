import { INestApplication } from "@nestjs/common"

import { ClsService } from "nestjs-cls"
import * as _ from "radash"

import { BaseAdminUser, RedisTool, BasePage } from "../index"

export class AppCtx {
	private static instance: AppCtx

	private static app: INestApplication

	private constructor() {}

	static getInstance(): AppCtx {
		if (!AppCtx.instance) {
			AppCtx.instance = new AppCtx()
		}
		return AppCtx.instance
	}

	setApp(app: INestApplication) {
		AppCtx.app = app
	}

	getApp(): INestApplication {
		if (!AppCtx.app) throw new Error("获取上下文错误")
		return AppCtx.app
	}

	getClsService(): Promise<ClsService> {
		return AppCtx.getInstance().getApp().resolve(ClsService)
	}

	getRedisTool(): Promise<RedisTool> {
		return AppCtx.getInstance().getApp().resolve(RedisTool)
	}

	/**
	 * 获取当前分页
	 * get请求默认从params中获取
	 * post请求默认从body中获取
	 *
	 *  @return BasePage
	 */
	async getPage(): Promise<BasePage> {
		const clsService = await AppCtx.getInstance().getClsService()
		return clsService.get<BasePage>("page")
	}

	/**
	 * 获取当前登录用户
	 *
	 * @returns BaseUser?
	 */
	async getLoginAdminUser(): Promise<BaseAdminUser | null> {
		const clsService = await AppCtx.getInstance().getClsService()
		const token = clsService.get<string | undefined>("token")
		if (_.isEmpty(token)) return null
		// 从redis查询用户信息
		const redisTool = await AppCtx.getInstance().getApp().resolve(RedisTool)
		const userJson = await redisTool.get(token)
		if (_.isEmpty(userJson)) return null
		return JSON.parse(userJson) as BaseAdminUser
	}

	/**
	 * 更具当前用户获取包装对应数据权限的sql
	 *
	 * @param sql
	 * @returns string?
	 */
	async getLoginUserDataScope(sql: string): Promise<string | null> {
		const loginUser = await AppCtx.instance.getLoginAdminUser()
		if (!loginUser) return null
		return sql
	}
}
