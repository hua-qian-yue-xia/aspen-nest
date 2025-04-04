export type genEnumItemDecorator = {
	/**
	 * 枚举项唯一标识
	 */
	code: string
	/**
	 * 枚举类描述
	 */
	desc: string
}

export type genEnumDecorator = {
	/**
	 * 枚举的唯一标识
	 * @define enumName
	 */
	key: string
	/**
	 * 枚举的描述
	 */
	desc: string
}
