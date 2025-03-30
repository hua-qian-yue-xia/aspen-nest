interface BaseEnumInterface {
	code: string
	desc: string
}

export class BaseEnum implements BaseEnumInterface {
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
