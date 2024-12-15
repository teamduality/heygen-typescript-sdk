import { authenticate } from './services/authentication.js'
import { apiRequest } from './services/api.js'
import { listAvatars } from './services/avatars.js'
import { listVoices } from './services/voices.js'
import { createVideo, getVideoDetails, deleteVideo } from './services/videos.js'

import type {
  CreateVideoRequest,
  CreateVideoResponse,
  ListAvatarsResponse,
  ListVoicesResponse
} from './types/index.js'

export class HeygenSDK {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async authenticate() {
    return authenticate(this.apiKey)
  }

  async makeRequest(endpoint: string, data: Record<string, any>) {
    return apiRequest(this.apiKey, endpoint, data)
  }

  async listAvatars(): Promise<ListAvatarsResponse> {
    return listAvatars(this.apiKey)
  }

  async listVoices(): Promise<ListVoicesResponse> {
    return listVoices(this.apiKey)
  }

  async createVideo(
    videoData: CreateVideoRequest
  ): Promise<CreateVideoResponse> {
    return createVideo(this.apiKey, videoData)
  }

  async getVideo(videoId: string) {
    return getVideoDetails(this.apiKey, videoId)
  }

  async deleteVideo(videoId: string) {
    return deleteVideo(this.apiKey, videoId)
  }
}

export * from './types/index.js'
export * from './types/avatar.js'
export * from './types/voice.js'
