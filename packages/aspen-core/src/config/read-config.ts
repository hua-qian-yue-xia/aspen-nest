import { ConfigFileSuffixConstant } from "packages/aspen-core/src/constant/config-constant"
import * as path from "node:path"
import * as fs from "node:fs"
import * as yaml from "js-yaml"

/******************** start type start ********************/

export type Application = {
	app: App
}

export type App = {
	/**
	 * app标题
	 */
	name: string
	/**
	 * app描述
	 */
	description: string
	/**
	 * 版本号
	 */
	version: string
	/**
	 * 全局路由前缀
	 */
	prefix: string
	/**
	 * 服务运行端口
	 */
	port: number
}

/******************** end type end ********************/

export const readYamlFile = (cwdPath: string, type: ConfigFileSuffixConstant) => {
	let fileName: string = ""
	if (type != "") fileName += `-${type}`
	const filePath: string = path.join(cwdPath, "config", `application${fileName}.yaml`)
	return yaml.load(fs.readFileSync(filePath, "utf-8")) as Record<string, any>
}

export const readActiveYamlFile = (cwdPath: string): Record<string, any> => {
	const defaultConf = readYamlFile(cwdPath, "")
	return Object.assign({}, defaultConf)
}
