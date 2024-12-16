import { BaseService } from './base.js'
import type {
  ListSupportedLanguagesResponse,
  TranslateVideoRequest,
  TranslateVideoResponse,
  TranslationStatusResponse
} from '../types/video.js'

export class VideoTranslationService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async listLanguages(): Promise<ListSupportedLanguagesResponse> {
    return this.requestV2<ListSupportedLanguagesResponse>(
      '/video_translation.supported_languages',
      'GET'
    )
  }

  async translate(
    data: TranslateVideoRequest
  ): Promise<TranslateVideoResponse> {
    return this.requestV2<TranslateVideoResponse, TranslateVideoRequest>(
      '/video_translation.translate',
      'POST',
      data
    )
  }

  async getStatus(
    videoTranslateId: string
  ): Promise<TranslationStatusResponse> {
    return this.requestV2<
      TranslationStatusResponse,
      { video_translate_id: string }
    >('/video_translation.get_status', 'GET', {
      video_translate_id: videoTranslateId
    })
  }
}
