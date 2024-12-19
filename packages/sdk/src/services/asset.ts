import { BaseService } from './base.js'
import { V1_UPLOAD_BASE_URL } from '../config/endpoints.js'
import type { AssetContentType, AssetResponse } from '../types/index.js'

export class AssetService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async upload(
    file: Buffer | Blob,
    contentType: AssetContentType
  ): Promise<AssetResponse> {
    return this.requestV1<AssetResponse>('/asset', {
      method: 'POST',
      file,
      contentType,
      baseUrl: V1_UPLOAD_BASE_URL
    })
  }
}
