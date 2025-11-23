import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common"

import { SysDeptShare } from "../../service/share/sys-dept.share"

@Injectable()
export class SysModuleInit implements OnApplicationBootstrap {
	private readonly logger = new Logger(SysModuleInit.name)

	constructor(private readonly sysDeptRepo: SysDeptShare) {}

	async onApplicationBootstrap() {
		await this.initRootDept()
	}

	// 初始化根部门
	async initRootDept() {
		try {
			this.sysDeptRepo.getOrCreateRootDept()
		} catch (error) {
			this.logger.error(`|初始化根部门|意外的错误:${error.message}`, error)
		}
	}
}
