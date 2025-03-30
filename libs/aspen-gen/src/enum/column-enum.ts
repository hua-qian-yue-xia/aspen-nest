class BaseEnumItem {
	code: string
	desc: string

	private constructor(code: string, desc: string) {
		this.code = code
		this.desc = desc
	}

	static of(code: string, desc: string): BaseEnumItem {
		return new BaseEnumItem(code, desc)
	}
}

export abstract class ColumnRelationEnum {
	static ONE_TO_ONE: BaseEnumItem = BaseEnumItem.of("10", "一对一")
	static ONE_TO_MANY: BaseEnumItem = BaseEnumItem.of("20", "一对多")
	static MANY_TO_MANY: BaseEnumItem = BaseEnumItem.of("30", "多对多")
}

export abstract class ColumnGroupEnum {
	PRIMARY_FIELD: BaseEnumItem = BaseEnumItem.of("10", "主外键字段")
	RELATION_FIELD: BaseEnumItem = BaseEnumItem.of("20", "关系字段")
	DEFAULT_FIELD: BaseEnumItem = BaseEnumItem.of("30", "普通字段")
	SYS_FIELD: BaseEnumItem = BaseEnumItem.of("40", "系统字段")
}
