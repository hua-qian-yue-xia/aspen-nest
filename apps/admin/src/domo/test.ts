import { Inject, Injectable } from "@nestjs/common"
import { Scope } from "@nestjs/common/interfaces/scope-options.interface"
import { REQUEST } from "@nestjs/core"

@Injectable({ scope: Scope.REQUEST })
export class TestInjectable {
	constructor(@Inject(REQUEST) private readonly request: Request) {}

	get() {
		return this.request?.url
	}
}
