import { Injectable } from "@nestjs/common"
import { In, Repository } from "typeorm"

import { exception, RedisTool } from "@aspen/aspen-core"
import { cache, FrameFileCategoryEntity } from "@aspen/aspen-framework"
import { FrameFileCategoryQueryDto, FrameFileCategorySaveDto } from "../common/entity/frame-file-category-entity"

@Injectable()
export class FrameFileCategoryService {
	constructor(
		private readonly frameFileCategoryRepo: Repository<FrameFileCategoryEntity>,
		private readonly redisTool: RedisTool,
	) {}

	// 分类名称是否重复
	async isCategoryNameDuplicate(entity: FrameFileCategoryEntity): Promise<boolean> {
		const queryBuilder = this.frameFileCategoryRepo
			.createQueryBuilder("a")
			.where("a.category_name = :categoryName", { categoryName: entity.categoryName })
		if (entity.categoryId) {
			queryBuilder.andWhere("a.category_id != :categoryId", { categoryId: entity.categoryId })
		}
		const count = await queryBuilder.getCount()
		return count > 0
	}

	// 查询所有文件分类
	async all(dto: FrameFileCategoryQueryDto) {
		return await dto.createQueryBuilder(this.frameFileCategoryRepo).getMany()
	}

	// 根据categoryId查询文件分类(有缓存)
	@cache.able({ key: "frame:file:category:id", value: ([categoryId]) => `${categoryId}`, expiresIn: "2h" })
	async getByCategoryId(categoryId: string) {
		return await this.frameFileCategoryRepo.findOne({
			where: {
				categoryId,
			},
		})
	}

	// 新增文件分类
	@cache.put({ key: "frame:file:category:id", value: (_, result) => `${result.categoryId}`, expiresIn: "2h" })
	async save(body: FrameFileCategorySaveDto) {
		const obj = body.toEntity()
		if (await this.isCategoryNameDuplicate(obj)) {
			throw new exception.validator(`分类名称"${obj.categoryName}"重复`)
		}
		return await this.frameFileCategoryRepo.save(obj)
	}

	// 更新文件分类
	@cache.put({ key: "frame:file:category:id", value: ([body]) => `${body.categoryId}`, expiresIn: "2h" })
	async edit(body: FrameFileCategorySaveDto) {
		const obj = body.toEntity()
		if (await this.isCategoryNameDuplicate(obj)) {
			throw new exception.validator(`分类名称"${obj.categoryName}"重复`)
		}
		return await this.frameFileCategoryRepo.update({ categoryId: obj.categoryId }, obj)
	}

	// 删除文件分类
	async delByIds(categoryIds: Array<string>) {
		// 查询存不存在
		const roleList = await this.frameFileCategoryRepo.find({ where: { categoryId: In(categoryIds) } })
		if (!roleList.length) return 0
		// 删除数据
		const { affected } = await this.frameFileCategoryRepo.softDelete(categoryIds)
		// 删除缓存
		this.redisTool.del(roleList.map((v) => `frame:file-category:id:${v.categoryId}`))
		return affected ?? 0
	}
}
