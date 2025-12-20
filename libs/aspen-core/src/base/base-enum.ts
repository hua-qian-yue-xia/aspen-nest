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
	getValues(): Array<BaseEnumOptions> {
		return Object.values(this)
	}

	// @ts-ignore
	getKeys(): Array<string> {
		return Object.keys(this)
	}

	// @ts-ignore
	getCodes(): Array<string> {
		return this.getKeys().map((key) => this[key].code)
	}

	// @ts-ignore
	getByCode(code: string): BaseEnumOptions | null {
		return this.getValues().find((item) => item.code === code) ?? null
	}

	// @ts-ignore
	getByCodes(codes: Array<string>): Array<BaseEnumOptions> {
		return this.getValues().filter((item) => codes.includes(item.code))
	}

	// @ts-ignore
	getBySummary(summary: string): BaseEnumOptions | null {
		return this.getValues().find((item) => item.summary === summary) ?? null
	}

	// @ts-ignore
	getBySummarys(summaries: Array<string>): Array<BaseEnumOptions> {
		return this.getValues().filter((item) => summaries.includes(item.summary))
	}
}
