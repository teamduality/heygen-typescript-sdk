import { httpClientV1, httpClientV2 } from '../utils/httpClient.js'
import { V1_BASE_URL, V2_BASE_URL } from '../config/endpoints.js'

export abstract class BaseService {
  constructor(protected readonly apiKey: string) {}

  protected async requestV1<T, P = Record<string, unknown>>(
    path: string,
    method: 'GET' | 'POST' | 'DELETE',
    params?: P
  ): Promise<T> {
    return httpClientV1<T>(`${V1_BASE_URL}${path}`, method, {
      apiKey: this.apiKey,
      ...params
    })
  }

  protected async requestV2<T, P = Record<string, unknown>>(
    path: string,
    method: 'GET' | 'POST' | 'DELETE',
    params?: P
  ): Promise<T> {
    return httpClientV2<T>(`${V2_BASE_URL}${path}`, method, {
      apiKey: this.apiKey,
      ...params
    })
  }
}
