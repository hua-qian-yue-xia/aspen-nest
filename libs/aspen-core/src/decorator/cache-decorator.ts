import * as _ from "radash"

import { AppCtx } from "@aspen/aspen-core"

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
	expiresIn?: number
} & CacheBase

type CachePutOption = {} & CacheBase

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

/**
 * 根据方法对其返回结果进行缓存，下次请求时，如果缓存存在，则直接读取缓存数据返回；如果缓存不存在，则执行方法，并把返回的结果存入缓存中
 * 一般用在查询方法上
 */
export function AspenCacheable(cacheables: CacheableOption | Array<CacheableOption>) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value
		descriptor.value = async function (...args: Array<any>) {
			if (_.isEmpty(cacheables)) return originalMethod.apply(this, args)
			// 处理缓存流程
			const redisTool = await AppCtx.getInstance().getRedisTool()
			const list = Array.isArray(cacheables) ? cacheables : [cacheables]
			// 同步
			const sync = []
			// 异步
			const async = []
			for (let i = 0; i < list.length; i++) {
				const v = list[i]
				const cacheValue = parseCacheKeyExpressions(v.values, args, {})
				if (_.isEmpty(cacheValue)) continue
				const fullPath = v.key == undefined ? cacheValue : `${v.key}:${cacheValue}`
				if (v.async) {
					async.push(fullPath)
				} else {
					sync.push(fullPath)
				}
			}
			// 查找缓存
			const full = [...sync, ...async]
			for (let i = 0; i < full.length; i++) {
				const cacheResult = await redisTool.get(full[i])
				if (!_.isEmpty(cacheResult)) {
					console.log(`缓存命中key|${full[i]}|value|${JSON.stringify(cacheResult)}|`)
					return typeof cacheResult == "string" ? JSON.parse(cacheResult) : cacheResult
				}
			}
			// 执行方法,获取结果
			const result = await originalMethod.apply(this, args)
			// 缓存结果
			for (let i = 0; i < sync.length; i++) {
				await redisTool.set(sync[i], JSON.stringify(result))
			}
			for (let i = 0; i < async.length; i++) {
				redisTool.set(async[i], JSON.stringify(result))
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
export function AspenCachePut(cachePuts: CachePutOption | Array<CachePutOption>) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value
		descriptor.value = async function (...args: Array<any>) {
			if (_.isEmpty(cachePuts)) return originalMethod.apply(this, args)
		}
		return descriptor
	}
}

/**
 * 使用该注解标志的方法，会清空指定的缓存
 * 一般用在更新或者删除方法上
 */
export function AspenCacheEvict(cacheEvicts: CacheEvictOption | Array<CacheEvictOption>) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value
		descriptor.value = async function (...args: Array<any>) {
			if (_.isEmpty(cacheEvicts)) return originalMethod.apply(this, args)
		}
		return descriptor
	}
}

export const cache = {
	AspenCacheable,
	AspenCachePut,
	AspenCacheEvict,
}
