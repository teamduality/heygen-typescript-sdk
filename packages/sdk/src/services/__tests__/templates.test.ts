import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { TemplatesService } from '../templates.js'
import { mockApiResponse, mockApiError } from '../../test/setup.js'
import type {
  Template,
  ListTemplatesResponse,
  GetTemplateResponse,
  GenerateFromTemplateRequest,
  GenerateFromTemplateResponse,
  TemplateVariable
} from '../../types/index.js'

describe('TemplatesService', () => {
  const service = new TemplatesService('test-api-key')

  describe('list', () => {
    const mockTemplates: Template[] = [
      {
        template_id: 'template-1',
        name: 'Corporate Introduction',
        thumbnail_image_url: 'https://example.com/template1.jpg'
      },
      {
        template_id: 'template-2',
        name: 'Product Showcase',
        thumbnail_image_url: 'https://example.com/template2.jpg'
      }
    ]

    const mockResponse: ListTemplatesResponse = {
      templates: mockTemplates
    }

    it('should list templates successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.list()
      expect(result).toEqual(mockResponse)
    })

    it('should handle empty list', async () => {
      const emptyResponse: ListTemplatesResponse = {
        templates: []
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

  describe('get', () => {
    const mockVariables: Record<string, TemplateVariable> = {
      title: {
        name: 'Title Text',
        type: 'text',
        properties: {
          content: 'Default Title'
        }
      },
      background: {
        name: 'Background Image',
        type: 'image',
        properties: {
          url: 'https://example.com/default-bg.jpg',
          fit: 'cover'
        }
      },
      avatar: {
        name: 'Presenter',
        type: 'character',
        properties: {
          character_id: 'default-avatar',
          voice_id: 'default-voice'
        }
      }
    }

    const mockResponse: GetTemplateResponse = {
      variables: mockVariables
    }

    it('should get template details successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.get('template-1')
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle template not found', async () => {
        mockApiError(404, 'Template not found', { version: 'v2' })
        await expect(service.get('non-existent')).rejects.toThrow(
          'Template not found'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.get('template-1')).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.get('template-1')).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('generate', () => {
    const mockResponse: GenerateFromTemplateResponse = {
      video_id: 'generated-video-id'
    }

    it('should generate video without options', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.generate('template-1')
      expect(result).toEqual(mockResponse)
    })

    it('should generate video with all options', async () => {
      const request: GenerateFromTemplateRequest = {
        caption: true,
        callback_id: 'test-callback',
        title: 'Generated Video'
      }

      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.generate('template-1', request)
      expect(result).toEqual(mockResponse)
    })

    describe('error handling', () => {
      it('should handle template not found', async () => {
        mockApiError(404, 'Template not found', { version: 'v2' })
        await expect(service.generate('non-existent')).rejects.toThrow(
          'Template not found'
        )
      })

      it('should handle invalid parameters', async () => {
        const invalidRequest: GenerateFromTemplateRequest = {
          title: ''
        }

        mockApiError(400, 'Invalid parameters', { version: 'v2' })
        await expect(
          service.generate('template-1', invalidRequest)
        ).rejects.toThrow('Invalid parameters')
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.generate('template-1')).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.generate('template-1')).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })
})
