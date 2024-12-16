import { BaseService } from './base.js'
import { BASE_URL } from '../config/endpoints.js'
import type {
  ListSupportedLanguagesResponse,
  TranslateVideoRequest,
  TranslateVideoResponse,
  TranslationStatusResponse
} from '../types/video.js'

export class VideoTranslationService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey, 'v2')
  }

  async listLanguages(): Promise<ListSupportedLanguagesResponse> {
    return this.request<ListSupportedLanguagesResponse>(
      `${BASE_URL}/v2/video_translation.supported_languages`,
      'GET'
    )
  }

  async translate(
    data: TranslateVideoRequest
  ): Promise<TranslateVideoResponse> {
    return this.request<TranslateVideoResponse, TranslateVideoRequest>(
      `${BASE_URL}/v2/video_translation.translate`,
      'POST',
      data
    )
  }

  async getStatus(
    videoTranslateId: string
  ): Promise<TranslationStatusResponse> {
    return this.request<
      TranslationStatusResponse,
      { video_translate_id: string }
    >(`${BASE_URL}/v2/video_translation.get_status`, 'GET', {
      video_translate_id: videoTranslateId
    })
  }
}
