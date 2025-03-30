import { Global, Module } from "@nestjs/common"
import { DiscoveryService, MetadataScanner } from "@nestjs/core"

import { AspenGet, AspenPost, AspenPut, AspenDelete, AspenPatch } from "libs/aspen-core/src/decorator/req-decorator"
import { NoTokenService } from "libs/aspen-core/src/decorator/no-token-decorator"

/******************** start app start ********************/
export { AppCtx } from "libs/aspen-core/src/app/app-ctx"
export { AppClsModule } from "libs/aspen-core/src/app/app-cls"
/******************** end app end ********************/

/******************** start base start ********************/
export { BaseDb, BaseRecordDb } from "libs/aspen-core/src/base/base-db"
export { BasePage, BasePageVo, BasePageTool } from "libs/aspen-core/src/base/base-page"
export { BaseAdminUser } from "libs/aspen-core/src/base/base-user"
/******************** end base end ********************/

/******************** start doc start ********************/
export { registerSwaggerDoc } from "libs/aspen-core/src/doc/swagger"
/******************** end doc end ********************/

/******************** start config start ********************/
export { readActiveYamlFile } from "libs/aspen-core/src/config/read-config"
export type { Application, AppConfig, RedisConfig } from "libs/aspen-core/src/config/read-config"
/******************** end config end ********************/

/******************** start cache start ********************/
export { registerRedis } from "libs/aspen-core/src/cache/redis-service"
export { RedisTool } from "libs/aspen-core/src/cache/redis-tool"
/******************** start cache start ********************/

export * from "libs/aspen-core/src/constant/decorator-constant"

/******************** start 装饰器 start ********************/

export const router = {
	get: AspenGet,
	post: AspenPost,
	put: AspenPut,
	delete: AspenDelete,
	patch: AspenPatch,
}

@Global()
@Module({ providers: [NoTokenService, DiscoveryService, MetadataScanner], exports: [NoTokenService] })
export class AspenCoreModule {}
