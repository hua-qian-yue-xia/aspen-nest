declare namespace GlobalConfig {
	interface Application {
		app: AppConfig
		redis: RedisConfig
		database: DatabaseConfig
		jwt: JwtConfig
		logger: LoggerConfig
	}

	interface AppConfig {
		/**
		 * app名称
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
		 * @default 7001
		 */
		port: number
	}

	interface RedisConfig {
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

	interface DatabaseConfig {
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

	interface JwtConfig {
		/**
		 * 密钥
		 */
		secret: string
		/**
		 * token过期时间,默认一天过期
		 * @see https://www.npmjs.com/package/ms
		 * @default '1D'
		 */
		expiresIn: import("ms").StringValue
	}

	interface LoggerConfig {
		/**
		 * 日志级别
		 * @default 'info'
		 */
		level?: LoggerLevel

		/**
		 * 是否压缩归档
		 * @default true
		 */
		zippedArchive?: boolean

		/**
		 * 单文件最大大小
		 * @default '20m'
		 */
		maxSize?: string

		/**
		 * 保留日志文件时间
		 * @default '3m'
		 */
		maxFiles?: string

		/**
		 * loki主机地址
		 */
		lokiHost?: string

		/**
		 * 日志传输方式
		 * @default console | file
		 * console: 控制台输出
		 * file: 文件输出
		 * loki: loki输出
		 */
		transports?: Array<"console" | "file" | "loki">
	}
}
