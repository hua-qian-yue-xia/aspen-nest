import { ConfigFileSuffixConstant } from "libs/aspen-core/src/constant/config-constant"
import * as path from "node:path"
import * as fs from "node:fs"

import * as ms from "ms"
import * as yaml from "js-yaml"
import * as _ from "radash"

/******************** start type start ********************/

export type Application = {
	app: AppConfig
	redis: RedisConfig
	database: DatabaseConfig
	jwt: JwtConfig
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
	/**
	 * 每次建立连接时删除架构
	 * 请注意此选项，不要在生产环境中使用它，否则将丢失所有生产数据。但是此选项在调试和开发期间非常有用
	 * @define false
	 */
	dropSchema?: boolean
	/**
	 * 是否在每次应用程序启动时自动创建数据库架构
	 * 请注意此选项，不要在生产环境中使用它，否则将丢失所有生产数据。但是此选项在调试和开发期间非常有用
	 * @define false
	 */
	synchronize?: boolean
}

/******************** end type end ********************/

export type JwtConfig = {
	/**
	 * 密钥
	 */
	secret: string
	/**
	 * token过期时间,默认一天过期
	 * @see https://www.npmjs.com/package/ms
	 * @default '1D'
	 */
	expiresIn?: ms.StringValue
}

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
		dropSchema: false,
		synchronize: false,
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
