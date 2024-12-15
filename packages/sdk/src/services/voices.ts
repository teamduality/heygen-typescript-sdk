import { BASE_URL } from '../config/endpoints.js'
import { httpClient } from '../utils/httpClient.js'
import type { ListVoicesResponse } from '../types/voice.js'

export async function listVoices(apiKey: string): Promise<ListVoicesResponse> {
  return httpClient(`${BASE_URL}/voices`, 'GET', { apiKey })
}
