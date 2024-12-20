import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { PhotoAvatarService } from '../photo-avatar.js'
import { mockApiResponse, mockApiError } from '../../test/setup.js'
import type {
  GeneratePhotoRequest,
  GeneratePhotoResponse,
  CreatePhotoGroupRequest,
  CreatePhotoGroupResponse,
  TrainingJobStatus,
  AddLooksRequest,
  AddLooksResponse,
  AddMotionRequest,
  AddMotionResponse,
  AddSoundEffectRequest,
  AddSoundEffectResponse,
  UpscaleAvatarRequest,
  UpscaleAvatarResponse,
  TrainPhotoGroupRequest,
  GenerateLooksRequest,
  GenerateLooksResponse,
  GenerationStatusResponse,
  PhotoAvatarGroup
} from '../../types/index.js'

describe('PhotoAvatarService', () => {
  const service = new PhotoAvatarService('test-api-key')

  describe('generatePhoto', () => {
    const mockRequest: GeneratePhotoRequest = {
      name: 'Test Photo',
      age: 'Young Adult',
      gender: 'Woman',
      ethnicity: 'Asian American',
      orientation: 'square',
      pose: 'half_body',
      style: 'Realistic',
      appearance: 'A professional woman in a business suit'
    }

    const mockResponse: GeneratePhotoResponse = {
      generation_id: 'test-generation-id'
    }

    it('should generate a photo successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.generatePhoto(mockRequest)
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle invalid parameters', async () => {
        mockApiError(400, 'Invalid parameters', { version: 'v2' })
        await expect(service.generatePhoto(mockRequest)).rejects.toThrow(
          'Invalid parameters'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.generatePhoto(mockRequest)).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.generatePhoto(mockRequest)).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('createGroup', () => {
    const mockRequest: CreatePhotoGroupRequest = {
      name: 'Test Group',
      image_key: 'image/test-key/original'
    }

    const mockResponse: CreatePhotoGroupResponse = {
      id: 'test-group-id',
      group_id: 'test-group-id',
      name: 'Test Group',
      image_url: 'https://example.com/image.jpg',
      created_at: 1234567890,
      status: 'pending',
      is_motion: false,
      motion_preview_url: null,
      business_type: 'user_upload',
      upscale_availability: {
        available: false,
        reason: 'Photo avatar look upload not completed'
      },
      upscaled: false,
      background_sound_effect: null
    }

    it('should create a photo avatar group successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.createGroup(mockRequest)
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle invalid parameters', async () => {
        mockApiError(400, 'Invalid parameters', { version: 'v2' })
        await expect(service.createGroup(mockRequest)).rejects.toThrow(
          'Invalid parameters'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.createGroup(mockRequest)).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.createGroup(mockRequest)).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('getTrainingStatus', () => {
    const mockResponse: TrainingJobStatus = {
      status: 'pending',
      error_msg: null,
      created_at: 1234567890,
      updated_at: null
    }

    it('should get training status successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.getTrainingStatus('test-group-id')
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle group not found', async () => {
        mockApiError(404, 'Group not found', { version: 'v2' })
        await expect(
          service.getTrainingStatus('invalid-group')
        ).rejects.toThrow('Group not found')
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(
          service.getTrainingStatus('test-group-id')
        ).rejects.toThrow('Unauthorized access')
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(
          service.getTrainingStatus('test-group-id')
        ).rejects.toThrow('Internal server error')
      })
    })
  })

  describe('addLooks', () => {
    const mockRequest: AddLooksRequest = {
      group_id: 'test-group-id',
      image_keys: ['image/test-key-1/original', 'image/test-key-2/original'],
      name: 'Test Looks'
    }

    const mockResponse: AddLooksResponse = {
      photo_avatar_list: [
        {
          id: 'test-look-1',
          image_url: 'https://example.com/look1.jpg',
          created_at: 1234567890,
          name: 'Test Look 1',
          status: 'pending',
          group_id: 'test-group-id',
          is_motion: false,
          motion_preview_url: null,
          business_type: 'generated',
          upscale_availability: {
            available: false,
            reason: 'Photo avatar look upload not completed'
          },
          upscaled: false,
          background_sound_effect: null
        }
      ]
    }

    it('should add looks to a group successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.addLooks(mockRequest)
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle invalid parameters', async () => {
        mockApiError(400, 'Invalid parameters', { version: 'v2' })
        await expect(service.addLooks(mockRequest)).rejects.toThrow(
          'Invalid parameters'
        )
      })

      it('should handle group not found', async () => {
        mockApiError(404, 'Group not found', { version: 'v2' })
        await expect(service.addLooks(mockRequest)).rejects.toThrow(
          'Group not found'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.addLooks(mockRequest)).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.addLooks(mockRequest)).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('addMotion', () => {
    const mockRequest: AddMotionRequest = {
      id: 'test-avatar-id'
    }

    const mockResponse: AddMotionResponse = {
      id: 'test-motion-avatar-id'
    }

    it('should add motion to an avatar successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.addMotion(mockRequest)
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle avatar not found', async () => {
        mockApiError(404, 'Avatar not found', { version: 'v2' })
        await expect(service.addMotion(mockRequest)).rejects.toThrow(
          'Avatar not found'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.addMotion(mockRequest)).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.addMotion(mockRequest)).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('addSoundEffect', () => {
    const mockRequest: AddSoundEffectRequest = {
      id: 'test-avatar-id'
    }

    const mockResponse: AddSoundEffectResponse = {
      sound_effect_id: 'test-sound-effect-id'
    }

    it('should add sound effect to an avatar successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.addSoundEffect(mockRequest)
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle avatar not found', async () => {
        mockApiError(404, 'Avatar not found', { version: 'v2' })
        await expect(service.addSoundEffect(mockRequest)).rejects.toThrow(
          'Avatar not found'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.addSoundEffect(mockRequest)).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.addSoundEffect(mockRequest)).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('upscale', () => {
    const mockRequest: UpscaleAvatarRequest = {
      id: 'test-avatar-id'
    }

    const mockResponse: UpscaleAvatarResponse = {
      id: 'test-upscaled-avatar-id'
    }

    it('should upscale an avatar successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.upscale(mockRequest)
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle avatar not found', async () => {
        mockApiError(404, 'Avatar not found', { version: 'v2' })
        await expect(service.upscale(mockRequest)).rejects.toThrow(
          'Avatar not found'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.upscale(mockRequest)).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.upscale(mockRequest)).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('trainGroup', () => {
    const mockRequest: TrainPhotoGroupRequest = {
      group_id: 'test-group-id'
    }

    it('should train a group successfully', async () => {
      mockApiResponse(null, { version: 'v2' })
      await expect(service.trainGroup(mockRequest)).resolves.toBeNull()
    })

    describe('error handling', () => {
      it('should handle group not found', async () => {
        mockApiError(404, 'Group not found', { version: 'v2' })
        await expect(service.trainGroup(mockRequest)).rejects.toThrow(
          'Group not found'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.trainGroup(mockRequest)).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.trainGroup(mockRequest)).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('generateLooks', () => {
    const mockRequest: GenerateLooksRequest = {
      group_id: 'test-group-id',
      prompt: 'Professional business attire',
      orientation: 'square',
      pose: 'half_body',
      style: 'Realistic'
    }

    const mockResponse: GenerateLooksResponse = {
      generation_id: 'test-generation-id'
    }

    it('should generate looks successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.generateLooks(mockRequest)
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle invalid parameters', async () => {
        mockApiError(400, 'Invalid parameters', { version: 'v2' })
        await expect(service.generateLooks(mockRequest)).rejects.toThrow(
          'Invalid parameters'
        )
      })

      it('should handle group not found', async () => {
        mockApiError(404, 'Group not found', { version: 'v2' })
        await expect(service.generateLooks(mockRequest)).rejects.toThrow(
          'Group not found'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.generateLooks(mockRequest)).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.generateLooks(mockRequest)).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('checkGenerationStatus', () => {
    const mockResponse: GenerationStatusResponse = {
      id: 'test-generation-id',
      status: 'success',
      msg: null,
      image_url_list: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg'
      ],
      image_key_list: ['image/test-key-1/original', 'image/test-key-2/original']
    }

    it('should check generation status successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.checkGenerationStatus('test-generation-id')
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle generation not found', async () => {
        mockApiError(404, 'Generation not found', { version: 'v2' })
        await expect(
          service.checkGenerationStatus('invalid-generation')
        ).rejects.toThrow('Generation not found')
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(
          service.checkGenerationStatus('test-generation-id')
        ).rejects.toThrow('Unauthorized access')
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(
          service.checkGenerationStatus('test-generation-id')
        ).rejects.toThrow('Internal server error')
      })
    })
  })

  describe('getDetails', () => {
    const mockResponse: PhotoAvatarGroup = {
      id: 'test-avatar-id',
      image_url: 'https://example.com/avatar.jpg',
      created_at: 1234567890,
      name: 'Test Avatar',
      status: 'completed',
      group_id: 'test-group-id',
      is_motion: false,
      motion_preview_url: null,
      business_type: 'user_upload',
      upscale_availability: {
        available: false,
        reason: 'The photo avatar look is too large to upscale'
      },
      upscaled: false,
      background_sound_effect: null
    }

    it('should get avatar details successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.getDetails('test-avatar-id')
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle avatar not found', async () => {
        mockApiError(404, 'Avatar not found', { version: 'v2' })
        await expect(service.getDetails('invalid-avatar')).rejects.toThrow(
          'Avatar not found'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.getDetails('test-avatar-id')).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.getDetails('test-avatar-id')).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('listInGroup', () => {
    const mockResponse: AvatarGroupData = {
      avatar_list: [
        {
          id: 'test-avatar-1',
          group_id: 'test-group-id',
          name: 'Test Avatar 1',
          image_url: 'https://example.com/avatar1.jpg',
          created_at: 1234567890,
          status: 'completed',
          is_motion: false,
          motion_preview_url: null,
          business_type: 'user_upload',
          upscale_availability: {
            available: false,
            reason: 'Photo avatar look upload not completed'
          },
          upscaled: false,
          background_sound_effect: null
        },
        {
          id: 'test-avatar-2',
          group_id: 'test-group-id',
          name: 'Test Avatar 2',
          image_url: 'https://example.com/avatar2.jpg',
          created_at: 1234567891,
          status: 'completed',
          is_motion: false,
          motion_preview_url: null,
          business_type: 'user_upload',
          upscale_availability: {
            available: false,
            reason: 'Photo avatar look upload not completed'
          },
          upscaled: false,
          background_sound_effect: null
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
