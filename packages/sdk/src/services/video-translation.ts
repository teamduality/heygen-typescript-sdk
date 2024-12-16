import { BaseService } from './base.js'
import type { QueryParams } from './base.js'
import type {
  ListSupportedLanguagesResponse,
  TranslateVideoRequest,
  TranslateVideoResponse,
  TranslationStatusResponse
} from '../types/index.js'

export class VideoTranslationService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async listLanguages(): Promise<ListSupportedLanguagesResponse> {
    return this.requestV2<ListSupportedLanguagesResponse>(
      '/video_translate/target_languages',
      {
        method: 'GET'
      }
    )
  }

  async translate(
    data: TranslateVideoRequest
  ): Promise<TranslateVideoResponse> {
    return this.requestV2<TranslateVideoResponse, TranslateVideoRequest>(
      '/video_translate',
      {
        method: 'POST',
        body: data
      }
    )
  }

  async getStatus(
    videoTranslateId: string
  ): Promise<TranslationStatusResponse> {
    return this.requestV2<TranslationStatusResponse>(
      `/video_translate/${videoTranslateId}`,
      {
        method: 'GET'
      }
    )
  }
}
