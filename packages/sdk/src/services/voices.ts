import { BaseService } from './base.js'
import { BASE_URL } from '../config/endpoints.js'
import type { ListVoicesResponse } from '../types/voice.js'

export class VoicesService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey, 'v2')
  }

  async list(): Promise<ListVoicesResponse> {
    return this.request<ListVoicesResponse>(`${BASE_URL}/v2/voices`, 'GET')
  }
}
