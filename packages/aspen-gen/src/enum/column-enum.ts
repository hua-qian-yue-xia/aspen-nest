class BaseEnum {
	code: string
	desc: string

	private constructor(code: string, desc: string) {
		this.code = code
		this.desc = desc
	}

	static of(code: string, desc: string): BaseEnum {
		return new BaseEnum(code, desc)
	}
}

export abstract class ColumnRelationEnum {
	static ONE_TO_ONE: BaseEnum = BaseEnum.of("10", "一对一")
	static ONE_TO_MANY: BaseEnum = BaseEnum.of("20", "一对多")
	static MANY_TO_MANY: BaseEnum = BaseEnum.of("30", "多对多")
}

export abstract class ColumnGroupEnum {
	PRIMARY_FIELD: BaseEnum = BaseEnum.of("10", "主外键字段")
	RELATION_FIELD: BaseEnum = BaseEnum.of("20", "关系字段")
	DEFAULT_FIELD: BaseEnum = BaseEnum.of("30", "普通字段")
	SYS_FIELD: BaseEnum = BaseEnum.of("40", "系统字段")
}
