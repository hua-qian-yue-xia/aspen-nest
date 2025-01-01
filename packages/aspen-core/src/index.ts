import { Global, Module } from "@nestjs/common"
import { DiscoveryService, MetadataScanner } from "@nestjs/core"

import { AspenGet, AspenPost, AspenPut, AspenDelete, AspenPatch } from "packages/aspen-core/src/decorator/req-decorator"
import { NoTokenService } from "packages/aspen-core/src/decorator/no-token-decorator"

export { registerSwaggerDoc } from "packages/aspen-core/src/doc/swagger"

export { readActiveYamlFile } from "packages/aspen-core/src/config/read-config"
export type { Application, AppConfig, RedisConfig } from "packages/aspen-core/src/config/read-config"

export { registerRedis } from "packages/aspen-core/src/cache/redis-service"
export { RedisTool } from "packages/aspen-core/src/cache/redis-tool"

export * from "packages/aspen-core/src/constant/decorator-constant"

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
