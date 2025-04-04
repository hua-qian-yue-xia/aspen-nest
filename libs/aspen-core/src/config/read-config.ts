import { ConfigFileSuffixConstant } from "libs/aspen-core/src/constant/config-constant"
import * as path from "node:path"
import * as fs from "node:fs"
import * as yaml from "js-yaml"
import * as _ from "radash"

/******************** start type start ********************/

export type Application = {
	app: AppConfig
	redis: RedisConfig
	database: DatabaseConfig
}

export type AppConfig = {
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

export type RedisConfig = {
	/**
	 * redis访问地址
	 */
	host?: string
	/**
	 * redis访问端口
	 * @define 6379
	 */
	port?: number
	/**
	 * redis密码
	 * @define ""
	 */
	password?: string
	/**
	 * 数据库
	 * @default 0
	 */
	db?: number
}

export type DatabaseConfig = {
	/**
	 * 数据库类型
	 * @default mysql
	 */
	type?: "mysql"
	/**
	 * database 访问地址
	 * @define localhost
	 */
	host?: string
	/**
	 * database 访问端口
	 * @define 3306
	 */
	port?: number
	/**
	 * database 用户名
	 * @define root
	 */
	username?: string
	/**
	 * database 密码
	 * @define root
	 */
	password?: string
	/**
	 * database 名称
	 */
	database?: string
}

/******************** end type end ********************/

const redisDefault = () => {
	return {
		port: 6379,
		password: "",
		db: 0,
	} as RedisConfig
}

const databaseDefault = () => {
	return {
		type: "mysql",
		host: "localhost",
		port: 3306,
		username: "root",
		password: "root",
		database: "",
	} as DatabaseConfig
}

const readYamlFile = (cwdPath: string, type: ConfigFileSuffixConstant) => {
	let fileName: string = ""
	if (type != "") fileName += `-${type}`
	const filePath: string = path.join(cwdPath, "config", `application${fileName}.yaml`)
	return yaml.load(fs.readFileSync(filePath, "utf-8")) as Record<string, any>
}

export const readActiveYamlFile = (cwdPath: string): Record<string, any> => {
	let defaultConf = readYamlFile(cwdPath, "")
	defaultConf = _.assign({ redis: redisDefault(), database: databaseDefault() }, defaultConf)
	const devConfig = readYamlFile(cwdPath, "dev")
	return _.assign(defaultConf, devConfig)
}
