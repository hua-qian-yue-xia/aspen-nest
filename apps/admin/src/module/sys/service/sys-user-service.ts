import { Injectable } from "@nestjs/common"

@Injectable()
export class SysUserService {
	/**
	 * 根据用户id查询用户
	 */
	getByUserId(userId: string) {
		console.log(userId)
	}
}
