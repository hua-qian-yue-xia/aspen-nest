import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
	constructor() {
		super()
	}

	/**
	 * 守卫执行逻辑
	 * @description 在请求进入控制器之前执行，决定请求是否可以继续。
	 * 1. 首先检查是否存在 @NoToken 装饰器（白名单），如果有则直接放行。
	 * 2. 如果没有白名单，则调用父类（Passport AuthGuard）的 canActivate 执行 JWT 校验逻辑。
	 */
	canActivate(context: ExecutionContext) {
		return super.canActivate(context)
	}

	/**
	 * 请求处理逻辑
	 * @description 在父类 canActivate 内部的 JWT 校验完成后调用。
	 * - 如果 JWT 校验失败（err 存在或 user 为空），则抛出 UnauthorizedException。
	 * - 如果校验成功，返回 user 对象，Passport 会自动将其挂载到 request.user 上。
	 */
	handleRequest(err: any, user: any, info: any) {
		if (err || !user) {
			throw err || new UnauthorizedException()
		}
		return user
	}
}
