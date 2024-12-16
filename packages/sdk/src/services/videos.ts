import { BaseService } from './base.js'
import type { QueryParams } from './base.js'
import type {
  CreateVideoRequest,
  CreateVideoResponse,
  VideoDetailsResponse,
  CreateWebMVideoRequest,
  CreateWebMVideoResponse
} from '../types/index.js'

export class VideoGenerationService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async create(data: CreateVideoRequest): Promise<CreateVideoResponse> {
    return this.requestV2<CreateVideoResponse, CreateVideoRequest>(
      '/video/generate',
      {
        method: 'POST',
        body: data
      }
    )
  }

  async get(videoId: string): Promise<VideoDetailsResponse> {
    return this.requestV1<VideoDetailsResponse>('/video_status.get', {
      method: 'GET',
      queryParams: { video_id: videoId } as QueryParams
    })
  }

  async delete(videoId: string): Promise<void> {
    return this.requestV1<void>('/video.delete', {
      method: 'DELETE',
      queryParams: { video_id: videoId } as QueryParams
    })
  }

  async createWebM(
    data: CreateWebMVideoRequest
  ): Promise<CreateWebMVideoResponse> {
    return this.requestV1<CreateWebMVideoResponse, CreateWebMVideoRequest>(
      '/video.webm',
      {
        method: 'POST',
        body: data
      }
    )
  }
}
