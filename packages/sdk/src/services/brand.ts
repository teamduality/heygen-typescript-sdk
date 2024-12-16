import { BaseService } from './base.js'
import type { QueryParams } from './base.js'
import type {
  ListBrandVoicesRequest,
  ListBrandVoicesResponse
} from '../types/index.js'

export class BrandService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async listVoices(
    params?: ListBrandVoicesRequest
  ): Promise<ListBrandVoicesResponse> {
    return this.requestV2<ListBrandVoicesResponse>('/brand_voice/list', {
      method: 'GET',
      queryParams: params as QueryParams
    })
  }
}
