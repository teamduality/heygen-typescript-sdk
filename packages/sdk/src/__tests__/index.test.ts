import { describe, expect, it } from 'vitest'
import * as sdk from '../index.js'

describe('SDK exports', () => {
  describe('services', () => {
    it('should export all service classes', () => {
      expect(sdk.StreamingService).toBeDefined()
      expect(sdk.AvatarsService).toBeDefined()
      expect(sdk.VoicesService).toBeDefined()
      expect(sdk.VideoGenerationService).toBeDefined()
      expect(sdk.VideoManagementService).toBeDefined()
      expect(sdk.VideoTranslationService).toBeDefined()
      expect(sdk.TemplatesService).toBeDefined()
      expect(sdk.UserService).toBeDefined()
      expect(sdk.BrandService).toBeDefined()
      expect(sdk.AssetService).toBeDefined()
      expect(sdk.TalkingPhotoService).toBeDefined()
      expect(sdk.AIAPI).toBeDefined()
    })
  })

  describe('main SDK class', () => {
    const sdk_instance = new sdk.HeygenSDK('test-api-key')

    it('should initialize with all services', () => {
      expect(sdk_instance.streaming).toBeDefined()
      expect(sdk_instance.videos).toBeDefined()
      expect(sdk_instance.avatars).toBeDefined()
      expect(sdk_instance.voices).toBeDefined()
      expect(sdk_instance.templates).toBeDefined()
      expect(sdk_instance.user).toBeDefined()
      expect(sdk_instance.brand).toBeDefined()
      expect(sdk_instance.assets).toBeDefined()
      expect(sdk_instance.ai).toBeDefined()
    })

    it('should initialize video API with all subservices', () => {
      expect(sdk_instance.videos.generation).toBeDefined()
      expect(sdk_instance.videos.management).toBeDefined()
      expect(sdk_instance.videos.translation).toBeDefined()
    })
  })
})
