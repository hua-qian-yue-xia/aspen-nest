import { Delete, Get, Patch, Post, Put } from "@nestjs/common"

export type ReqTag = "OTHER" | "INSERT" | "UPDATE" | "DELETE" | "GRANT" | "EXPORT" | "IMPORT" | "GENERATE" | "ADMIN"

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
	Log = "aspen_log",
	/**
	 * 重复提交
	 */
	RepeatSubmit = "aspen_repeat_submit",
	/**
	 * 限流
	 */
	RateLimit = "aspen_rate_limit",
	/**
	 * 免token鉴权
	 */
	NoToken = "aspen_no_token",
	/**
	 * redis缓存
	 */
	Cache = "aspen_cache",
	/**
	 * 生成字典
	 */
	GenDict = "gen_dict",
}
