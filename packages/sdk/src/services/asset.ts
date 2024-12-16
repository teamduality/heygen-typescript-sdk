import { BaseService } from './base.js'
import type { AssetContentType, AssetResponse } from '../types/asset.js'

const UPLOAD_URL = 'https://upload.heygen.com/v1'

export class AssetService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async upload(
    file: Buffer | Blob,
    contentType: AssetContentType
  ): Promise<AssetResponse> {
    return this.requestV1<AssetResponse>(`${UPLOAD_URL}/asset`, 'POST', file, {
      'Content-Type': contentType
    })
  }
}
