import { BaseService } from './base.js'
import type { ListVideosRequest, ListVideosResponse } from '../types/index.js'

export class VideoManagementService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async list(params?: ListVideosRequest): Promise<ListVideosResponse> {
    return this.requestV2<ListVideosResponse, ListVideosRequest>('/videos', {
      method: 'GET',
      params
    })
  }
}
