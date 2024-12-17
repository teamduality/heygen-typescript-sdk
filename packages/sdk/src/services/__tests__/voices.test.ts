import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { VoicesService } from '../voices.js'
import { mockApiResponse, mockApiError, mockFetch } from '../../test/setup.js'
import type { ListVoicesResponse, Voice } from '../../types/index.js'
import type { APIError } from '../../utils/httpClient.js'
import { vi } from 'vitest'

describe('VoicesService', () => {
  const service = new VoicesService('test-api-key')

  it('should use mocked fetch', async () => {
    mockApiResponse({ test: true }, { version: 'v2' })
    const fetchSpy = vi.spyOn(global, 'fetch')

    try {
      await service.list()
    } catch (e) {
      // Ignore errors
    }

    expect(fetchSpy).toHaveBeenCalled()
    expect(mockFetch).toHaveBeenCalled()
    expect(fetchSpy.mock.calls).toEqual(mockFetch.mock.calls)
  })

  describe('list', () => {
    const mockVoices: Voice[] = [
      {
        voice_id: 'voice-1',
        language: 'en-US',
        gender: 'Male',
        name: 'James',
        preview_audio: 'https://example.com/preview/james.mp3',
        support_pause: true,
        emotion_support: true
      },
      {
        voice_id: 'voice-2',
        language: 'en-US',
        gender: 'Female',
        name: 'Sarah',
        preview_audio: 'https://example.com/preview/sarah.mp3',
        support_pause: true,
        emotion_support: true
      },
      {
        voice_id: 'voice-3',
        language: 'es-ES',
        gender: 'unknown',
        name: 'Neural Voice',
        preview_audio: 'https://example.com/preview/neural.mp3',
        support_pause: false,
        emotion_support: false
      }
    ]

    const mockResponse: ListVoicesResponse = {
      voices: mockVoices
    }

    it('should list voices successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.list()
      expect(result).toEqual(mockResponse)
    })

    it('should handle empty list', async () => {
      const emptyResponse: ListVoicesResponse = {
        voices: []
      }

      mockApiResponse(emptyResponse, { version: 'v2' })
      const result = await service.list()
      expect(result).toEqual(emptyResponse)
    })

    it('should send X-Api-Key header', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      await service.list()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.heygen.com/v2/voices',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Api-Key': 'test-api-key'
          })
        })
      )
    })

    describe('error handling', () => {
      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', {
          version: 'v2',
          code: 'unauthorized'
        })
        try {
          await service.list()
          expect(true).toBe(false)
        } catch (error) {
          const apiError = error as APIError
          expect(apiError).toBeInstanceOf(Error)
          expect(apiError.message).toBe('Unauthorized access')
          expect(apiError.statusCode).toBe(403)
        }
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', {
          version: 'v2',
          code: 'internal_error'
        })
        try {
          await service.list()
          expect(true).toBe(false)
        } catch (error) {
          const apiError = error as APIError
          expect(apiError).toBeInstanceOf(Error)
          expect(apiError.message).toBe('Internal server error')
          expect(apiError.statusCode).toBe(500)
        }
      })
    })
  })
})
