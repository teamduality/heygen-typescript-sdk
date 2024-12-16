import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { UserService } from '../user.js'
import { mockApiResponse, mockApiError } from '../../test/setup.js'
import type {
  GetQuotaResponse,
  UserInfo,
  V1UserInfoResponse
} from '../../types/index.js'

describe('UserService', () => {
  const service = new UserService('test-api-key')

  describe('getRemainingQuota', () => {
    const mockResponse: GetQuotaResponse = {
      remaining_quota: 1000,
      details: {
        api: 500,
        seat: 500
      }
    }

    it('should get remaining quota successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      const result = await service.getRemainingQuota()
      expect(result).toEqual(mockResponse)
    })

    it('should handle zero quota', async () => {
      const zeroQuotaResponse: GetQuotaResponse = {
        remaining_quota: 0,
        details: {
          api: 0,
          seat: 0
        }
      }

      mockApiResponse(zeroQuotaResponse, { version: 'v2' })
      const result = await service.getRemainingQuota()
      expect(result).toEqual(zeroQuotaResponse)
    })

    describe('error handling', () => {
      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v2' })
        await expect(service.getRemainingQuota()).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v2' })
        await expect(service.getRemainingQuota()).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })

  describe('getCurrentUser', () => {
    const mockUserInfo: UserInfo = {
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User'
    }

    const mockResponse: V1UserInfoResponse = {
      code: 100,
      data: mockUserInfo,
      msg: null,
      message: null
    }

    it('should get current user info successfully', async () => {
      mockApiResponse(mockResponse, { version: 'v1' })
      const result = await service.getCurrentUser()
      expect(result).toEqual(mockUserInfo)
    })

    describe('error handling', () => {
      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v1' })
        await expect(service.getCurrentUser()).rejects.toThrow(
          'Unauthorized access'
        )
      })

      it('should handle invalid token', async () => {
        mockApiError(401, 'Invalid token', { version: 'v1' })
        await expect(service.getCurrentUser()).rejects.toThrow('Invalid token')
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v1' })
        await expect(service.getCurrentUser()).rejects.toThrow(
          'Internal server error'
        )
      })
    })
  })
})
