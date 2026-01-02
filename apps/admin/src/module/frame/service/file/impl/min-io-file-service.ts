import { AbstractFileClient } from "../base/base-file-service"
import { FileS3Config } from "../base/file-config"

export default class MinioFileService extends AbstractFileClient<FileS3Config> {}
