import { GenDict } from "./decorator/gen-dict/gen-dict-decorator"
import { GenDictModule } from "./decorator/gen-dict/gen-dict-module"

import { AspenCacheable, AspenCacheEvict, AspenCachePut } from "./decorator/cache/cache-decorator"

import { JwtStrategyModule } from "./guard/jwt/index"

import { comActiveEnum } from "./enum/com-active.enum-gen"
import { comBoolEnum } from "./enum/com-bool.enum-gen"
import { comEnableEnum } from "./enum/com-enable.enum-gen"
import { comToggleEnum } from "./enum/com-toggle.enum-gen"

import { ServiceModule } from "./service/index"

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
	jwtStrategy: JwtStrategyModule,
	service: ServiceModule,
}

export const enums = {
	comActiveEnum,
	comBoolEnum,
	comEnableEnum,
	comToggleEnum,
}
