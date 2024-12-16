import { BaseService } from './base.js'
import type { ListVoicesResponse } from '../types/index.js'

export class VoicesService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async list(): Promise<ListVoicesResponse> {
    return this.requestV2<ListVoicesResponse>('/voices', {
      method: 'GET'
    })
  }
}
