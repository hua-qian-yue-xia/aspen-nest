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
export { R } from "libs/aspen-core/src/base/base-result"
export { BaseAdminUser } from "libs/aspen-core/src/base/base-user"
/******************** end base end ********************/

/******************** start doc start ********************/
export { registerSwaggerDoc } from "libs/aspen-core/src/doc/swagger"
/******************** end doc end ********************/

/******************** start config start ********************/
export { readActiveYamlFile } from "libs/aspen-core/src/config/read-config"
export type {
	Application,
	AppConfig,
	RedisConfig,
	DatabaseConfig,
	JwtConfig,
} from "libs/aspen-core/src/config/read-config"
/******************** end config end ********************/

/******************** start cache start ********************/
export * from "@aspen/aspen-core/cache/redis-module"
export * from "libs/aspen-core/src/cache/redis-tool"
/******************** end cache end ********************/

/******************** start database start ********************/
export * from "@aspen/aspen-core/database/common/common-column"
export * from "@aspen/aspen-core/database/extend/type-orm-extend"
export * from "@aspen/aspen-core/database/database-module"
/******************** end database end ********************/

/******************** start 装饰器 start ********************/
export * from "@aspen/aspen-core/decorator/cache-decorator"
export * from "libs/aspen-core/src/constant/group-constant"
export * from "libs/aspen-core/src/constant/decorator-constant"
export * from "libs/aspen-core/src/decorator/validator-decorator"
/******************** end 装饰器 end ********************/

/******************** start 异常 start ********************/
export * from "@aspen/aspen-core/exception/filter/exception-filter"
export * from "@aspen/aspen-core/exception/common-exception"
/******************** end 异常 end ********************/

/******************** start 管道 start ********************/

/******************** end 管道 end ********************/

export const router = {
	get: AspenGet,
	post: AspenPost,
	put: AspenPut,
	delete: AspenDelete,
	patch: AspenPatch,
}

@Global()
@Module({
	providers: [NoTokenService, DiscoveryService, MetadataScanner],
	exports: [NoTokenService],
})
export class AspenCoreModule {}
