import { Injectable, Scope } from "@nestjs/common"

import * as svgCaptcha from "svg-captcha"
import * as _ from "radash"

import { RedisTool } from "@aspen/aspen-core"

@Injectable({ scope: Scope.DEFAULT })
export class FrameCaptchaService {
	constructor(private readonly redisTool: RedisTool) {}

	/**
	 * 生成验证码
	 * @param key 验证码key
	 * @param ttlMs 过期时间,默认120秒
	 */
	async generate(options: {
		key?: string
		ttlMs?: number
		type?: "mathExpr" | "input"
	}): Promise<{ key: string; svg: string }> {
		const { ttlMs = 120000, type = "mathExpr" } = options
		const key = this.generateKey(options.key)
		const redisKey = this.generateRedisKey(key)
		let captcha = null
		if (type === "mathExpr") {
			captcha = svgCaptcha.createMathExpr({
				// 验证码长度
				size: 4,
				// 干扰线条的数量
				noise: 2,
				// 验证码的字符是否有颜色
				color: true,
			})
		} else {
			captcha = svgCaptcha.create({
				// 验证码长度
				size: 4,
				// 干扰线条的数量
				noise: 2,
				// 验证码的字符是否有颜色
				color: true,
			})
		}
		await this.redisTool.set(redisKey, captcha.text.toLowerCase(), ttlMs)
		return { key: key, svg: captcha.data }
	}

	/**
	 * 验证验证码
	 * @param key 验证码key
	 * @param input 验证码输入值
	 */
	async verify(key: string, input: string) {
		const redisKey = this.generateRedisKey(key)
		const expect = await this.redisTool.get(redisKey)
		await this.redisTool.del(redisKey)
		return !!expect && expect === String(input || "").toLowerCase()
	}

	private generateKey(key?: string) {
		if (!key) key = `auto-${Date.now()}-${_.uid(16)}`
		return key
	}

	private generateRedisKey(key?: string) {
		return `plugin:captcha:${this.generateKey(key)}`
	}
}
