import { BASE_URL } from '../config/endpoints.js'
import { httpClient } from '../utils/httpClient.js'

import type {
  CreateVideoRequest,
  CreateVideoResponse,
  VideoDetailsResponse
} from '../types/video.js'

export async function createVideo(
  apiKey: string,
  videoData: CreateVideoRequest
): Promise<CreateVideoResponse> {
  return httpClient(`${BASE_URL}/video/generate`, 'POST', {
    ...videoData,
    apiKey
  })
}

export async function getVideoDetails(
  apiKey: string,
  videoId: string
): Promise<VideoDetailsResponse> {
  return httpClient(`${BASE_URL}/video/status`, 'GET', {
    video_id: videoId,
    apiKey
  })
}

export async function deleteVideo(
  apiKey: string,
  videoId: string
): Promise<any> {
  return httpClient(`${BASE_URL}/video?video_id=${videoId}`, 'DELETE', {
    apiKey
  })
}
