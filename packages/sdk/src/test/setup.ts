import { afterEach, beforeEach } from 'vitest'
import {
  mockFetch,
  createMockResponse,
  resetMock,
  type MockOptions
} from './fetchMock.js'
import { vi } from 'vitest'
import type { V1ErrorResponse, V2ErrorResponse } from '../utils/httpClient.js'

beforeEach(() => {
  resetMock()
  mockFetch.mockClear()
})

afterEach(() => {
  resetMock()
  vi.restoreAllMocks()
  mockFetch.mockClear()
})

export function mockApiResponse<T>(
  data: T,
  { version = 'v1', status = 200 }: MockOptions = {}
) {
  const response = createMockResponse(data, version, status)
  mockFetch.mockResolvedValueOnce(response)
}

export function mockApiError(
  status: number,
  message: string,
  { version = 'v1', code = 'error' }: MockOptions & { code?: string } = {}
) {
  const errorData =
    version === 'v2'
      ? ({
          code: code,
          message: message
        } as V2ErrorResponse)
      : ({
          code: status,
          message: message,
          data: null
        } as V1ErrorResponse)

  const response = createMockResponse(errorData, version, status, true)
  mockFetch.mockResolvedValueOnce(response)
}

export { mockFetch }
