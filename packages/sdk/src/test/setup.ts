import { afterEach, beforeEach } from 'vitest'
import {
  mockFetch,
  createMockResponse,
  resetMock,
  type MockOptions
} from './fetchMock.js'

beforeEach(() => {
  resetMock()
})

afterEach(() => {
  resetMock()
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
  { version = 'v1' }: MockOptions = {}
) {
  const response = createMockResponse(message, version, status, true)
  mockFetch.mockResolvedValueOnce(response)
}

export { mockFetch }
