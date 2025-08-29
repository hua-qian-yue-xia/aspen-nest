import { pathToFileURL } from "url"

export abstract class FileTool {
	// 自动导入文件
	static async autoImport(filePath: string): Promise<[any, "esm" | "commonjs"]> {
		const tryToImport = async (): Promise<[any, "esm"]> => {
			return [
				await Function("return filePath => import(filePath)")()(
					filePath.startsWith("file://") ? filePath : pathToFileURL(filePath).toString(),
				),
				"esm",
			]
		}
		const tryToRequire = (): [any, "commonjs"] => {
			/* eslint-disable */
			return [require(filePath), "commonjs"]
		}
		const extension = filePath.substring(filePath.lastIndexOf(".") + ".".length)
		if (["mjs", "mts"].includes(extension)) return tryToImport()
		if (["cjs", "cts", "js"].includes(extension)) return tryToRequire()
		throw new Error(`不支持的文件类型path:${filePath};`)
	}
}
