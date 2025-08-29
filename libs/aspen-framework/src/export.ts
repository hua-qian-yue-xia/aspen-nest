import { GenDict } from "./decorator/gen-dict/gen-dict-decorator"
import { GenDictModule } from "./decorator/gen-dict/gen-dict-module"

import { AspenCacheable, AspenCacheEvict, AspenCachePut } from "./decorator/cache/cache-decorator"

export const gen = {
	dict: GenDict,
}

export const cache = {
	able: AspenCacheable,
	put: AspenCachePut,
	evict: AspenCacheEvict,
}

export const frameworkModule = {
	genDict: GenDictModule,
}
