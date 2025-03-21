export class BaseAdminUser {
	/**
	 * 用户id
	 */
	userId: string
	/**
	 * 登录名
	 */
	username: string
	/**
	 * 用户昵称
	 */
	userNickname: string

	/**
	 * 是否是超级管理员
	 */
	isSuperAdmin(): boolean {
		return false
	}
}
