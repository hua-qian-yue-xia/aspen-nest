import { Injectable, OnModuleInit, SetMetadata } from "@nestjs/common"
import { DecoratorKey } from "packages/aspen-core/src"
import { DiscoveryService, MetadataScanner, Reflector } from "@nestjs/core"
import { PATH_METADATA } from "@nestjs/common/constants"

export const NoToken = () => SetMetadata(DecoratorKey.NoToken, true)

@Injectable()
export class NoTokenService implements OnModuleInit {
	private noTokenList: Array<string> = []

	constructor(
		private readonly reflector: Reflector,
		private readonly discoveryService: DiscoveryService,
		private readonly metadataScanner: MetadataScanner,
	) {}

	onModuleInit(): void {
		this.getNoTokenList()
	}

	getNoTokenList() {
		this.discoveryService
			.getControllers()
			.filter((wrapper) => wrapper.isDependencyTreeStatic())
			.filter((wrapper) => wrapper.instance)
			.forEach((v) => {
				const { instance } = v
				const controllerPath = this.reflector.get(PATH_METADATA, v.metatype)
				this.metadataScanner.getAllMethodNames(instance).forEach((name) => {
					const path = this.reflector.get(PATH_METADATA, instance[name])
					const anonymous = this.reflector.get(DecoratorKey.NoToken, instance[name])
					const whitePath = `${controllerPath}${path}`
					if (anonymous && anonymous === true) {
						this.noTokenList.push(whitePath)
					}
				})
			})
	}
}
