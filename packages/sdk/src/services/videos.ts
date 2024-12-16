import { BaseService } from './base.js'
import { BASE_URL } from '../config/endpoints.js'
import type { CreateVideoRequest, CreateVideoResponse } from '../types/video.js'

export class VideoGenerationService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey, 'v2')
  }

  async create(data: CreateVideoRequest): Promise<CreateVideoResponse> {
    return this.request<CreateVideoResponse, CreateVideoRequest>(
      `${BASE_URL}/v2/videos`,
      'POST',
      data
    )
  }

  async get(videoId: string) {
    return this.request<CreateVideoResponse>(
      `${BASE_URL}/v2/videos/${videoId}`,
      'GET'
    )
  }

  async delete(videoId: string) {
    return this.request<void>(`${BASE_URL}/v2/videos/${videoId}`, 'DELETE')
  }
}
