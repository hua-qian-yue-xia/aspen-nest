import { AspenGet, AspenPost, AspenPut, AspenDelete, AspenPatch } from "packages/aspen-core/src/decorator/req-decorator"

export const router = {
	Get: AspenGet,
	Post: AspenPost,
	Put: AspenPut,
	Delete: AspenDelete,
	Patch: AspenPatch,
}
