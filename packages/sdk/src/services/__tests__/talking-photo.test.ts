import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { TalkingPhotoService } from '../talking-photo.js'
import { mockApiResponse, mockApiError } from '../../test/setup.js'
import type {
  TalkingPhoto,
  ListTalkingPhotosResponse,
  UploadTalkingPhotoResponse,
  TalkingPhotoContentType
} from '../../types/index.js'

describe('TalkingPhotoService', () => {
  const service = new TalkingPhotoService('test-api-key')

  describe('list', () => {
    const mockTalkingPhotos: TalkingPhoto[] = [
      {
        id: 'photo-1',
        circle_image: 'https://example.com/circle1.jpg',
        image_url: 'https://example.com/photo1.jpg'
      },
      {
        id: 'photo-2',
        circle_image: 'https://example.com/circle2.jpg',
        image_url: 'https://example.com/photo2.jpg'
      }
    ]

    const mockResponse: ListTalkingPhotosResponse = {
      list: mockTalkingPhotos
    }

    it('should list talking photos successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v1' })
      const result = await service.list()
      expect(result).toEqual(mockResponse)
    })

    it('should handle empty list', async () => {
      const emptyResponse: ListTalkingPhotosResponse = {
        list: []
      }

      mockApiResponse(emptyResponse, { version: 'v1' })
      const result = await service.list()
      expect(result).toEqual(emptyResponse)
    })

    describe('error handling', () => {
      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v1' })
        await expect(service.list()).rejects.toThrow('Unauthorized access')
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v1' })
        await expect(service.list()).rejects.toThrow('Internal server error')
      })
    })
  })

  describe('upload', () => {
    const mockResponse: UploadTalkingPhotoResponse = {
      talking_photo_id: 'new-photo-id',
      talking_photo_url: 'https://example.com/new-photo.jpg'
    }

    describe('jpeg upload', () => {
      it('should upload jpeg image successfully', async () => {
        const imageBuffer = Buffer.from('fake-jpeg-data')
        const contentType: TalkingPhotoContentType = 'image/jpeg'

        mockApiResponse(mockResponse, { version: 'v1' })
        const result = await service.upload(imageBuffer, contentType)
        expect(result).toEqual(mockResponse)
      })
    })

    describe('png upload', () => {
      it('should upload png image successfully', async () => {
        const imageBuffer = Buffer.from('fake-png-data')
        const contentType: TalkingPhotoContentType = 'image/png'

        mockApiResponse(mockResponse, { version: 'v1' })
        const result = await service.upload(imageBuffer, contentType)
        expect(result).toEqual(mockResponse)
      })
    })

    describe('error handling', () => {
      it('should handle invalid file type', async () => {
        const imageBuffer = Buffer.from('fake-image-data')
        const contentType = 'image/gif' as TalkingPhotoContentType

        mockApiError(400, 'Invalid file type', { version: 'v1' })
        await expect(service.upload(imageBuffer, contentType)).rejects.toThrow(
          'Invalid file type'
        )
      })

      it('should handle file too large', async () => {
        const largeBuffer = Buffer.alloc(100 * 1024 * 1024) // 100MB
        const contentType: TalkingPhotoContentType = 'image/jpeg'

        mockApiError(413, 'File too large', { version: 'v1' })
        await expect(service.upload(largeBuffer, contentType)).rejects.toThrow(
          'File too large'
        )
      })

      it('should handle unauthorized access', async () => {
        const imageBuffer = Buffer.from('fake-image-data')
        const contentType: TalkingPhotoContentType = 'image/jpeg'

        mockApiError(403, 'Unauthorized access', { version: 'v1' })
        await expect(service.upload(imageBuffer, contentType)).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        const imageBuffer = Buffer.from('fake-image-data')
        const contentType: TalkingPhotoContentType = 'image/jpeg'

        mockApiError(500, 'Internal server error', { version: 'v1' })
        await expect(service.upload(imageBuffer, contentType)).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('delete', () => {
    it('should delete talking photo successfully', async () => {
      mockApiResponse(null, { version: 'v2' })
      await service.delete('photo-id')
    })

    describe('error handling', () => {
      it('should handle not found errors', async () => {
        mockApiError(404, 'Photo not found', { version: 'v2' })
        await expect(service.delete('non-existent')).rejects.toThrow(
          'Photo not found'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.delete('photo-id')).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.delete('photo-id')).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })
})
