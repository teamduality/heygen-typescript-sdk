import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { BaseService, isFileRequest } from '../base.js'
import type { RequestOptions } from '../base.js'
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

  async uploadFile(file: Buffer, contentType: string) {
    return this.requestV1<{ url: string }>('/upload', {
      method: 'POST',
      file: file,
      contentType: contentType
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
      const fileContent = Buffer.from('test file content')
      mockApiResponse(
        { url: 'https://example.com/file.jpg' },
        { version: 'v1' }
      )

      await service.uploadFile(fileContent, 'image/jpeg')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.heygen.com/v1/upload',
        expect.objectContaining({
          method: 'POST',
          body: fileContent,
          headers: expect.objectContaining({
            'Content-Type': 'image/jpeg',
            'X-Api-Key': 'test-api-key'
          })
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

  describe('isFileRequest', () => {
    it('should identify file requests correctly', () => {
      const fileRequest: RequestOptions<unknown> = {
        method: 'POST',
        file: Buffer.from('test'),
        contentType: 'image/jpeg'
      }
      expect(isFileRequest(fileRequest)).toBe(true)
    })

    it('should identify non-file requests correctly', () => {
      const jsonRequest: RequestOptions<unknown> = {
        method: 'POST',
        body: { test: 'data' }
      }
      expect(isFileRequest(jsonRequest)).toBe(false)
    })

    it('should handle partial file requests correctly', () => {
      const partialRequest: RequestOptions<unknown> = {
        method: 'POST',
        file: Buffer.from('test')
        // missing contentType
      }
      expect(isFileRequest(partialRequest)).toBe(false)
    })
  })
})
