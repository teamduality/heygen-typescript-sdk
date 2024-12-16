import { BASE_URL } from '../config/endpoints.js'
import { httpClient } from '../utils/httpClient.js'
import type { ListVideosRequest, ListVideosResponse } from '../types/video.js'

export async function listVideos(
  apiKey: string,
  params?: ListVideosRequest
): Promise<ListVideosResponse> {
  return httpClient(`${BASE_URL}/v1/video.list`, 'GET', {
    apiKey,
    ...params
  })
}
