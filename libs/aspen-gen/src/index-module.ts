import { Module } from "@nestjs/common"

import { GenColorController } from "libs/aspen-gen/src/controller/gen-color-controller"
import { GenColumnController } from "libs/aspen-gen/src/controller/gen-column-controller"
import { GenColumnRelationController } from "libs/aspen-gen/src/controller/gen-column-relation-controller"
import { GenEnumController } from "libs/aspen-gen/src/controller/gen-enum-controller"
import { GenTableController } from "libs/aspen-gen/src/controller/gen-table-controller"
import { GenTableGroupController } from "libs/aspen-gen/src/controller/gen-table-group-controller"

import { GenColorService } from "libs/aspen-gen/src/service/gen-color-service"
import { GenColumnService } from "libs/aspen-gen/src/service/gen-column-service"
import { GenColumnRelationService } from "libs/aspen-gen/src/service/gen-column-relation-service"
import { GenEnumService } from "libs/aspen-gen/src/service/gen-enum-service"
import { GenTableService } from "libs/aspen-gen/src/service/gen-table-service"
import { GenTableGroupService } from "libs/aspen-gen/src/service/gen-table-group-service"

@Module({
	imports: [],
	controllers: [
		GenColorController,
		GenColumnController,
		GenColumnRelationController,
		GenEnumController,
		GenTableController,
		GenTableGroupController,
	],
	providers: [
		GenColorService,
		GenColumnService,
		GenColumnRelationService,
		GenEnumService,
		GenTableService,
		GenTableGroupService,
	],
})
export class IndexModule {}
