import { StreamingService } from './services/streaming.js'
import { AvatarsService } from './services/avatars.js'
import { VoicesService } from './services/voices.js'
import { VideoGenerationService } from './services/videos.js'
import { VideoManagementService } from './services/video-management.js'
import { VideoTranslationService } from './services/video-translation.js'
import { TemplatesService } from './services/templates.js'

// Export types
export type {
  CreateVideoRequest,
  CreateVideoResponse,
  ListVoicesResponse
  // ... rest of type exports
} from './types/index.js'

export class HeygenSDK {
  protected readonly apiKey: string
  public streaming: StreamingService
  public videos: VideoAPI
  public avatars: AvatarsService
  public voices: VoicesService
  public templates: TemplatesService

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.streaming = new StreamingService(apiKey)
    this.videos = new VideoAPI(apiKey)
    this.avatars = new AvatarsService(apiKey)
    this.voices = new VoicesService(apiKey)
    this.templates = new TemplatesService(apiKey)
  }
}

export class VideoAPI {
  public generation: VideoGenerationService
  public management: VideoManagementService
  public translation: VideoTranslationService

  constructor(protected readonly apiKey: string) {
    this.generation = new VideoGenerationService(apiKey)
    this.management = new VideoManagementService(apiKey)
    this.translation = new VideoTranslationService(apiKey)
  }
}

// Export all services for direct use if needed
export {
  StreamingService,
  AvatarsService,
  VoicesService,
  VideoGenerationService,
  VideoManagementService,
  VideoTranslationService,
  TemplatesService
}

// Export types
export * from './types/index.js'
export * from './types/avatar.js'
export * from './types/voice.js'
