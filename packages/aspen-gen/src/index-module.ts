import { Module } from "@nestjs/common"
import { GenColorController } from "packages/aspen-gen/src/controller/gen-color-controller"

@Module({
	imports: [],
	controllers: [GenColorController],
	providers: [],
})
export class IndexModule {}
