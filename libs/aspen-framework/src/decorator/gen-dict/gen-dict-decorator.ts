import { Injectable, OnModuleInit, SetMetadata, Type, Inject } from "@nestjs/common"
import { DataSource, In } from "typeorm"

import { DecoratorKey, AbstractEnumGroup } from "@aspen/aspen-core"
import { GEN_DICT_MODULE_OPTIONS, GenDictModuleOptions } from "./gen-dict-module"

import { GenDictRegistry } from "./gen-dict-share"
import { FrameDictEntity, FrameDictItemEntity } from "@aspen/aspen-framework"

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

export const GenGroupDict = (options: GenDictOptions) => {
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
		// 查询所有枚举
		const genDictRegistry = GenDictRegistry.getInstance()
		const keys = genDictRegistry.getKeys()
		if (!keys.length) return

		const repository = this.dataSource.getRepository(FrameDictEntity)
		// 查询数据库里所有自动创建的枚举
		const sqlDictList = await repository.find({
			where: {
				genType: "1",
			},
			relations: ["dictList"],
		})
		const savedictList: Array<FrameDictEntity> = []
		for (const key of keys) {
			const matedata = genDictRegistry.get(key)
			const instance = new key()
			const property = Object.getOwnPropertyDescriptors(instance)
			if (!matedata || !property) continue
			if (!(instance instanceof AbstractEnumGroup)) continue

			const _dictGroupList = instance.list
			if (!_dictGroupList.length) continue
			for (const dictGroup of _dictGroupList) {
				const { code, summary, enum: enumObj } = dictGroup
				const enumItems = enumObj.items
				if (!enumItems.length) continue

				const fullDictCode = `${matedata.key}_${code}`
				const sqlDict = sqlDictList.find((item) => item.code === fullDictCode)
				const sqlDictItemList = sqlDict?.dictList || []

				const dictEntity = new FrameDictEntity()
				dictEntity.code = fullDictCode
				dictEntity.summary = summary
				dictEntity.genType = "1"
				dictEntity.sort = 0

				dictEntity.dictList = enumItems.map((item) => {
					const _code = (item.raw as any).code ?? null
					const _summary = (item.raw as any).summary ?? null
					if (!_code && !_summary) return
					const existDictItem = sqlDictItemList.find((dictItem) => dictItem.code === _code)

					const dictItemEntity = new FrameDictItemEntity()
					dictItemEntity.code = existDictItem?.code ?? _code
					dictItemEntity.summary = existDictItem?.summary ?? _summary
					dictItemEntity.hexColor = existDictItem?.hexColor ?? null
					dictItemEntity.sort = existDictItem?.sort ?? 0
					return dictItemEntity
				})
				savedictList.push(dictEntity)
			}
		}
		await repository.delete({ genType: "1" })
		await repository.save(savedictList)
	}
}
