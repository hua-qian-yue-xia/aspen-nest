import { Module } from "@nestjs/common"
import { APP_INTERCEPTOR, DiscoveryService, MetadataScanner } from "@nestjs/core"
import { TypeOrmModule } from "@nestjs/typeorm"

import { NoTokenService } from "./decorator/no-token-decorator"
import { AspenLogInterceptor } from "./decorator/log-decorator"

/******************** start app start ********************/
export { AppCtx } from "libs/aspen-core/src/app/app-ctx"
export { AppClsModule } from "libs/aspen-core/src/app/app-cls"
/******************** end app end ********************/

/******************** start base start ********************/
export { BaseDb, BaseRecordDb } from "libs/aspen-core/src/base/base-db"
export { BasePage, BasePageVo, BasePageTool } from "libs/aspen-core/src/base/base-page"
export { R } from "libs/aspen-core/src/base/base-result"
export { BaseUser } from "libs/aspen-core/src/base/base-user"
/******************** end base end ********************/

/******************** start doc start ********************/
export { registerSwaggerDoc } from "libs/aspen-core/src/doc/swagger"
/******************** end doc end ********************/

/******************** start entity start ********************/
export * from "libs/aspen-core/src/entity"
/******************** end entity end ********************/

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
export * from "@aspen/aspen-core/database/tool/orm-query-tool"
export * from "@aspen/aspen-core/database/database-module"
/******************** end database end ********************/

/******************** start 装饰器 start ********************/
export * from "@aspen/aspen-core/decorator/cache-decorator"
export * from "@aspen/aspen-core/decorator/log-decorator"
export * from "@aspen/aspen-core/decorator/req-decorator"
export * from "@aspen/aspen-core/constant/group-constant"
export * from "@aspen/aspen-core/constant/decorator-constant"
export * from "@aspen/aspen-core/decorator/validator-decorator"
/******************** end 装饰器 end ********************/

/******************** start 异常 start ********************/
export * from "@aspen/aspen-core/exception/filter/exception-filter"
export * from "@aspen/aspen-core/exception/common-exception"
/******************** end 异常 end ********************/

/******************** start 管道 start ********************/

/******************** end 管道 end ********************/

@Module({
	imports: [TypeOrmModule],
	providers: [
		NoTokenService,
		DiscoveryService,
		MetadataScanner,
		{
			provide: APP_INTERCEPTOR,
			useClass: AspenLogInterceptor,
		},
	],
	exports: [NoTokenService, TypeOrmModule],
})
export class AspenCoreModule {}
