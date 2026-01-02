import { GenGroupDict } from "./decorator/gen-dict/gen-dict-decorator"
import { GenDictModule } from "./decorator/gen-dict/gen-dict-module"

import { AspenCacheable, AspenCacheEvict, AspenCachePut } from "./decorator/cache/cache-decorator"

import { ServiceModule } from "./service/index"

export const gen = {
	dictGroup: GenGroupDict,
}

export const cache = {
	able: AspenCacheable,
	put: AspenCachePut,
	evict: AspenCacheEvict,
}

export const frameworkModule = {
	genDict: GenDictModule,
	service: ServiceModule,
}
