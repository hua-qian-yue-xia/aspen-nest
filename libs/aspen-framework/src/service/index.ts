import { Global, Module } from "@nestjs/common"

import { FrameCaptchaService } from "../service/frame-captcha-service"

@Global()
@Module({})
export class ServiceModule {
	static forRoot() {
		return {
			module: ServiceModule,
			global: true,
			providers: [FrameCaptchaService],
			exports: [FrameCaptchaService],
		}
	}
}
