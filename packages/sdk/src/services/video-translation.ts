import { BASE_URL } from '../config/endpoints.js'
import { httpClient } from '../utils/httpClient.js'
import type {
  ListSupportedLanguagesResponse,
  TranslateVideoRequest,
  TranslateVideoResponse,
  TranslationStatusResponse
} from '../types/video.js'

export async function listSupportedLanguages(
  apiKey: string
): Promise<ListSupportedLanguagesResponse> {
  return httpClient(`${BASE_URL}/v2/video_translate/target_languages`, 'GET', {
    apiKey
  })
}

export async function translateVideo(
  apiKey: string,
  data: TranslateVideoRequest
): Promise<TranslateVideoResponse> {
  return httpClient(`${BASE_URL}/v2/video_translate`, 'POST', {
    apiKey,
    ...data
  })
}

export async function getTranslationStatus(
  apiKey: string,
  videoTranslateId: string
): Promise<TranslationStatusResponse> {
  return httpClient(
    `${BASE_URL}/v2/video_translate/${videoTranslateId}`,
    'GET',
    { apiKey }
  )
}
