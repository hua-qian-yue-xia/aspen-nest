import { Delete, Get, Patch, Post, Put } from "@nestjs/common"

export enum ReqTag {
	/**
	 * 其它
	 */
	OTHER = "OTHER",
	/**
	 * 新增
	 */
	INSERT = "INSERT",
	/**
	 * 修改
	 */
	UPDATE = "UPDATE",
	/**
	 * 删除
	 */
	DELETE = "DELETE",
	/**
	 * 授权
	 */
	GRANT = "GRANT",
	/**
	 * 导出
	 */
	EXPORT = "EXPORT",
	/**
	 * 导入
	 */
	IMPORT = "IMPORT",
	/**
	 * 强退
	 */
	FORCE = "FORCE",
	/**
	 * 生成代码
	 */
	GENERATE = "GENERATE",
	/**
	 * 清空数据
	 */
	CLEAN = "CLEAN",
}

export enum ReqMethod {
	Get = "GET",
	Post = "POST",
	Put = "PUT",
	Delete = "DELETE",
	Patch = "PATCH",
}

export const ReqMethodMap = {
	[ReqMethod.Get]: Get,
	[ReqMethod.Post]: Post,
	[ReqMethod.Put]: Put,
	[ReqMethod.Delete]: Delete,
	[ReqMethod.Patch]: Patch,
}

export enum DecoratorKey {
	/**
	 * 日志记录
	 */
	Log = "log",
	/**
	 * 重复提交
	 */
	RepeatSubmit = "repeat_submit",
	/**
	 * 限流
	 */
	RateLimit = "rate_limit",
	/**
	 * 免token鉴权
	 */
	NoToken = "no_token",
}
