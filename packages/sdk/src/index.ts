import { HEYGEN_API_BASE_URL } from './config/endpoints.js'
import { StreamingService } from './services/streaming.js'
import { AvatarsService } from './services/avatars.js'
import { VoicesService } from './services/voices.js'
import { VideoGenerationService } from './services/videos.js'
import { VideoManagementService } from './services/video-management.js'
import { VideoTranslationService } from './services/video-translation.js'
import { TemplatesService } from './services/templates.js'
import { UserService } from './services/user.js'
import { BrandService } from './services/brand.js'
import { AssetService } from './services/asset.js'
import { TalkingPhotoService } from './services/talking-photo.js'
import { AIAPI } from './services/ai.js'

// Export types
export type {
  CreateVideoRequest,
  CreateVideoResponse,
  ListVoicesResponse
  // ... rest of type exports
} from './types/index.js'

export class HeygenSDK {
  protected readonly apiKey: string
  public readonly basePath: string
  public streaming: StreamingService
  public videos: VideoAPI
  public avatars: AvatarsService
  public voices: VoicesService
  public templates: TemplatesService
  public user: UserService
  public brand: BrandService
  public assets: AssetService
  public ai: AIAPI

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.basePath = HEYGEN_API_BASE_URL
    this.streaming = new StreamingService(apiKey)
    this.videos = new VideoAPI(apiKey)
    this.avatars = new AvatarsService(apiKey)
    this.voices = new VoicesService(apiKey)
    this.templates = new TemplatesService(apiKey)
    this.user = new UserService(apiKey)
    this.brand = new BrandService(apiKey)
    this.assets = new AssetService(apiKey)
    this.ai = new AIAPI(apiKey)
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
  TemplatesService,
  UserService,
  BrandService,
  AssetService,
  TalkingPhotoService,
  AIAPI
}

// Export types
export * from './types/index.js'
