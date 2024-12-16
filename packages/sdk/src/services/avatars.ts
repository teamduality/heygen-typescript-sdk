import { BASE_URL } from '../config/endpoints.js'
import { httpClient } from '../utils/httpClient.js'

import type { ListAvatarsResponse } from '../types/avatar.js'

export async function listAvatars(
  apiKey: string
): Promise<ListAvatarsResponse> {
  return httpClient(`${BASE_URL}/v2/avatars`, 'GET', { apiKey })
}
