import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { AIAPI } from '../ai.js'
import { TalkingPhotoService } from '../talking-photo.js'

describe('AIAPI', () => {
  const apiKey = 'test-api-key'
  const api = new AIAPI(apiKey)

  describe('initialization', () => {
    it('should create instance with API key', () => {
      expect(api).toBeInstanceOf(AIAPI)
      expect(api.talkingPhoto).toBeInstanceOf(TalkingPhotoService)
    })

    it('should pass API key to services', () => {
      // Access protected apiKey through TalkingPhotoService
      const talkingPhotoApiKey = (api.talkingPhoto as any).apiKey
      expect(talkingPhotoApiKey).toBe(apiKey)
    })
  })

  describe('service access', () => {
    it('should provide access to TalkingPhotoService', () => {
      expect(api.talkingPhoto).toBeDefined()
      expect(api.talkingPhoto.list).toBeInstanceOf(Function)
      expect(api.talkingPhoto.upload).toBeInstanceOf(Function)
      expect(api.talkingPhoto.delete).toBeInstanceOf(Function)
    })
  })
})
