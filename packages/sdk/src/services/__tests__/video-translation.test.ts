import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { VideoTranslationService } from '../video-translation.js'
import { mockApiResponse, mockApiError } from '../../test/setup.js'
import type {
  ListSupportedLanguagesResponse,
  TranslateVideoRequest,
  TranslateVideoResponse,
  TranslationStatusResponse
} from '../../types/index.js'

describe('VideoTranslationService', () => {
  const service = new VideoTranslationService('test-api-key')

  describe('listLanguages', () => {
    const mockResponse: ListSupportedLanguagesResponse = {
      languages: ['en', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh']
    }

    it('should list supported languages successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.listLanguages()
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.listLanguages()).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.listLanguages()).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('translate', () => {
    const mockResponse: TranslateVideoResponse = {
      video_translate_id: 'translation-1'
    }

    it('should translate video with minimal config', async () => {
      const request: TranslateVideoRequest = {
        video_url: 'https://example.com/video.mp4',
        output_language: 'es'
      }

      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.translate(request)
      expect(result).toEqual(mockResponse)
    })

    it('should translate video with full config', async () => {
      const request: TranslateVideoRequest = {
        video_url: 'https://example.com/video.mp4',
        output_language: 'fr',
        title: 'Translated Video',
        translate_audio_only: true,
        speaker_num: 2,
        callback_id: 'callback-1',
        enable_dynamic_duration: true,
        brand_voice_id: 'voice-1',
        callback_url: 'https://example.com/callback'
      }

      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.translate(request)
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle invalid video URL', async () => {
        const request: TranslateVideoRequest = {
          video_url: 'invalid-url',
          output_language: 'es'
        }

        mockApiError(400, 'Invalid video URL', { version: 'v2' })
        await expect(service.translate(request)).rejects.toThrow(
          'Invalid video URL'
        )
      })

      it('should handle unsupported language', async () => {
        const request: TranslateVideoRequest = {
          video_url: 'https://example.com/video.mp4',
          output_language: 'unsupported'
        }

        mockApiError(400, 'Unsupported language', { version: 'v2' })
        await expect(service.translate(request)).rejects.toThrow(
          'Unsupported language'
        )
      })

      it('should handle unauthorized access', async () => {
        const request: TranslateVideoRequest = {
          video_url: 'https://example.com/video.mp4',
          output_language: 'es'
        }

        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.translate(request)).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        const request: TranslateVideoRequest = {
          video_url: 'https://example.com/video.mp4',
          output_language: 'es'
        }

        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.translate(request)).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('getStatus', () => {
    const mockResponse: TranslationStatusResponse = {
      video_translate_id: 'translation-1',
      title: 'Translated Video',
      status: 'success',
      url: 'https://example.com/translated.mp4',
      message: null
    }

    it('should get translation status successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.getStatus('translation-1')
      expect(result).toEqual(mockResponse)
    })

    it('should handle processing status', async () => {
      const processingResponse: TranslationStatusResponse = {
        video_translate_id: 'translation-1',
        title: 'Translated Video',
        status: 'running',
        url: null,
        message: 'Translation in progress'
      }

      mockApiResponse(processingResponse, { version: 'v2' })
      const result = await service.getStatus('translation-1')
      expect(result).toEqual(processingResponse)
    })

    it('should handle failed status', async () => {
      const failedResponse: TranslationStatusResponse = {
        video_translate_id: 'translation-1',
        title: 'Translated Video',
        status: 'failed',
        url: null,
        message: 'Translation failed'
      }

      mockApiResponse(failedResponse, { version: 'v2' })
      const result = await service.getStatus('translation-1')
      expect(result).toEqual(failedResponse)
    })

    describe('error handling', () => {
      it('should handle translation not found', async () => {
        mockApiError(404, 'Translation not found', { version: 'v2' })
        await expect(service.getStatus('non-existent')).rejects.toThrow(
          'Translation not found'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.getStatus('translation-1')).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.getStatus('translation-1')).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })
})
