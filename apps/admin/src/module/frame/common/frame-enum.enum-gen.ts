import { BaseEnum } from "@aspen/aspen-core"
import { gen } from "@aspen/aspen-framework"

/*
 * ---------------------------------------------------------------
 * ## 用户相关枚举
 * ---------------------------------------------------------------
 */
@gen.dict({
	key: "frame_file_config_type",
	summary: "文件类型",
})
export class FrameFileConfigTypeEnum extends BaseEnum {
	readonly MINIO = {
		code: "100",
		summary: "MinIO",
	}
	readonly FILE = {
		code: "200",
		summary: "文件存储",
	}
}

export const frameFileConfigTypeEnum = new FrameFileConfigTypeEnum()
