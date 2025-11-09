import * as os from "node:os"
import * as cluster from "node:cluster"

export abstract class OsTool {
	/**
	 * 解析当前实例ID
	 */
	static getResolveInstance(): string {
		// PM2 集群
		if (process.env.pm_id !== undefined) {
			return `pm2-${process.env.pm_id}-${os.hostname()}-${process.pid}`
		}
		// Node 原生 cluster
		if ((cluster as any).isWorker) {
			return `cluster-${(cluster as any).worker?.id ?? "?"}-${os.hostname()}-${process.pid}`
		}
		// K8s/容器：HOSTNAME 通常就是 pod 或容器名；再拼pid增强唯一性
		const host = process.env.HOSTNAME || os.hostname()
		return `other-${host}-${process.pid}`
	}
}
