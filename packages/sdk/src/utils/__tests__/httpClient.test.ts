import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { httpClient, APIError } from '../httpClient.js'
import { mockApiResponse, mockApiError, mockFetch } from '../../test/setup.js'

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

      const result = await httpClient<typeof mockData>({
        url: testUrl,
        method: 'GET',
        data: { apiKey: testApiKey }
      })
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
        httpClient({
          url: testUrl,
          method: 'GET',
          data: { apiKey: testApiKey }
        })
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

      const result = await httpClient<typeof mockData>({
        url: testUrl,
        method: 'GET',
        data: { apiKey: testApiKey }
      })
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
        httpClient({
          url: testUrl,
          method: 'GET',
          data: { apiKey: testApiKey }
        })
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

      await httpClient({
        url: testUrl,
        method: 'GET',
        data: { apiKey: testApiKey }
      })
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

      await httpClient({
        url: testUrl,
        method: 'POST',
        data: requestBody
      })
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
      const fileContent = Buffer.from('test file content')
      const mockResponse = { url: 'https://example.com/file.jpg' }

      const mockFetchResponse = new Response(
        JSON.stringify({
          code: 100,
          message: 'success',
          data: mockResponse
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
      mockFetch.mockResolvedValueOnce(mockFetchResponse)

      const result = await httpClient<typeof mockResponse>({
        url: 'https://api.test.com/endpoint',
        method: 'POST',
        data: fileContent,
        headers: {
          'Content-Type': 'image/jpeg'
        }
      })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test.com/endpoint',
        expect.objectContaining({
          method: 'POST',
          body: fileContent,
          headers: expect.objectContaining({
            'Content-Type': 'image/jpeg'
          })
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
        httpClient({
          url: testUrl,
          method: 'GET',
          data: { apiKey: testApiKey }
        })
      ).rejects.toThrow('Request failed with status 500')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(
        httpClient({
          url: testUrl,
          method: 'GET',
          data: { apiKey: testApiKey }
        })
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
        httpClient({
          url: testUrl,
          method: 'GET',
          data: { apiKey: testApiKey }
        })
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
        httpClient({
          url: testUrl,
          method: 'GET',
          data: { apiKey: testApiKey }
        })
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
        httpClient({
          url: testUrl,
          method: 'GET',
          data: { apiKey: testApiKey }
        })
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
        httpClient({
          url: testUrl,
          method: 'GET',
          data: { apiKey: testApiKey }
        })
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
        httpClient({
          url: testUrl,
          method: 'GET',
          data: { apiKey: testApiKey }
        })
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
        httpClient({
          url: testUrl,
          method: 'GET',
          data: { apiKey: testApiKey }
        })
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

      const result = await httpClient<typeof mockData>({
        url: testUrl,
        method: 'GET',
        data: { apiKey: testApiKey }
      })
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

      const result = await httpClient<typeof mockData>({
        url: testUrl,
        method: 'GET',
        data: { apiKey: testApiKey }
      })
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
        httpClient({
          url: testUrl,
          method: 'GET',
          data: { apiKey: testApiKey }
        })
      ).rejects.toThrow('Unknown error')
    })
  })

  describe('error code handling', () => {
    it('should handle rate limit error', async () => {
      const mockResponse = {
        ok: false,
        status: 429,
        headers: { get: () => 'application/json' },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              code: 400123,
              message: 'Exceed rate limit'
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      let error: unknown
      try {
        await httpClient({
          url: testUrl,
          method: 'GET',
          data: { apiKey: testApiKey }
        })
        expect.fail('Should have thrown an error')
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(APIError)
      expect((error as APIError).message).toBe('Exceed rate limit')
      expect((error as APIError).code).toBe(400123)
    })

    it('should handle unauthorized error', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        headers: { get: () => 'application/json' },
        text: () =>
          Promise.resolve(
            JSON.stringify({
              code: 40102,
              message: 'Unauthorized'
            })
          )
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      let error: unknown
      try {
        await httpClient({
          url: testUrl,
          method: 'GET',
          data: { apiKey: testApiKey }
        })
        expect.fail('Should have thrown an error')
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(APIError)
      expect((error as APIError).message).toBe('Unauthorized')
      expect((error as APIError).code).toBe(40102)
    })

    const errorCases = [
      { code: 40118, message: 'Cannot use as a template' },
      { code: 40012400128, message: 'Invalid querying parameter' },
      { code: 400123, message: 'Exceed rate limit' },
      { code: 40102, message: 'Unauthorized' },
      { code: 40056, message: 'Failed to generate audio' },
      { code: 10001, message: 'Session state wrong: new' },
      { code: 10002, message: 'Session state wrong: connecting' },
      { code: 10003, message: 'Session state wrong: connected' },
      { code: 10004, message: 'Session state wrong: closing' },
      { code: 10005, message: 'Session state wrong: closed' },
      { code: 10006, message: 'Session not found' },
      { code: 10007, message: 'Concurrent limit reached' },
      { code: 10012, message: 'Avatar not found' },
      { code: 10013, message: 'Avatar not allowed' },
      { code: 10014, message: 'Session full' },
      { code: 10015, message: 'Trial API limit reached' }
    ]

    errorCases.forEach(({ code, message }) => {
      it(`should handle error code ${code}`, async () => {
        const mockResponse = {
          ok: false,
          status: 400,
          headers: { get: () => 'application/json' },
          text: () =>
            Promise.resolve(
              JSON.stringify({
                code,
                message: 'Original message'
              })
            )
        }
        mockFetch.mockResolvedValueOnce(mockResponse)

        let error: unknown
        try {
          await httpClient({
            url: testUrl,
            method: 'GET',
            data: { apiKey: testApiKey }
          })
          expect.fail('Should have thrown an error')
        } catch (e) {
          error = e
        }

        expect(error).toBeInstanceOf(APIError)
        expect((error as APIError).message).toBe(message)
        expect((error as APIError).code).toBe(code)
      })
    })
  })
})
