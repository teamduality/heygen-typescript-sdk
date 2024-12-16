import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { VoicesService } from '../voices.js'
import { mockApiResponse, mockApiError } from '../../test/setup.js'
import type { ListVoicesResponse, Voice } from '../../types/index.js'

describe('VoicesService', () => {
  const service = new VoicesService('test-api-key')

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

    describe('error handling', () => {
      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.list()).rejects.toThrow('Unauthorized access')
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.list()).rejects.toThrow('Internal server error')
      })
    })
  })
})
