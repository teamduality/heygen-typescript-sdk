import { BaseService } from './base.js'
import type { CreateVideoRequest, CreateVideoResponse } from '../types/video.js'

export class VideoGenerationService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async create(data: CreateVideoRequest): Promise<CreateVideoResponse> {
    return this.requestV2<CreateVideoResponse, CreateVideoRequest>(
      '/videos',
      'POST',
      data
    )
  }

  async get(videoId: string) {
    return this.requestV2<CreateVideoResponse>(`/videos/${videoId}`, 'GET')
  }

  async delete(videoId: string) {
    return this.requestV2<void>(`/videos/${videoId}`, 'DELETE')
  }
}
