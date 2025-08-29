type BaseEnumOptions = {
	/**
	 * 枚举值
	 */
	code: string
	/**
	 * 枚举描述
	 */
	summary: string
	/**
	 * 枚举排序
	 * @default 0
	 */
	order?: number
}

export class BaseEnum {
	readonly [key: string]: BaseEnumOptions

	// @ts-ignore
	getAll(): Array<BaseEnumOptions> {
		return Object.values(this)
	}

	// @ts-ignore
	getByCode(code: string): BaseEnumOptions | null {
		return this.getAll().find((item) => item.code === code) ?? null
	}

	// @ts-ignore
	getByCodes(codes: Array<string>): Array<BaseEnumOptions> {
		return this.getAll().filter((item) => codes.includes(item.code))
	}

	// @ts-ignore
	getBySummary(summary: string): BaseEnumOptions | null {
		return this.getAll().find((item) => item.summary === summary) ?? null
	}

	// @ts-ignore
	getBySummarys(summaries: Array<string>): Array<BaseEnumOptions> {
		return this.getAll().filter((item) => summaries.includes(item.summary))
	}
}
