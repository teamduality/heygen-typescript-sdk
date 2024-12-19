import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { AvatarsService } from '../avatars.js'
import { mockApiResponse, mockApiError } from '../../test/setup.js'
import type {
  AvatarListData,
  AvatarGroupListData,
  ListAvatarGroupsRequest,
  AvatarGroupData
} from '../../types/index.js'

describe('AvatarsService', () => {
  const service = new AvatarsService('test-api-key')

  describe('list', () => {
    const mockResponse: AvatarListData = {
      avatars: [
        {
          avatar_id: 'test-avatar-1',
          avatar_name: 'Test Avatar 1',
          gender: 'male',
          preview_image_url: 'https://example.com/avatar1.jpg',
          preview_video_url: 'https://example.com/avatar1.mp4'
        },
        {
          avatar_id: 'test-avatar-2',
          avatar_name: 'Test Avatar 2',
          gender: 'female',
          preview_image_url: 'https://example.com/avatar2.jpg',
          preview_video_url: 'https://example.com/avatar2.mp4'
        }
      ],
      talking_photos: []
    }

    it('should list avatars successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.list()
      expect(result).toEqual(mockResponse)
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

  describe('listGroups', () => {
    const mockResponse: AvatarGroupListData = {
      total_count: 2,
      avatar_group_list: [
        {
          id: 'group-1',
          name: 'Test Group 1',
          created_at: 1234567890,
          num_looks: 1,
          preview_image_url: 'https://example.com/group1.jpg',
          group_type: 'PUBLIC_PHOTO',
          train_status: null
        },
        {
          id: 'group-2',
          name: 'Test Group 2',
          created_at: 1234567891,
          num_looks: 1,
          preview_image_url: 'https://example.com/group2.jpg',
          group_type: 'PRIVATE',
          train_status: 'empty'
        }
      ]
    }

    it('should list avatar groups without parameters', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.listGroups()
      expect(result).toEqual(mockResponse)
    })

    it('should list avatar groups with parameters', async () => {
      const params: ListAvatarGroupsRequest = {
        include_public: true
      }

      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.listGroups(params)
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle invalid parameters', async () => {
        const params: ListAvatarGroupsRequest = {
          include_public: true
        }

        mockApiError(400, 'Invalid parameters', { version: 'v2' })
        await expect(service.listGroups(params)).rejects.toThrow(
          'Invalid parameters'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.listGroups()).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.listGroups()).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('listInGroup', () => {
    const mockResponse: AvatarGroupData = {
      avatar_list: [
        {
          avatar_id: 'test-avatar-1',
          avatar_name: 'Test Avatar 1',
          gender: 'unknown',
          preview_image_url: 'https://example.com/avatar1.jpg',
          preview_video_url: 'https://example.com/avatar1.mp4'
        },
        {
          avatar_id: 'test-avatar-2',
          avatar_name: 'Test Avatar 2',
          gender: 'unknown',
          preview_image_url: 'https://example.com/avatar2.jpg',
          preview_video_url: 'https://example.com/avatar2.mp4'
        }
      ]
    }

    it('should list avatars in a group successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.listInGroup('test-group-id')
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle group not found', async () => {
        mockApiError(404, 'Group not found', { version: 'v2' })
        await expect(service.listInGroup('invalid-group')).rejects.toThrow(
          'Group not found'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.listInGroup('test-group-id')).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.listInGroup('test-group-id')).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })
})
