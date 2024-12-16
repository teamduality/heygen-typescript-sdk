import { BaseService } from './base.js'
import type {
  ListBrandVoicesRequest,
  ListBrandVoicesResponse
} from '../types/brand.js'

export class BrandService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async listVoices(
    params?: ListBrandVoicesRequest
  ): Promise<ListBrandVoicesResponse> {
    return this.requestV2<ListBrandVoicesResponse, ListBrandVoicesRequest>(
      '/brand_voice/list',
      'GET',
      params
    )
  }
}
