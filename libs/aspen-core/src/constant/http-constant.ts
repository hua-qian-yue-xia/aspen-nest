/**
 * 限流策略
 * - DEFAULT 默认策略全局限流
 * - IP 根据请求者IP进行限流
 */
export type HttpLimit = "DEFAULT" | "IP"

/**
 * 返回状态码
 */
export enum HttpCodeEnum {
	/**
	 * 成功
	 */
	SUCCESS = 200,
	/**
	 * 参数列表错误（缺少，格式不匹配）
	 */
	BAD_REQUEST = 400,
	/**
	 * 未授权
	 */
	UNAUTHORIZED = 401,
	/**
	 * 访问受限，授权过期
	 */
	FORBIDDEN = 403,
	/**
	 * 资源，服务未找到
	 */
	NOT_FOUND = 404,
	/**
	 * 请求超时
	 */
	REQUEST_TIMEOUT = 408,
	/**
	 * 系统内部错误
	 */
	ERROR = 500,
	/**
	 * 接口未实现
	 */
	NOT_IMPLEMENTED = 501,
	/**
	 * 系统警告消息
	 * 前端会显示消息
	 */
	WARN = 601,
}
