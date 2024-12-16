import { BaseService } from './base.js'
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
      contentType
    })
  }
}
