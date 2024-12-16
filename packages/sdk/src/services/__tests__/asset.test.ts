import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { AssetService } from '../asset.js'
import { mockApiResponse, mockApiError } from '../../test/setup.js'
import type { AssetResponse, AssetContentType } from '../../types/index.js'

describe('AssetService', () => {
  const service = new AssetService('test-api-key')

  describe('upload', () => {
    const mockResponse: AssetResponse = {
      id: 'test-asset-id',
      name: 'test-image.jpg',
      file_type: 'image',
      folder_id: 'test-folder',
      meta: null,
      image_key: 'test-key',
      created_ts: 1234567890,
      url: 'https://example.com/test-image.jpg'
    }

    describe('image upload', () => {
      it('should upload jpeg image successfully', async () => {
        const imageBuffer = Buffer.from('fake-image-data')
        const contentType: AssetContentType = 'image/jpeg'

        mockApiResponse(mockResponse, { version: 'v1' })
        const result = await service.upload(imageBuffer, contentType)
        expect(result).toEqual(mockResponse)
      })

      it('should upload png image successfully', async () => {
        const imageBuffer = Buffer.from('fake-image-data')
        const contentType: AssetContentType = 'image/png'

        mockApiResponse(mockResponse, { version: 'v1' })
        const result = await service.upload(imageBuffer, contentType)
        expect(result).toEqual(mockResponse)
      })
    })

    describe('video upload', () => {
      const videoResponse: AssetResponse = {
        ...mockResponse,
        file_type: 'video',
        name: 'test-video.mp4',
        url: 'https://example.com/test-video.mp4'
      }

      it('should upload mp4 video successfully', async () => {
        const videoBuffer = Buffer.from('fake-video-data')
        const contentType: AssetContentType = 'video/mp4'

        mockApiResponse(videoResponse, { version: 'v1' })
        const result = await service.upload(videoBuffer, contentType)
        expect(result).toEqual(videoResponse)
      })

      it('should upload webm video successfully', async () => {
        const videoBuffer = Buffer.from('fake-video-data')
        const contentType: AssetContentType = 'video/webm'

        mockApiResponse(videoResponse, { version: 'v1' })
        const result = await service.upload(videoBuffer, contentType)
        expect(result).toEqual(videoResponse)
      })
    })

    describe('audio upload', () => {
      const audioResponse: AssetResponse = {
        ...mockResponse,
        file_type: 'audio',
        name: 'test-audio.mp3',
        url: 'https://example.com/test-audio.mp3'
      }

      it('should upload mp3 audio successfully', async () => {
        const audioBuffer = Buffer.from('fake-audio-data')
        const contentType: AssetContentType = 'audio/mpeg'

        mockApiResponse(audioResponse, { version: 'v1' })
        const result = await service.upload(audioBuffer, contentType)
        expect(result).toEqual(audioResponse)
      })
    })

    describe('error handling', () => {
      it('should handle invalid file type', async () => {
        const imageBuffer = Buffer.from('fake-image-data')
        const contentType = 'image/gif' as AssetContentType // Invalid content type

        mockApiError(400, 'Invalid file type', { version: 'v1' })
        await expect(service.upload(imageBuffer, contentType)).rejects.toThrow(
          'Invalid file type'
        )
      })

      it('should handle file too large', async () => {
        const largeBuffer = Buffer.alloc(100 * 1024 * 1024) // 100MB
        const contentType: AssetContentType = 'image/jpeg'

        mockApiError(413, 'File too large', { version: 'v1' })
        await expect(service.upload(largeBuffer, contentType)).rejects.toThrow(
          'File too large'
        )
      })

      it('should handle unauthorized access', async () => {
        const imageBuffer = Buffer.from('fake-image-data')
        const contentType: AssetContentType = 'image/jpeg'

        mockApiError(403, 'Unauthorized access', { version: 'v1' })
        await expect(service.upload(imageBuffer, contentType)).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        const imageBuffer = Buffer.from('fake-image-data')
        const contentType: AssetContentType = 'image/jpeg'

        mockApiError(500, 'Internal server error', { version: 'v1' })
        await expect(service.upload(imageBuffer, contentType)).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })
})
