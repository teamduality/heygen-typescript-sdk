import { listAvatars } from './services/avatars.js'
import { listVoices } from './services/voices.js'
import { createVideo, getVideoDetails, deleteVideo } from './services/videos.js'
import {
  createStreamingSession,
  startStreamingSession,
  listStreamingSessions,
  submitICE,
  sendTask,
  closeSession,
  interruptTask,
  createSessionToken,
  listStreamingAvatars
} from './services/streaming.js'

import type {
  CreateVideoRequest,
  CreateVideoResponse,
  ListAvatarsResponse,
  ListVoicesResponse,
  CreateStreamingSessionRequest,
  CreateStreamingSessionResponse,
  StartStreamingSessionRequest,
  StartStreamingSessionResponse,
  ListStreamingSessionsResponse,
  SubmitICERequest,
  SubmitICEResponse,
  SendTaskRequest,
  SendTaskResponse,
  CloseSessionRequest,
  CloseSessionResponse,
  InterruptTaskRequest,
  CreateSessionTokenResponse,
  ListStreamingAvatarsResponse
} from './types/index.js'

export class HeygenSDK {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
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

  async createStreamingSession(
    data: CreateStreamingSessionRequest
  ): Promise<CreateStreamingSessionResponse> {
    return createStreamingSession(this.apiKey, data)
  }

  async startStreamingSession(
    data: StartStreamingSessionRequest
  ): Promise<StartStreamingSessionResponse> {
    return startStreamingSession(this.apiKey, data)
  }

  async listStreamingSessions(): Promise<ListStreamingSessionsResponse> {
    return listStreamingSessions(this.apiKey)
  }

  async submitICE(data: SubmitICERequest): Promise<SubmitICEResponse> {
    return submitICE(this.apiKey, data)
  }

  async sendTask(data: SendTaskRequest): Promise<SendTaskResponse> {
    return sendTask(this.apiKey, data)
  }

  async closeSession(data: CloseSessionRequest): Promise<CloseSessionResponse> {
    return closeSession(this.apiKey, data)
  }

  async interruptTask(data: InterruptTaskRequest): Promise<void> {
    return interruptTask(this.apiKey, data)
  }

  async createSessionToken(): Promise<CreateSessionTokenResponse> {
    return createSessionToken(this.apiKey)
  }

  async listStreamingAvatars(): Promise<ListStreamingAvatarsResponse> {
    return listStreamingAvatars(this.apiKey)
  }
}

export * from './types/index.js'
export * from './types/avatar.js'
export * from './types/voice.js'
