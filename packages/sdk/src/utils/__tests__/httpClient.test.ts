import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { httpClient, APIError } from '../httpClient.js'
import { mockFetch } from '../../test/setup.js'

describe('httpClient', () => {
  const testUrl = 'https://api.test.com/endpoint'
  const testApiKey = 'test-api-key'

  describe('V1 response handling', () => {
    it('should handle successful V1 response', async () => {
      const mockData = { foo: 'bar' }
      const mockResponse = {
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json'
        },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              code: 100,
              message: 'success',
              data: mockData
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await httpClient(testUrl, 'GET', { apiKey: testApiKey })
      expect(result).toEqual(mockData)
    })

    it('should handle V1 error response', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        headers: {
          get: () => 'application/json'
        },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              code: 400,
              message: 'Bad Request',
              data: null
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await expect(
        httpClient(testUrl, 'GET', { apiKey: testApiKey })
      ).rejects.toThrow(APIError)
    })
  })

  describe('V2 response handling', () => {
    it('should handle successful V2 response', async () => {
      const mockData = { foo: 'bar' }
      const mockResponse = {
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json'
        },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              error: null,
              data: mockData
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await httpClient(testUrl, 'GET', { apiKey: testApiKey })
      expect(result).toEqual(mockData)
    })

    it('should handle V2 error response', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        headers: {
          get: () => 'application/json'
        },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              error: 'Bad Request',
              data: null
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await expect(
        httpClient(testUrl, 'GET', { apiKey: testApiKey })
      ).rejects.toThrow(APIError)
    })
  })

  describe('request handling', () => {
    it('should handle GET requests', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json'
        },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              code: 100,
              message: 'success',
              data: null
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await httpClient(testUrl, 'GET', { apiKey: testApiKey })
      expect(mockFetch).toHaveBeenCalledWith(
        testUrl,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
    })

    it('should handle POST requests with JSON body', async () => {
      const requestBody = { test: 'data' }
      const mockResponse = {
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json'
        },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              code: 100,
              message: 'success',
              data: null
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await httpClient(testUrl, 'POST', requestBody)
      expect(mockFetch).toHaveBeenCalledWith(
        testUrl,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(requestBody)
        })
      )
    })

    it('should handle file uploads', async () => {
      const fileData = Buffer.from('test file content')
      const mockResponse = {
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json'
        },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              code: 100,
              message: 'success',
              data: null
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await httpClient(testUrl, 'POST', fileData, {
        'Content-Type': 'image/jpeg'
      })
      expect(mockFetch).toHaveBeenCalledWith(
        testUrl,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'image/jpeg'
          }),
          body: fileData
        })
      )
    })
  })

  describe('error handling', () => {
    it('should handle non-JSON responses', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        headers: {
          get: () => 'text/html'
        },
        text: () => Promise.resolve('<!DOCTYPE html><html>...</html>')
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await expect(
        httpClient(testUrl, 'GET', { apiKey: testApiKey })
      ).rejects.toThrow('Request failed with status 500')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(
        httpClient(testUrl, 'GET', { apiKey: testApiKey })
      ).rejects.toThrow('Network error')
    })

    it('should handle malformed JSON responses', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json'
        },
        text: () => Promise.resolve('{"invalid json')
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await expect(
        httpClient(testUrl, 'GET', { apiKey: testApiKey })
      ).rejects.toThrow()
    })
  })

  describe('error handling edge cases', () => {
    it('should handle V1 error with missing message', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        headers: { get: () => 'application/json' },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              code: 400,
              data: null
              // missing message field
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await expect(
        httpClient(testUrl, 'GET', { apiKey: testApiKey })
      ).rejects.toThrow('Unknown error')
    })

    it('should handle V2 error with null error field', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        headers: { get: () => 'application/json' },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              error: null,
              data: null
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await expect(
        httpClient(testUrl, 'GET', { apiKey: testApiKey })
      ).rejects.toThrow('Unknown error')
    })

    it('should handle V1 error with undefined message', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        headers: { get: () => 'application/json' },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              code: 400,
              message: undefined,
              data: null
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await expect(
        httpClient(testUrl, 'GET', { apiKey: testApiKey })
      ).rejects.toThrow('Unknown error')
    })

    it('should handle V2 error with undefined error', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        headers: { get: () => 'application/json' },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              error: undefined,
              data: null
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await expect(
        httpClient(testUrl, 'GET', { apiKey: testApiKey })
      ).rejects.toThrow('Unknown error')
    })

    it('should handle V1 success response with non-100 code', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              code: 200,
              message: 'Some message',
              data: null
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await expect(
        httpClient(testUrl, 'GET', { apiKey: testApiKey })
      ).rejects.toThrow('Some message')
    })
  })

  describe('response format handling', () => {
    it('should handle V2 success response', async () => {
      const mockData = { foo: 'bar' }
      const mockResponse = {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              error: null,
              data: mockData
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await httpClient(testUrl, 'GET', { apiKey: testApiKey })
      expect(result).toEqual(mockData)
    })

    it('should handle V1 success response', async () => {
      const mockData = { foo: 'bar' }
      const mockResponse = {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              code: 100,
              message: 'success',
              data: mockData
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await httpClient(testUrl, 'GET', { apiKey: testApiKey })
      expect(result).toEqual(mockData)
    })

    it('should handle response without error or code fields', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              someOtherField: 'value'
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await expect(
        httpClient(testUrl, 'GET', { apiKey: testApiKey })
      ).rejects.toThrow('Unknown error')
    })
  })
})
