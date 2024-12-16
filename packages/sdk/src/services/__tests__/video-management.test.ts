import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { VideoManagementService } from '../video-management.js'
import { mockApiResponse, mockApiError } from '../../test/setup.js'
import type {
  ListVideosRequest,
  ListVideosResponse,
  VideoListItem
} from '../../types/index.js'

describe('VideoManagementService', () => {
  const service = new VideoManagementService('test-api-key')

  describe('list', () => {
    const mockVideos: VideoListItem[] = [
      {
        video_id: 'video-1',
        status: 'completed',
        created_at: 1234567890,
        type: 'GENERATED'
      },
      {
        video_id: 'video-2',
        status: 'processing',
        created_at: 1234567891,
        type: 'TRANSLATED'
      },
      {
        video_id: 'video-3',
        status: 'failed',
        created_at: 1234567892,
        type: 'GENERATED'
      }
    ]

    const mockResponse: ListVideosResponse = {
      code: 100,
      data: {
        videos: mockVideos,
        token: null
      },
      message: null
    }

    it('should list videos without parameters', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.list()
      expect(result).toEqual(mockResponse)
    })

    it('should list videos with pagination', async () => {
      const params: ListVideosRequest = {
        limit: 2,
        token: 'next-page'
      }

      const paginatedResponse: ListVideosResponse = {
        code: 100,
        data: {
          videos: mockVideos.slice(0, 2),
          token: 'next-token'
        },
        message: null
      }

      mockApiResponse(paginatedResponse, { version: 'v2' })
      const result = await service.list(params)
      expect(result).toEqual(paginatedResponse)
    })

    it('should handle empty list', async () => {
      const emptyResponse: ListVideosResponse = {
        code: 100,
        data: {
          videos: [],
          token: null
        },
        message: null
      }

      mockApiResponse(emptyResponse, { version: 'v2' })
      const result = await service.list()
      expect(result).toEqual(emptyResponse)
    })

    describe('error handling', () => {
      it('should handle invalid pagination token', async () => {
        const params: ListVideosRequest = {
          token: 'invalid-token'
        }

        mockApiError(400, 'Invalid pagination token', { version: 'v2' })
        await expect(service.list(params)).rejects.toThrow(
          'Invalid pagination token'
        )
      })

      it('should handle invalid limit', async () => {
        const params: ListVideosRequest = {
          limit: -1
        }

        mockApiError(400, 'Invalid limit parameter', { version: 'v2' })
        await expect(service.list(params)).rejects.toThrow(
          'Invalid limit parameter'
        )
      })

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
