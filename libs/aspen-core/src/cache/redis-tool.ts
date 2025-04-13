import { Injectable, Scope } from "@nestjs/common"
import { RedisService } from "@liaoliaots/nestjs-redis"
import Redis from "ioredis"

@Injectable({ scope: Scope.DEFAULT })
export class RedisTool {
	private readonly redis: Redis

	constructor(private readonly redisService: RedisService) {
		this.redis = this.redisService.getOrThrow()
	}

	/**
	 * 设置字符串缓存(单位秒)
	 */
	async set(key: string, val: string, seconds?: number) {
		if (!seconds) return this.redis.set(key, val)
		if (!seconds || seconds <= 0) return this.redis.set(key, val)
		return this.redis.set(key, val, "EX", seconds)
	}

	/**
	 * 获取字符串缓存(单位秒)
	 */
	async get(key: string): Promise<string> {
		if (!key || key === "*") return null
		return this.redis.get(key)
	}

	/**
	 * 删除字符串缓存(单位秒)
	 */
	async del(keys: string | Array<string>): Promise<number> {
		if (!keys || keys === "*") return 0
		if (typeof keys === "string") keys = [keys]
		return this.redis.del(...keys)
	}
}
