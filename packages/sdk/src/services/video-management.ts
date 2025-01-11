import { BaseService } from './base.js'
import type { QueryParams } from './base.js'
import type { ListVideosRequest, ListVideosResponse } from '../types/index.js'

export class VideoManagementService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async list(params?: ListVideosRequest): Promise<ListVideosResponse> {
    return this.requestV1<ListVideosResponse>('/video.list', {
      method: 'GET',
      queryParams: params as QueryParams
    })
  }
}
