import type { V1Response, V2Response } from '../utils/httpClient.js'
import { mockFetch } from './mockSetup.js'

export interface MockOptions {
  version?: 'v1' | 'v2'
  status?: number
}

export function createMockResponse<T>(
  data: T,
  version: 'v1' | 'v2',
  status: number,
  isError = false
) {
  const responseData =
    version === 'v1'
      ? ({
          code: isError ? status : 100,
          message: isError ? data : 'success',
          data: isError ? null : data
        } as V1Response<T>)
      : ({
          error: isError ? data : null,
          data: isError ? null : data
        } as V2Response<T>)

  return {
    ok: !isError,
    status,
    headers: {
      get: (name: string) =>
        name.toLowerCase() === 'content-type' ? 'application/json' : null
    },
    text: async () => JSON.stringify(responseData),
    json: async () => responseData
  }
}

export function resetMock() {
  mockFetch.mockReset()
}

export { mockFetch }
