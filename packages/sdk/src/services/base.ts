import { httpClient } from '../utils/httpClient.js'
import { V1_BASE_URL, V2_BASE_URL } from '../config/endpoints.js'

interface BaseRequestOptions {
  method: 'GET' | 'POST' | 'DELETE'
  headers?: Record<string, string>
}

interface JsonRequestOptions<T> extends BaseRequestOptions {
  params?: T
}

interface FileRequestOptions extends BaseRequestOptions {
  file: Buffer | Blob
  contentType: string
}

type RequestOptions<T> = JsonRequestOptions<T> | FileRequestOptions

function isFileRequest(
  options: RequestOptions<unknown>
): options is FileRequestOptions {
  return 'file' in options && 'contentType' in options
}

export abstract class BaseService {
  constructor(protected readonly apiKey: string) {}

  protected async requestV1<T, P = Record<string, never>>(
    path: string,
    options: RequestOptions<P>
  ): Promise<T> {
    const baseUrl = V1_BASE_URL
    return this.request<T, P>(path, baseUrl, options)
  }

  protected async requestV2<T, P = Record<string, never>>(
    path: string,
    options: RequestOptions<P>
  ): Promise<T> {
    const baseUrl = V2_BASE_URL
    return this.request<T, P>(path, baseUrl, options)
  }

  private async request<T, P = Record<string, never>>(
    path: string,
    baseUrl: string,
    options: RequestOptions<P>
  ): Promise<T> {
    const url = `${baseUrl}${path}`
    const headers = {
      'X-Api-Key': this.apiKey,
      ...options.headers
    }

    if (isFileRequest(options)) {
      return httpClient<T>(url, options.method, options.file, {
        'Content-Type': options.contentType,
        ...headers
      })
    }

    return httpClient<T, P>(url, options.method, options.params as P, headers)
  }
}
