import * as glob from "glob"
import * as path from "path"

import { Injectable, OnModuleInit, SetMetadata, Type, Inject } from "@nestjs/common"

import { DecoratorKey, tool } from "@aspen/aspen-core"
import { GEN_DICT_MODULE_OPTIONS, GenDictModuleOptions } from "./gen-dict-module"

import { GenDictRegistry } from "./gen-dict-share"

/******************** start type start ********************/

export type GenDictOptions = {
	/**
	 * 字段唯一key
	 */
	key: string

	/**
	 * 字典主要描述
	 */
	summary: string

	/**
	 * 字典排序
	 * @default 0
	 */
	order?: number
}

/******************** end type end ********************/

export const GenDict = (options: GenDictOptions) => {
	return function (target: Type) {
		const _options = { ...options, order: options.order ?? 0 }
		SetMetadata(DecoratorKey.GenDict, _options)(target)
		GenDictRegistry.getInstance().set(target, _options)
		return target
	}
}

@Injectable()
export class GenDictService implements OnModuleInit {
	constructor(@Inject(GEN_DICT_MODULE_OPTIONS) private readonly options: GenDictModuleOptions) {}

	onModuleInit(): void {
		this.getEnumList()
	}

	async getEnumList() {
		// 加载枚举文件
		const list = glob.sync(this.options.scanPatterns, {
			ignore: this.options.excludePatterns,
		})
		console.log(list)

		for (const v of list) {
			await tool.file.autoImport(path.resolve(v))
		}
		// 查询所有枚举
		const genDictRegistry = GenDictRegistry.getInstance()
		const keys = genDictRegistry.getKeys()
		if (!keys.length) return
		for (const key of keys) {
			const matedata = genDictRegistry.get(key)
			const property = Object.getOwnPropertyDescriptors(new key())
			if (!matedata || !property) continue
		}
	}
}
