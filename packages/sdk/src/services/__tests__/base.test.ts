import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { BaseService } from '../base.js'
import { mockApiResponse, mockApiError, mockFetch } from '../../test/setup.js'
import { V1_BASE_URL, V2_BASE_URL } from '../../config/endpoints.js'

// Create a concrete implementation for testing
class TestService extends BaseService {
  async testV1Request<T, B = Record<string, never>>(options: {
    path: string
    method: 'GET' | 'POST' | 'DELETE'
    body?: B
    queryParams?: Record<string, string>
  }) {
    return this.requestV1<T, B>(options.path, {
      method: options.method,
      body: options.body,
      queryParams: options.queryParams
    })
  }

  async testV2Request<T, B = Record<string, never>>(options: {
    path: string
    method: 'GET' | 'POST' | 'DELETE'
    body?: B
    queryParams?: Record<string, string>
  }) {
    return this.requestV2<T, B>(options.path, {
      method: options.method,
      body: options.body,
      queryParams: options.queryParams
    })
  }

  async testFileRequest<T>(options: {
    path: string
    method: 'POST'
    file: Buffer | Blob
    contentType: string
  }) {
    return this.requestV1<T>(options.path, {
      method: options.method,
      file: options.file,
      contentType: options.contentType
    })
  }
}

describe('BaseService', () => {
  const service = new TestService('test-api-key')

  describe('V1 requests', () => {
    it('should make GET request with query params', async () => {
      const mockResponse = { data: 'test' }
      mockApiResponse(mockResponse, { version: 'v1' })

      const result = await service.testV1Request<typeof mockResponse>({
        path: '/test',
        method: 'GET',
        queryParams: { foo: 'bar', baz: '123' }
      })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        `${V1_BASE_URL}/test?foo=bar&baz=123`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'X-Api-Key': 'test-api-key'
          })
        })
      )
    })

    it('should make POST request with body', async () => {
      const mockResponse = { data: 'test' }
      const requestBody = { test: 'data' }
      mockApiResponse(mockResponse, { version: 'v1' })

      const result = await service.testV1Request<
        typeof mockResponse,
        typeof requestBody
      >({
        path: '/test',
        method: 'POST',
        body: requestBody
      })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        `${V1_BASE_URL}/test`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Api-Key': 'test-api-key'
          }),
          body: JSON.stringify(requestBody)
        })
      )
    })
  })

  describe('V2 requests', () => {
    it('should make GET request with query params', async () => {
      const mockResponse = { data: 'test' }
      mockApiResponse(mockResponse, { version: 'v2' })

      const result = await service.testV2Request<typeof mockResponse>({
        path: '/test',
        method: 'GET',
        queryParams: { foo: 'bar', baz: '123' }
      })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        `${V2_BASE_URL}/test?foo=bar&baz=123`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'X-Api-Key': 'test-api-key'
          })
        })
      )
    })

    it('should make POST request with body', async () => {
      const mockResponse = { data: 'test' }
      const requestBody = { test: 'data' }
      mockApiResponse(mockResponse, { version: 'v2' })

      const result = await service.testV2Request<
        typeof mockResponse,
        typeof requestBody
      >({
        path: '/test',
        method: 'POST',
        body: requestBody
      })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        `${V2_BASE_URL}/test`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Api-Key': 'test-api-key'
          }),
          body: JSON.stringify(requestBody)
        })
      )
    })
  })

  describe('File uploads', () => {
    it('should handle file upload requests', async () => {
      const mockResponse = { data: 'test' }
      const fileData = Buffer.from('test file content')
      mockApiResponse(mockResponse, { version: 'v1' })

      const result = await service.testFileRequest<typeof mockResponse>({
        path: '/upload',
        method: 'POST',
        file: fileData,
        contentType: 'image/jpeg'
      })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        `${V1_BASE_URL}/upload`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'image/jpeg',
            'X-Api-Key': 'test-api-key'
          }),
          body: fileData
        })
      )
    })
  })

  describe('Error handling', () => {
    it('should handle V1 errors', async () => {
      mockApiError(403, 'Unauthorized', { version: 'v1' })

      await expect(
        service.testV1Request({
          path: '/test',
          method: 'GET'
        })
      ).rejects.toThrow('Unauthorized')
    })

    it('should handle V2 errors', async () => {
      mockApiError(403, 'Unauthorized', { version: 'v2' })

      await expect(
        service.testV2Request({
          path: '/test',
          method: 'GET'
        })
      ).rejects.toThrow('Unauthorized')
    })

    it('should handle non-JSON responses', async () => {
      mockApiError(500, 'Internal Server Error', { version: 'v1' })

      await expect(
        service.testV1Request({
          path: '/test',
          method: 'GET'
        })
      ).rejects.toThrow('Internal Server Error')
    })
  })
})
