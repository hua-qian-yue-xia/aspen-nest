import * as _ from "radash"
import * as ms from "ms"

import { AppCtx, RedisTool } from "@aspen/aspen-core"

type CacheKeyExpression = `#p{${number}${string}}` | `#r` | `#r{${string}}`

type CacheBase = {
	/**
	 * 缓存名,它指定了你的缓存存放在哪块命名空间
	 */
	key: string
	/**
	 * 自定义缓存的key
	 */
	values?: Array<CacheKeyExpression>
}

type CacheableOption = {
	/**
	 * 是否使用异步模式
	 * true: 异步模式
	 * false: 同步模式
	 * @default false
	 */
	async?: boolean
	/**
	 * 过期时间
	 * @default -1
	 */
	expiresIn?: number | ms.StringValue

	valueFc?: <P, R>(params: P, result: R) => Array<CacheKeyExpression>
} & CacheBase

type CachePutOption = {
	/**
	 * 过期时间
	 * @default -1
	 */
	expiresIn?: number | ms.StringValue
} & CacheBase

type CacheEvictOption = {
	/**
	 * 是否删除所有value的缓存
	 * true: 删除所有value的缓存
	 * false: 删除指定的value的缓存
	 * @default false
	 */
	allEntries?: boolean
	/**
	 * 是否在方法执行前就清空
	 * true: 在方法执行前就清空
	 * false: 在方法执行后清空
	 * @default false
	 */
	beforeInvocation?: boolean
} & CacheBase

// 解析缓存键表达式
function parseCacheKeyExpression(expression: CacheKeyExpression, args: Array<any>, result?: any): string | null {
	// 解析 #r
	if (expression === "#r") {
		if (_.isEmpty(result)) return null
		return result
	}
	// 解析 #r{user.name}
	if (expression.startsWith("#r{")) {
		const propertyMatch = expression.match(/#r{(.+)}/)
		if (!propertyMatch || !result) return null
		const property = propertyMatch[1]
		const value = property.split(".").reduce((obj, prop) => obj && obj[prop], result)
		return _.isEmpty(value) ? null : value
	}
	// 解析 #p{user.name}
	if (expression.startsWith("#p{")) {
		const propertyMatch = expression.match(/#p{(.+)}/)
		if (!propertyMatch || _.isEmpty(args)) return null
		const property = propertyMatch[1]
		const value = property.split(".").reduce((obj, prop) => obj && obj[prop], args)
		return _.isEmpty(value) ? null : value
	}
	return null
}

function parseCacheKeyExpressions(
	expressions: Array<CacheKeyExpression>,
	args: Array<any>,
	result?: any,
): string | null {
	if (_.isEmpty(expressions)) return null
	return expressions.map((i) => parseCacheKeyExpression(i, args, result))?.join("|")
}

// 解析缓存过期时间
function parseExpiresIn(expiresIn?: number | ms.StringValue): number {
	if (_.isEmpty(expiresIn)) return -1
	if (typeof expiresIn == "number") {
		return expiresIn <= 0 ? -1 : expiresIn
	}
	const msValue = ms(expiresIn)
	return msValue <= 0 ? -1 : msValue / 1000
}

const getRedisTool = async (): Promise<RedisTool> => {
	try {
		return await AppCtx.getInstance().getRedisTool()
	} catch (error) {
		console.error("获取RedisTool失败", error)
		return null
	}
}

/**
 * 根据方法对其返回结果进行缓存，下次请求时，如果缓存存在，则直接读取缓存数据返回；如果缓存不存在，则执行方法，并把返回的结果存入缓存中
 * 一般用在查询方法上
 */
function AspenCacheable(cacheables: CacheableOption | Array<CacheableOption>) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value
		descriptor.value = async function (...args: Array<any>) {
			if (_.isEmpty(cacheables)) return originalMethod.apply(this, args)
			// 处理缓存流程
			const redisTool = await getRedisTool()
			if (!redisTool) return originalMethod.apply(this, args)
			const list = Array.isArray(cacheables) ? cacheables : [cacheables]
			// 同步
			const cacheList: Array<Omit<CacheableOption, "value">> = []
			for (let i = 0; i < list.length; i++) {
				const v = list[i]
				const cacheValue = parseCacheKeyExpressions(v.values, args, {})
				if (_.isEmpty(cacheValue)) continue
				const fullPath = v.key == undefined ? cacheValue : `${v.key}:${cacheValue}`
				// 处理过期时间
				const expiresIn = parseExpiresIn(v.expiresIn)
				cacheList.push({ key: fullPath, async: v.async ?? false, expiresIn: expiresIn })
			}
			// 查找缓存
			for (let i = 0; i < cacheList.length; i++) {
				const cacheResult = await redisTool.get(cacheList[i].key)
				if (!_.isEmpty(cacheResult)) {
					console.log(`cache.able缓存命中key|${cacheList[i].key}|过期时间|${cacheList[i].expiresIn}秒`)
					return typeof cacheResult == "string" ? JSON.parse(cacheResult) : cacheResult
				}
			}
			// 执行方法,获取结果
			const result = await originalMethod.apply(this, args)
			if (result == undefined) return result
			// 异步缓存结果
			const asyncList = cacheList.filter((i) => i.async)
			if (asyncList.length > 0) {
				Promise.allSettled(asyncList.map((i) => redisTool.set(i.key, JSON.stringify(result), i.expiresIn as number)))
			}
			// 同步缓存结果
			const syncList = cacheList.filter((i) => !i.async)
			if (syncList.length > 0) {
				await Promise.allSettled(
					syncList.map((i) => redisTool.set(i.key, JSON.stringify(result), i.expiresIn as number)),
				)
			}
			return result
		}
		return descriptor
	}
}

/**
 * 使用该注解标志的方法，每次都会执行，并将结果存入指定的缓存中。其他方法可以直接从响应的缓存中读取缓存数据，而不需要再去查询数据库
 * 一般用在新增方法上
 */
function AspenCachePut(cachePuts: CachePutOption | Array<CachePutOption>) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value
		descriptor.value = async function (...args: Array<any>) {
			if (_.isEmpty(cachePuts)) return originalMethod.apply(this, args)
			// 处理缓存流程
			const redisTool = await getRedisTool()
			if (!redisTool) return originalMethod.apply(this, args)
			const list = Array.isArray(cachePuts) ? cachePuts : [cachePuts]
			const cacheList: Array<Omit<CachePutOption, "value">> = []
			// 执行方法,获取结果
			const result = await originalMethod.apply(this, args)
			if (result == undefined) return result
			for (let i = 0; i < list.length; i++) {
				const v = list[i]
				const cacheValue = parseCacheKeyExpressions(v.values, args, result)
				if (_.isEmpty(cacheValue)) continue
				const fullPath = v.key == undefined ? cacheValue : `${v.key}:${cacheValue}`
				// 处理过期时间
				const expiresIn = parseExpiresIn(v.expiresIn)
				cacheList.push({ key: fullPath, expiresIn: expiresIn })
			}
			// 设置缓存
			await Promise.allSettled(
				cacheList.map((i) => {
					console.log(`cache.put缓存key|${i.key}|过期时间|${i.expiresIn}秒`)
					return redisTool.set(i.key, JSON.stringify(result), i.expiresIn as number)
				}),
			)
			return result
		}
		return descriptor
	}
}

/**
 * 使用该注解标志的方法，会清空指定的缓存
 * 一般用在更新或者删除方法上
 */
function AspenCacheEvict(cacheEvicts: CacheEvictOption | Array<CacheEvictOption>) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value
		descriptor.value = async function (...args: Array<any>) {
			if (_.isEmpty(cacheEvicts)) return originalMethod.apply(this, args)
			// 处理缓存流程
			const redisTool = await getRedisTool()
			if (!redisTool) return originalMethod.apply(this, args)
			const list = Array.isArray(cacheEvicts) ? cacheEvicts : [cacheEvicts]
			const cacheList: Array<Omit<CacheEvictOption, "value">> = []
			for (let i = 0; i < list.length; i++) {
				const v = list[i]
				const cacheValue = parseCacheKeyExpressions(v.values, args, {})
				if (_.isEmpty(cacheValue)) continue
				let fullPath = v.key == undefined ? cacheValue : `${v.key}:${cacheValue}`
				// 是否全部删除
				if (!_.isEmpty(v.allEntries) && v.allEntries && !_.isEmpty(v.key)) {
					fullPath = `${v.key}:*`
				}
				cacheList.push({ key: fullPath, beforeInvocation: v.beforeInvocation ?? false })
			}
			// 在方法执行前就清空
			const beforeList = cacheList.filter((i) => i.beforeInvocation)
			if (beforeList.length > 0) {
				await Promise.allSettled(beforeList.map((i) => redisTool.del(i.key)))
			}
			// 执行方法,获取结果
			const result = await originalMethod.apply(this, args)
			// 在方法执行后清空
			const afterList = cacheList.filter((i) => !i.beforeInvocation)
			if (afterList.length > 0) {
				await Promise.allSettled(afterList.map((i) => redisTool.del(i.key)))
			}
			return result
		}
		return descriptor
	}
}

export const cache = {
	able: AspenCacheable,
	put: AspenCachePut,
	evict: AspenCacheEvict,
}
