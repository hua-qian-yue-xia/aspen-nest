import { AspenGet, AspenPost, AspenPut, AspenDelete, AspenPatch } from "packages/aspen-core/src/decorator/req-decorator"

import { registerSwaggerDoc } from "packages/aspen-core/src/doc/swagger"

import { readActiveYamlFile } from "packages/aspen-core/src/config/read-config"
import type { Application, App } from "packages/aspen-core/src/config/read-config"

/******************** start 装饰器 start ********************/

export const router = {
	get: AspenGet,
	post: AspenPost,
	put: AspenPut,
	delete: AspenDelete,
	patch: AspenPatch,
}

/******************** end 装饰器 end ********************/

/******************** start 文档相关 start ********************/

export const doc = { registerSwaggerDoc }

export type { Application, App }

/******************** start 文档相关 start ********************/

/******************** start 配置相关 start ********************/

export const config = { readActiveYamlFile }

/******************** end 配置相关 end ********************/
