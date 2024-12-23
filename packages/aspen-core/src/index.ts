import { AspenGet, AspenPost, AspenPut, AspenDelete, AspenPatch } from "packages/aspen-core/src/decorator/req-decorator"
import { ReqMethod } from "packages/aspen-core/src/constant/decorator-constant"

const router = {
	[ReqMethod.Get]: AspenGet,
	[ReqMethod.Post]: AspenPost,
	[ReqMethod.Put]: AspenPut,
	[ReqMethod.Delete]: AspenDelete,
	[ReqMethod.Patch]: AspenPatch,
}

export default {
	router,
}
