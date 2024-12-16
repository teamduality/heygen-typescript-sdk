import { BaseService } from './base.js'
import { BASE_URL } from '../config/endpoints.js'
import type { ListVideosRequest, ListVideosResponse } from '../types/video.js'

export class VideoManagementService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey, 'v2')
  }

  async list(params?: ListVideosRequest): Promise<ListVideosResponse> {
    return this.request<ListVideosResponse, ListVideosRequest>(
      `${BASE_URL}/v2/videos`,
      'GET',
      params
    )
  }
}
