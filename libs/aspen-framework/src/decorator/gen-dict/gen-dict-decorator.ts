import * as glob from "glob"
import * as path from "path"

import { Injectable, OnModuleInit, SetMetadata, Type, Inject } from "@nestjs/common"
import { DataSource, In } from "typeorm"

import { DecoratorKey, tool, BaseEnum } from "@aspen/aspen-core"
import { GEN_DICT_MODULE_OPTIONS, GenDictModuleOptions } from "./gen-dict-module"

import { GenDictRegistry } from "./gen-dict-share"
import { FrameDictEntity } from "@aspen/aspen-framework/entity/frame-dict-entity"
import { FrameDictItemEntity } from "@aspen/aspen-framework/entity/frame-dict-item-entity"

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
	constructor(
		@Inject(GEN_DICT_MODULE_OPTIONS) private readonly options: GenDictModuleOptions,
		private readonly dataSource: DataSource,
	) {}

	onModuleInit(): void {
		this.getEnumList()
	}

	async getEnumList() {
		// 加载枚举文件
		const list = glob.sync(this.options.scanPatterns, {
			ignore: this.options.excludePatterns,
		})
		for (const v of list) {
			await tool.file.autoImport(path.resolve(v))
		}
		// 查询所有枚举
		const genDictRegistry = GenDictRegistry.getInstance()
		const keys = genDictRegistry.getKeys()
		if (!keys.length) return
		const dictList: Array<FrameDictEntity> = []
		for (const key of keys) {
			const matedata = genDictRegistry.get(key)
			const instance = new key()
			const property = Object.getOwnPropertyDescriptors(instance)
			if (!matedata || !property) continue

			// 判断是否继承自 BaseEnum
			if (instance instanceof BaseEnum) {
				// 处理 BaseEnum 类型的枚举
				const enumValues = instance.getValues()
				// 创建字典实体对象，只设置必要的属性
				const dictEntity = new FrameDictEntity()
				dictEntity.code = matedata.key
				dictEntity.summary = matedata.summary
				dictEntity.genType = "1"
				dictEntity.sort = 0
				dictEntity.dictList = enumValues.map((item) => {
					const dictItemEntity = new FrameDictItemEntity()
					dictItemEntity.code = item.code
					dictItemEntity.summary = item.summary
					dictItemEntity.sort = item.order
					return dictItemEntity
				})
				dictList.push(dictEntity)
			}
		}
		const repository = this.dataSource.getRepository(FrameDictEntity)
		await repository.delete({ genType: "1" })
		await repository.save(dictList)
	}
}
