import {
  listAvatars,
  listAvatarGroups,
  listAvatarsInGroup
} from './services/avatars.js'
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
import { listVideos } from './services/video-management.js'
import {
  listSupportedLanguages,
  translateVideo,
  getTranslationStatus
} from './services/video-translation.js'
import {
  listTemplates,
  getTemplate,
  generateFromTemplate
} from './services/templates.js'

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
  ListStreamingAvatarsResponse,
  ListVideosRequest,
  ListVideosResponse,
  ListSupportedLanguagesResponse,
  TranslateVideoRequest,
  TranslateVideoResponse,
  TranslationStatusResponse,
  ListTemplatesResponse,
  GetTemplateResponse,
  GenerateFromTemplateRequest,
  GenerateFromTemplateResponse,
  ListAvatarGroupsRequest,
  ListAvatarGroupsResponse,
  ListAvatarsInGroupResponse
} from './types/index.js'

export class HeygenSDK {
  protected readonly apiKey: string
  public streaming: StreamingAPI
  public videos: VideoAPI
  public avatars: AvatarAPI
  public voices: VoiceAPI
  public templates: TemplatesAPI

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.streaming = new StreamingAPI(apiKey)
    this.videos = new VideoAPI(apiKey)
    this.avatars = new AvatarAPI(apiKey)
    this.voices = new VoiceAPI(apiKey)
    this.templates = new TemplatesAPI(apiKey)
  }
}

export class StreamingAPI {
  constructor(protected readonly apiKey: string) {}

  async create(
    data: CreateStreamingSessionRequest
  ): Promise<CreateStreamingSessionResponse> {
    return createStreamingSession(this.apiKey, data)
  }

  async start(
    data: StartStreamingSessionRequest
  ): Promise<StartStreamingSessionResponse> {
    return startStreamingSession(this.apiKey, data)
  }

  async list(): Promise<ListStreamingSessionsResponse> {
    return listStreamingSessions(this.apiKey)
  }

  async submitICE(data: SubmitICERequest): Promise<SubmitICEResponse> {
    return submitICE(this.apiKey, data)
  }

  async sendTask(data: SendTaskRequest): Promise<SendTaskResponse> {
    return sendTask(this.apiKey, data)
  }

  async close(data: CloseSessionRequest): Promise<CloseSessionResponse> {
    return closeSession(this.apiKey, data)
  }

  async interrupt(data: InterruptTaskRequest): Promise<void> {
    return interruptTask(this.apiKey, data)
  }

  async createToken(): Promise<CreateSessionTokenResponse> {
    return createSessionToken(this.apiKey)
  }

  async listAvatars(): Promise<ListStreamingAvatarsResponse> {
    return listStreamingAvatars(this.apiKey)
  }
}

class VideoGenerationAPI {
  constructor(protected readonly apiKey: string) {}

  async create(data: CreateVideoRequest): Promise<CreateVideoResponse> {
    return createVideo(this.apiKey, data)
  }

  async get(videoId: string) {
    return getVideoDetails(this.apiKey, videoId)
  }

  async delete(videoId: string) {
    return deleteVideo(this.apiKey, videoId)
  }
}

class VideoManagementAPI {
  constructor(protected readonly apiKey: string) {}

  async list(params?: ListVideosRequest): Promise<ListVideosResponse> {
    return listVideos(this.apiKey, params)
  }
}

class VideoTranslationAPI {
  constructor(protected readonly apiKey: string) {}

  async listLanguages(): Promise<ListSupportedLanguagesResponse> {
    return listSupportedLanguages(this.apiKey)
  }

  async translate(
    data: TranslateVideoRequest
  ): Promise<TranslateVideoResponse> {
    return translateVideo(this.apiKey, data)
  }

  async getStatus(
    videoTranslateId: string
  ): Promise<TranslationStatusResponse> {
    return getTranslationStatus(this.apiKey, videoTranslateId)
  }
}

class VideoAPI {
  public generation: VideoGenerationAPI
  public management: VideoManagementAPI
  public translation: VideoTranslationAPI

  constructor(protected readonly apiKey: string) {
    this.generation = new VideoGenerationAPI(apiKey)
    this.management = new VideoManagementAPI(apiKey)
    this.translation = new VideoTranslationAPI(apiKey)
  }
}

export class AvatarAPI {
  constructor(protected readonly apiKey: string) {}

  async list(): Promise<ListAvatarsResponse> {
    return listAvatars(this.apiKey)
  }

  async listGroups(
    params?: ListAvatarGroupsRequest
  ): Promise<ListAvatarGroupsResponse> {
    return listAvatarGroups(this.apiKey, params)
  }

  async listInGroup(groupId: string): Promise<ListAvatarsInGroupResponse> {
    return listAvatarsInGroup(this.apiKey, groupId)
  }
}

export class VoiceAPI {
  constructor(protected readonly apiKey: string) {}

  async list(): Promise<ListVoicesResponse> {
    return listVoices(this.apiKey)
  }
}

class TemplatesAPI {
  constructor(protected readonly apiKey: string) {}

  async list(): Promise<ListTemplatesResponse> {
    return listTemplates(this.apiKey)
  }

  async get(templateId: string): Promise<GetTemplateResponse> {
    return getTemplate(this.apiKey, templateId)
  }

  async generate(
    templateId: string,
    data?: GenerateFromTemplateRequest
  ): Promise<GenerateFromTemplateResponse> {
    return generateFromTemplate(this.apiKey, templateId, data)
  }
}

export * from './types/index.js'
export * from './types/avatar.js'
export * from './types/voice.js'
