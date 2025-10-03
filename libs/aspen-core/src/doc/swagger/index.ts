import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { INestApplication } from "@nestjs/common"

/******************** start type start ********************/

export type SwaggerOptions = {
	/**
	 * swagger地址
	 */
	address?: string
	/**
	 * 标题
	 */
	title: string
	/**
	 * 描述
	 */
	description?: string
	/**
	 * 版本号
	 * @define 1.0.0
	 */
	version?: string
	/**
	 * swagger接口文档地址前缀
	 * @define /doc
	 */
	pathPrefix?: string
}

/******************** end type end ********************/

const defaultSwaggerOptions = (): SwaggerOptions => {
	return {
		title: "",
		version: "1.0.0",
		pathPrefix: "/doc",
	}
}

export const registerSwaggerDoc = (app: INestApplication, option: SwaggerOptions) => {
	const { title, description, version, pathPrefix } = Object.assign(defaultSwaggerOptions(), option)
	const options = new DocumentBuilder()
		.addBasicAuth()
		.setTitle(title)
		.setDescription(description)
		.setVersion(version)
		.build()
	const document = SwaggerModule.createDocument(app, options, {
		extraModels: [],
	})
	SwaggerModule.setup(pathPrefix, app, document)
	console.table({
		swagger地址: `${option.address}${pathPrefix}`,
	})
}
