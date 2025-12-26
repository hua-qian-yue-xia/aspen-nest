import { Test, TestingModule } from "@nestjs/testing"

import { Application } from "@aspen/aspen-core"

import { AppModule } from "apps/admin/src/app-module"

export const createAdminTestModule = async () => {
	const srcPath = `${process.cwd()}/apps/admin/src`
	return Test.createTestingModule({
		imports: [await new Application().getAppModule(srcPath, AppModule)],
		providers: [],
		controllers: [],
	}).compile()
}
