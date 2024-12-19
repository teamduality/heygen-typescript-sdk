import { httpClient, type HttpClientOptions } from '../utils/httpClient.js'
import { V1_BASE_URL, V2_BASE_URL } from '../config/endpoints.js'

type QueryParamValue = string | number | boolean | undefined
export type QueryParams = Record<string, QueryParamValue>

interface BaseRequestOptions {
  method: 'GET' | 'POST' | 'DELETE'
  headers?: Record<string, string>
  baseUrl?: string
}

interface JsonRequestOptions<T> extends BaseRequestOptions {
  body?: T
  queryParams?: QueryParams
}

interface FileRequestOptions extends BaseRequestOptions {
  file: Buffer | Blob
  contentType: string
}

export type RequestOptions<T> = JsonRequestOptions<T> | FileRequestOptions

export function isFileRequest(
  options: RequestOptions<unknown>
): options is FileRequestOptions {
  return 'file' in options && 'contentType' in options
}

export abstract class BaseService {
  constructor(
    protected readonly apiKey: string,
    protected readonly useAuthHeader = false
  ) {}

  protected getAuthHeaders(): Record<string, string> {
    return this.useAuthHeader
      ? { Authorization: `Bearer ${this.apiKey}` }
      : { 'X-Api-Key': this.apiKey }
  }

  protected async requestV1<T, B = Record<string, never>>(
    path: string,
    options: RequestOptions<B>
  ): Promise<T> {
    const baseUrl = V1_BASE_URL
    return this.request<T, B>(path, baseUrl, options)
  }

  protected async requestV2<T, B = Record<string, never>>(
    path: string,
    options: RequestOptions<B>
  ): Promise<T> {
    const baseUrl = V2_BASE_URL
    return this.request<T, B>(path, baseUrl, options)
  }

  private async request<T, B = Record<string, unknown>>(
    path: string,
    baseUrl: string,
    options: RequestOptions<B>
  ): Promise<T> {
    const url = new URL(`${options.baseUrl || baseUrl}${path}`)

    if ('queryParams' in options && options.queryParams) {
      Object.entries(options.queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers
    }

    const requestOptions: HttpClientOptions = {
      url: url.toString(),
      method: options.method,
      headers
    }

    if (isFileRequest(options)) {
      return httpClient<T>({
        ...requestOptions,
        data: options.file,
        headers: {
          ...headers,
          'Content-Type': options.contentType
        }
      })
    }

    return httpClient<T, B>({
      ...requestOptions,
      data: options.body
    })
  }
}
