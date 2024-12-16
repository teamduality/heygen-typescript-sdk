import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { VideoGenerationService } from '../videos.js'
import { mockApiResponse, mockApiError } from '../../test/setup.js'
import type {
  CreateVideoRequest,
  CreateVideoResponse,
  VideoDetailsResponse,
  CreateWebMVideoRequest,
  CreateWebMVideoResponse
} from '../../types/index.js'

describe('VideoGenerationService', () => {
  const service = new VideoGenerationService('test-api-key')

  describe('create', () => {
    const mockResponse: CreateVideoResponse = {
      video_id: 'test-video-id'
    }

    describe('with different video input combinations', () => {
      it('should create video with avatar and text voice', async () => {
        const mockRequest: CreateVideoRequest = {
          video_inputs: [
            {
              character: {
                type: 'avatar',
                avatar_id: 'test-avatar',
                scale: 1,
                avatar_style: 'normal'
              },
              voice: {
                type: 'text',
                voice_id: 'test-voice',
                input_text: 'Hello world',
                emotion: 'Friendly'
              }
            }
          ],
          dimensions: { width: 1920, height: 1080 }
        }

        mockApiResponse(mockResponse, { version: 'v2' })
        const result = await service.create(mockRequest)
        expect(result).toEqual(mockResponse)
      })

      it('should create video with talking photo and audio voice', async () => {
        const mockRequest: CreateVideoRequest = {
          video_inputs: [
            {
              character: {
                type: 'talking_photo',
                talking_photo_id: 'test-photo',
                scale: 1,
                talking_photo_style: 'square',
                talking_style: 'stable'
              },
              voice: {
                type: 'audio',
                audio_url: 'https://example.com/audio.mp3'
              },
              background: {
                type: 'color',
                value: '#000000'
              }
            }
          ],
          dimensions: { width: 1920, height: 1080 }
        }

        mockApiResponse(mockResponse, { version: 'v2' })
        const result = await service.create(mockRequest)
        expect(result).toEqual(mockResponse)
      })

      it('should create video with silence and image background', async () => {
        const mockRequest: CreateVideoRequest = {
          video_inputs: [
            {
              voice: {
                type: 'silence',
                duration: 5000
              },
              background: {
                type: 'image',
                url: 'https://example.com/bg.jpg',
                fit: 'cover'
              }
            }
          ],
          dimensions: { width: 1920, height: 1080 }
        }

        mockApiResponse(mockResponse, { version: 'v2' })
        const result = await service.create(mockRequest)
        expect(result).toEqual(mockResponse)
      })

      it('should create video with video background', async () => {
        const mockRequest: CreateVideoRequest = {
          video_inputs: [
            {
              character: {
                type: 'avatar',
                avatar_id: 'test-avatar',
                scale: 1
              },
              voice: {
                type: 'text',
                voice_id: 'test-voice',
                input_text: 'Hello with video background'
              },
              background: {
                type: 'video',
                video_asset_id: 'test-bg-video',
                play_style: 'loop',
                fit: 'cover'
              }
            }
          ],
          dimensions: { width: 1920, height: 1080 }
        }

        mockApiResponse(mockResponse, { version: 'v2' })
        const result = await service.create(mockRequest)
        expect(result).toEqual(mockResponse)
      })
    })

    it('should handle optional parameters', async () => {
      const mockRequest: CreateVideoRequest = {
        caption: true,
        test: true,
        title: 'Test Video',
        callback_id: 'test-callback',
        callback_url: 'https://example.com/callback',
        video_inputs: [
          {
            character: {
              type: 'avatar',
              avatar_id: 'test-avatar',
              scale: 1
            },
            voice: {
              type: 'text',
              voice_id: 'test-voice',
              input_text: 'Test with all optional params'
            }
          }
        ],
        dimensions: { width: 1920, height: 1080 }
      }

      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.create(mockRequest)
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors gracefully', async () => {
      const mockRequest: CreateVideoRequest = {
        video_inputs: [
          {
            character: {
              type: 'avatar',
              avatar_id: 'test-avatar',
              scale: 1
            },
            voice: {
              type: 'text',
              voice_id: 'test-voice',
              input_text: 'Test error handling'
            }
          }
        ],
        dimensions: { width: 1920, height: 1080 }
      }

      mockApiError(400, 'Invalid request', { version: 'v2' })

      await expect(service.create(mockRequest)).rejects.toThrow(
        'Invalid request'
      )
    })
  })

  describe('get', () => {
    const mockResponse: VideoDetailsResponse = {
      id: 'test-video-id',
      status: 'completed',
      video_url: 'https://example.com/video.mp4',
      video_url_caption: 'https://example.com/video-caption.mp4',
      callback_id: 'test-callback',
      duration: 15,
      thumbnail_url: 'https://example.com/thumbnail.jpg',
      created_at: 1234567890
    }

    it('should get a completed video successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.get('test-video-id')
      expect(result).toEqual(mockResponse)
    })

    it('should get a processing video', async () => {
      const processingResponse: VideoDetailsResponse = {
        ...mockResponse,
        status: 'processing',
        video_url: undefined,
        video_url_caption: undefined
      }
      mockApiResponse(processingResponse, { version: 'v2' })
      const result = await service.get('test-video-id')
      expect(result).toEqual(processingResponse)
    })

    it('should get a failed video with error details', async () => {
      const failedResponse: VideoDetailsResponse = {
        ...mockResponse,
        status: 'failed',
        error: {
          code: 'RENDERING_FAILED',
          details: 'Failed to process video'
        }
      }
      mockApiResponse(failedResponse, { version: 'v2' })
      const result = await service.get('test-video-id')
      expect(result).toEqual(failedResponse)
    })

    describe('error handling', () => {
      it('should handle not found errors', async () => {
        mockApiError(404, 'Video not found', { version: 'v2' })
        await expect(service.get('non-existent')).rejects.toThrow(
          'Video not found'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.get('test-video-id')).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.get('test-video-id')).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('delete', () => {
    describe('successful deletion', () => {
      it('should delete a video successfully', async () => {
        mockApiResponse(null, { version: 'v2' })
        await service.delete('test-video-id')
      })

      it('should handle empty response', async () => {
        mockApiResponse(undefined, { version: 'v2' })
        await service.delete('test-video-id')
      })
    })

    describe('error handling', () => {
      it('should handle not found errors', async () => {
        mockApiError(404, 'Video not found', { version: 'v2' })
        await expect(service.delete('non-existent')).rejects.toThrow(
          'Video not found'
        )
      })

      it('should handle unauthorized deletion', async () => {
        mockApiError(403, 'Unauthorized deletion', { version: 'v2' })
        await expect(service.delete('test-video-id')).rejects.toThrow(
          'Unauthorized deletion'
        )
      })

      it('should handle video in use', async () => {
        mockApiError(400, 'Video is currently in use', { version: 'v2' })
        await expect(service.delete('test-video-id')).rejects.toThrow(
          'Video is currently in use'
        )
      })
    })
  })

  describe('createWebM', () => {
    const mockResponse: CreateWebMVideoResponse = {
      video_id: '7766dd5dfce942cc960438957ad5972f'
    }

    it('should create webm video with text input', async () => {
      const request: CreateWebMVideoRequest = {
        input_text: 'This is a WebM video generated by HeyGen API',
        voice_id: '1bd001e7e50f421d891986aad5158bc8',
        avatar_pose_id: 'Vanessa-invest-20220722',
        avatar_style: 'normal'
      }

      mockApiResponse(mockResponse, { version: 'v1' })
      const result = await service.createWebM(request)
      expect(result).toEqual(mockResponse)
    })

    it('should create webm video with audio input', async () => {
      const request: CreateWebMVideoRequest = {
        input_audio: 'https://example.com/audio.mp3',
        avatar_pose_id: 'Vanessa-invest-20220722',
        avatar_style: 'closeUp'
      }

      mockApiResponse(mockResponse, { version: 'v1' })
      const result = await service.createWebM(request)
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle invalid avatar style', async () => {
        const request: CreateWebMVideoRequest = {
          avatar_style: 'invalid' as any,
          input_text: 'Test'
        }

        mockApiError(400, 'Invalid avatar style', { version: 'v1' })
        await expect(service.createWebM(request)).rejects.toThrow(
          'Invalid avatar style'
        )
      })

      it('should handle missing required fields', async () => {
        const request: CreateWebMVideoRequest = {}

        mockApiError(400, 'Missing required fields', { version: 'v1' })
        await expect(service.createWebM(request)).rejects.toThrow(
          'Missing required fields'
        )
      })

      it('should handle both text and audio input provided', async () => {
        const request: CreateWebMVideoRequest = {
          input_text: 'Test',
          input_audio: 'https://example.com/audio.mp3'
        }

        mockApiError(400, 'Cannot specify both text and audio input', {
          version: 'v1'
        })
        await expect(service.createWebM(request)).rejects.toThrow(
          'Cannot specify both text and audio input'
        )
      })
    })
  })
})
