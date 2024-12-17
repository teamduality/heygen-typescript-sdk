import type {
  V1Response,
  V2ErrorResponse,
  V2Response
} from '../utils/httpClient.js'
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
      ? isError
        ? data
        : ({
            code: 100,
            message: 'success',
            data: data
          } as V1Response<T>)
      : ({
          error: isError ? (data as V2ErrorResponse) : null,
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
    json: async () => responseData,
    clone: function () {
      return this
    }
  }
}

export function resetMock() {
  mockFetch.mockReset()
  mockFetch.mockImplementation(() => {
    throw new Error('Fetch not mocked')
  })
  global.fetch = mockFetch as unknown as typeof fetch
}

export { mockFetch }
