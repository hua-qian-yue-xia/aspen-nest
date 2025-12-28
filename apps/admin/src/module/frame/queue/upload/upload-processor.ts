import { Job } from "bullmq"
import { Processor, WorkerHost } from "@nestjs/bullmq"

// constants.ts
export const QUEUE_UPLOAD_SMALL = "upload-small"
export const QUEUE_UPLOAD_LARGE = "upload-large"
export const LARGE_FILE_THRESHOLD = 10 * 1024 * 1024 // 10MB

/**
 * 小文件上传处理器
 */
@Processor(QUEUE_UPLOAD_SMALL, {
	// 小文件允许高并发,例如同时处理50个
	concurrency: 50,
	// 锁时间短,30秒处理不完就认为异常
	lockDuration: 30 * 1000,
})
export class SmallUploadProcessor extends WorkerHost {
	async process(job: Job): Promise<any> {
		console.log(`[Small] Processing ${job.data.filename} (${job.data.size} bytes)`)
		// 执行上传逻辑...
		return "Done"
	}
}

/**
 * 大文件上传处理器
 */
@Processor(QUEUE_UPLOAD_LARGE, {
	// 大文件限制并发,防止带宽耗尽或内存溢出
	concurrency: 2,
	// 锁时间长,30分钟处理不完就认为异常
	lockDuration: 30 * 60 * 1000,
})
export class LargeUploadProcessor extends WorkerHost {
	async process(job: Job): Promise<any> {
		console.log(`[Large] Processing ${job.data.filename} (${job.data.size} bytes)`)
		// 执行分片上传、断点续传等复杂逻辑...
		return "Done"
	}
}
