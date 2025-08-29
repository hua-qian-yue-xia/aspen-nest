import { DynamicModule, Global, Module } from "@nestjs/common"

import { GenDictService } from "./gen-dict-decorator"

// 注入令牌
export const GEN_DICT_MODULE_OPTIONS = "GEN_DICT_MODULE_OPTIONS"

/**
 * 动态模块配置选项
 */
export type GenDictModuleOptions = {
	/**
	 * 是否全局模块
	 * @default true
	 */
	isGlobal?: boolean

	/**
	 * 扫描路径模式
	 */
	scanPatterns: string[]

	/**
	 * 排除路径模式
	 * @default []
	 */
	excludePatterns?: string[]
}

/**
 * GenDict 动态模块
 */

// **/dist/**/*.enum-gen.js
@Global()
@Module({})
export class GenDictModule {
	static forRoot(options: GenDictModuleOptions): DynamicModule {
		return {
			module: GenDictModule,
			global: options.isGlobal ?? true,
			providers: [
				{
					provide: GEN_DICT_MODULE_OPTIONS,
					useValue: options,
				},
				GenDictService,
			],
			exports: [GenDictService, GEN_DICT_MODULE_OPTIONS],
		}
	}
}
