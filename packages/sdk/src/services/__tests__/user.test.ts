import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { UserService } from '../user.js'
import { mockApiResponse, mockApiError, mockFetch } from '../../test/setup.js'
import type { APIError } from '../../utils/httpClient.js'
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

    it('should send X-Api-Key header', async () => {
      mockApiResponse(mockResponse, { version: 'v2' })
      await service.getRemainingQuota()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.heygen.com/v2/user/remaining_quota',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Api-Key': 'test-api-key'
          })
        })
      )
    })

    describe('error handling', () => {
      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', {
          version: 'v2',
          code: 'unauthorized'
        })
        try {
          await service.getRemainingQuota()
          expect(true).toBe(false)
        } catch (error) {
          const apiError = error as APIError
          expect(apiError).toBeInstanceOf(Error)
          expect(apiError.message).toBe('Unauthorized access')
          expect(apiError.statusCode).toBe(403)
        }
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', {
          version: 'v2',
          code: 'internal_error'
        })
        try {
          await service.getRemainingQuota()
          expect(true).toBe(false)
        } catch (error) {
          const apiError = error as APIError
          expect(apiError).toBeInstanceOf(Error)
          expect(apiError.message).toBe('Internal server error')
          expect(apiError.statusCode).toBe(500)
        }
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

    it('should send X-Api-Key header', async () => {
      mockApiResponse(mockResponse, { version: 'v1' })
      await service.getCurrentUser()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.heygen.com/v1/user/me',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Api-Key': 'test-api-key'
          })
        })
      )
    })

    describe('error handling', () => {
      it('should handle unauthorized access', async () => {
        mockApiError(403, 'Unauthorized access', { version: 'v1' })
        try {
          await service.getCurrentUser()
          expect(true).toBe(false)
        } catch (error) {
          const apiError = error as APIError
          expect(apiError).toBeInstanceOf(Error)
          expect(apiError.message).toBe('Unauthorized access')
          expect(apiError.statusCode).toBe(403)
        }
      })

      it('should handle invalid token', async () => {
        mockApiError(401, 'Invalid token', { version: 'v1' })
        try {
          await service.getCurrentUser()
          expect(true).toBe(false)
        } catch (error) {
          const apiError = error as APIError
          expect(apiError).toBeInstanceOf(Error)
          expect(apiError.message).toBe('Invalid token')
          expect(apiError.statusCode).toBe(401)
        }
      })

      it('should handle server errors', async () => {
        mockApiError(500, 'Internal server error', { version: 'v1' })
        try {
          await service.getCurrentUser()
          expect(true).toBe(false)
        } catch (error) {
          const apiError = error as APIError
          expect(apiError).toBeInstanceOf(Error)
          expect(apiError.message).toBe('Internal server error')
          expect(apiError.statusCode).toBe(500)
        }
      })
    })
  })
})
