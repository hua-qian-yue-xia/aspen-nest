import { AspenGet, AspenPost, AspenPut, AspenDelete, AspenPatch } from "packages/aspen-core/src/decorator/req-decorator"
import { registerSwaggerDoc } from "packages/aspen-core/src/doc/swagger"

export const router = {
	get: AspenGet,
	post: AspenPost,
	put: AspenPut,
	delete: AspenDelete,
	patch: AspenPatch,
}

export const doc = { registerSwaggerDoc }
