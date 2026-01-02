import { AbstractEnumGroup } from "@aspen/aspen-core"
import { gen } from "@aspen/aspen-framework"

/*
 * ---------------------------------------------------------------
 * ## 用户相关枚举
 * ---------------------------------------------------------------
 */
@gen.dictGroup({
	key: "frame_file",
	summary: "文件类型",
})
export class FrameFileEnum extends AbstractEnumGroup {
	readonly catalogueType = this.create("catalogue_type", "文件配置类型", {
		MINIO: {
			code: "root",
			summary: "根目录",
		},
		FILE: {
			code: "cwd",
			summary: "当前目录",
		},
	})
	readonly configType = this.create("config_type", "文件配置类型", {
		MINIO: {
			code: "100",
			summary: "MinIO",
		},
		FILE: {
			code: "200",
			summary: "服务器存储",
		},
	})
}

export const frameFileEnum = new FrameFileEnum()
