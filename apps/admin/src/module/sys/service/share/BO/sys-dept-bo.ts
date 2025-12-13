import { AspenSummary } from "@aspen/aspen-core"

/*
 * ---------------------------------------------------------------
 * ## 用户-新增
 * ---------------------------------------------------------------
 */
export class SysDeptCountTotalBO {
	@AspenSummary({ summary: "部门id" })
	dpetId: string

	@AspenSummary({ summary: "部门名称" })
	deptName: string

	@AspenSummary({ summary: "子部门总数" })
	dpetCount: number = 0

	@AspenSummary({ summary: "部门总人数" })
	personCount: number = 0
}
