import { httpClientV1, httpClientV2 } from '../utils/httpClient.js'

export abstract class BaseService {
  constructor(
    protected readonly apiKey: string,
    protected readonly version: 'v1' | 'v2' = 'v2'
  ) {}

  protected async request<T, P = Record<string, unknown>>(
    path: string,
    method: 'GET' | 'POST' | 'DELETE',
    params?: P
  ): Promise<T> {
    const client = this.version === 'v1' ? httpClientV1 : httpClientV2
    return client<T>(path, method, { apiKey: this.apiKey, ...params })
  }
}
