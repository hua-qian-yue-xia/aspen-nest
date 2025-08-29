import { Global, Module } from "@nestjs/common"
import { DiscoveryService, MetadataScanner, Reflector } from "@nestjs/core"

import { NoTokenService } from "./no-token-decorator"

export type NoTokenModuleOptions = {
	/**
	 * 是否全局模块
	 * @default true
	 */
	isGlobal?: boolean
}

@Global()
@Module({})
export class NoTokenModule {
	static forRoot(options: NoTokenModuleOptions) {
		return {
			module: NoTokenModule,
			global: options.isGlobal ?? true,
			providers: [NoTokenService, DiscoveryService, MetadataScanner, Reflector],
			exports: [NoTokenService],
		}
	}
}
