import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { BrandService } from '../brand.js'
import { mockApiResponse, mockApiError } from '../../test/setup.js'
import type {
  ListBrandVoicesRequest,
  ListBrandVoicesResponse,
  BrandVoice
} from '../../types/index.js'

describe('BrandService', () => {
  const service = new BrandService('test-api-key')

  describe('listVoices', () => {
    const mockBrandVoices: BrandVoice[] = [
      {
        id: 'brand-voice-1',
        name: 'Corporate Voice',
        blacklist: ['slang', 'informal'],
        whitelist: ['professional', 'formal'],
        tones: ['confident', 'authoritative'],
        vocabulary: ['synergy', 'innovation']
      },
      {
        id: 'brand-voice-2',
        name: 'Casual Voice',
        blacklist: ['technical', 'complex'],
        whitelist: ['simple', 'friendly'],
        tones: ['casual', 'approachable'],
        vocabulary: ['awesome', 'great']
      }
    ]

    const mockResponse: ListBrandVoicesResponse = {
      list: mockBrandVoices,
      total: 2,
      token: null
    }

    it('should list brand voices without parameters', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.listVoices()
      expect(result).toEqual(mockResponse)
    })

    it('should list brand voices with limit', async () => {
      const params: ListBrandVoicesRequest = {
        limit: 1
      }

      const firstVoice = mockBrandVoices[0]
      if (!firstVoice) throw new Error('Mock data missing')

      const limitedResponse: ListBrandVoicesResponse = {
        list: [firstVoice],
        total: 2,
        token: 'next-page-token'
      }

      mockApiResponse(limitedResponse, { version: 'v2' })
      const result = await service.listVoices(params)
      expect(result).toEqual(limitedResponse)
    })

    it('should list brand voices with pagination token', async () => {
      const params: ListBrandVoicesRequest = {
        token: 'next-page-token'
      }

      const paginatedResponse: ListBrandVoicesResponse = {
        list: [mockBrandVoices[1]!],
        total: 2,
        token: null
      }

      mockApiResponse(paginatedResponse, { version: 'v2' })
      const result = await service.listVoices(params)
      expect(result).toEqual(paginatedResponse)
    })

    it('should list brand voices with name only', async () => {
      const params: ListBrandVoicesRequest = {
        name_only: true
      }

      const nameOnlyResponse: ListBrandVoicesResponse = {
        list: mockBrandVoices.map(({ id, name }) => ({
          id,
          name,
          blacklist: [],
          whitelist: [],
          tones: [],
          vocabulary: []
        })),
        total: 2,
        token: null
      }

      mockApiResponse(nameOnlyResponse, { version: 'v2' })
      const result = await service.listVoices(params)
      expect(result).toEqual(nameOnlyResponse)
    })

    describe('error handling', () => {
      it('should handle invalid limit', async () => {
        const params: ListBrandVoicesRequest = {
          limit: -1
        }

        mockApiError(400, 'Invalid limit parameter', { version: 'v2' })
        await expect(service.listVoices(params)).rejects.toThrow(
          'Invalid limit parameter'
        )
      })

      it('should handle invalid pagination token', async () => {
        const params: ListBrandVoicesRequest = {
          token: 'invalid-token'
        }

        mockApiError(400, 'Invalid pagination token', { version: 'v2' })
        await expect(service.listVoices(params)).rejects.toThrow(
          'Invalid pagination token'
        )
      })

      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.listVoices()).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.listVoices()).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })
})
