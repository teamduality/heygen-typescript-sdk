import '../../test/mockSetup.js'
import { describe, expect, it } from 'vitest'
import { StreamingService } from '../streaming.js'
import { mockApiResponse, mockApiError, mockFetch } from '../../test/setup.js'
import type {
  CreateStreamingSessionRequest,
  CreateStreamingSessionResponse,
  StartStreamingSessionRequest,
  StartStreamingSessionResponse,
  ListStreamingSessionsResponse,
  SubmitICERequest,
  SubmitICEResponse,
  SendTaskRequest,
  SendTaskResponse,
  CloseSessionRequest,
  CloseSessionResponse,
  InterruptTaskRequest,
  CreateSessionTokenResponse,
  ListStreamingAvatarsResponse,
  ICEServer,
  ICECandidate
} from '../../types/index.js'

describe('StreamingService', () => {
  const service = new StreamingService('test-api-key')
  const mockSessionId = 'test-session-id'

  describe('create', () => {
    const mockIceServers: ICEServer[] = [
      {
        urls: ['stun:stun.example.com:19302'],
        username: 'test-user',
        credential: 'test-credential'
      }
    ]

    const mockResponse: CreateStreamingSessionResponse = {
      ice_servers2: mockIceServers,
      sdp: {
        sdp: 'v=0\r\n...',
        type: 'offer'
      },
      session_id: mockSessionId
    }

    it('should create session with minimal config', async () => {
      const request: CreateStreamingSessionRequest = {
        quality: 'medium'
      }

      mockApiResponse(mockResponse, { version: 'v1' })
      const result = await service.create(request)
      expect(result).toEqual(mockResponse)
    })

    it('should create session with full config', async () => {
      const request: CreateStreamingSessionRequest = {
        quality: 'high',
        avatar_id: 'test-avatar',
        voice: {
          voice_id: 'test-voice',
          rate: 1.0,
          emotion: 'Friendly'
        },
        video_encoding: 'H264',
        knowledge_base: 'test-kb',
        version: 'v2',
        knowledge_base_id: 'test-kb-id',
        disable_idle_timeout: true
      }

      mockApiResponse(mockResponse, { version: 'v1' })
      const result = await service.create(request)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('start', () => {
    const mockResponse: StartStreamingSessionResponse = {
      status: 'connected'
    }

    it('should start streaming session', async () => {
      const request: StartStreamingSessionRequest = {
        session_id: mockSessionId,
        sdp: {
          type: 'answer',
          sdp: 'v=0\r\n...'
        }
      }

      mockApiResponse(mockResponse, { version: 'v1' })
      const result = await service.start(request)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('listSessions', () => {
    const mockResponse: ListStreamingSessionsResponse = {
      sessions: [
        {
          session_id: mockSessionId,
          status: 'connected',
          created_at: 1234567890
        }
      ]
    }

    it('should list streaming sessions', async () => {
      mockApiResponse(mockResponse, { version: 'v1' })
      const result = await service.listSessions()
      expect(result).toEqual(mockResponse)
    })
  })

  describe('submitICE', () => {
    const mockResponse: SubmitICEResponse = {
      status: 'success'
    }

    it('should submit ICE candidate', async () => {
      const candidate: ICECandidate = {
        candidate: 'candidate:1 1 UDP 2122252543...',
        sdpMid: '0',
        sdpMLineIndex: 0,
        usernameFragment: 'test-fragment'
      }

      const request: SubmitICERequest = {
        session_id: mockSessionId,
        candidate
      }

      mockApiResponse(mockResponse, { version: 'v1' })
      const result = await service.submitICE(request)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('sendTask', () => {
    const mockResponse: SendTaskResponse = {
      duration_ms: 1000,
      task_id: 'test-task-id'
    }

    it('should send sync task', async () => {
      const request: SendTaskRequest = {
        session_id: mockSessionId,
        text: 'Hello world',
        task_mode: 'sync',
        task_type: 'repeat'
      }

      mockApiResponse(mockResponse, { version: 'v1' })
      const result = await service.sendTask(request)
      expect(result).toEqual(mockResponse)
    })

    it('should send async chat task', async () => {
      const request: SendTaskRequest = {
        session_id: mockSessionId,
        text: 'How are you?',
        task_mode: 'async',
        task_type: 'chat'
      }

      mockApiResponse(mockResponse, { version: 'v1' })
      const result = await service.sendTask(request)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('closeSession', () => {
    const mockResponse: CloseSessionResponse = {
      status: 'closed'
    }

    it('should close session', async () => {
      const request: CloseSessionRequest = {
        session_id: mockSessionId
      }

      mockApiResponse(mockResponse, { version: 'v1' })
      const result = await service.closeSession(request)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('interruptTask', () => {
    it('should interrupt task', async () => {
      const request: InterruptTaskRequest = {
        session_id: mockSessionId
      }

      mockApiResponse(null, { version: 'v1' })
      await service.interruptTask(request)
    })
  })

  describe('createSessionToken', () => {
    const mockResponse: CreateSessionTokenResponse = {
      token: 'test-token'
    }

    it('should create session token', async () => {
      mockApiResponse(mockResponse, { version: 'v1' })
      const result = await service.createSessionToken()
      expect(result).toEqual(mockResponse)
    })
  })

  describe('listStreamingAvatars', () => {
    const mockResponse: ListStreamingAvatarsResponse = [
      {
        avatar_id: 'test-avatar',
        created_at: 1234567890,
        is_public: true,
        status: 'ACTIVE'
      }
    ]

    it('should list streaming avatars', async () => {
      mockApiResponse(mockResponse, { version: 'v1' })
      const result = await service.listStreamingAvatars()
      expect(result).toEqual(mockResponse)
    })
  })

  describe('error handling', () => {
    it('should handle invalid session ID', async () => {
      mockApiError(400, 'Invalid session ID', { version: 'v1' })
      await expect(
        service.start({
          session_id: 'invalid',
          sdp: { type: 'answer', sdp: '' }
        })
      ).rejects.toThrow('Invalid session ID')
    })

    it('should handle session not found', async () => {
      mockApiError(404, 'Session not found', { version: 'v1' })
      await expect(
        service.closeSession({ session_id: 'non-existent' })
      ).rejects.toThrow('Session not found')
    })

    it('should handle unauthorized access', async () => {
      mockApiError(403, 'Unauthorized access', { version: 'v1' })
      await expect(service.listSessions()).rejects.toThrow(
        'Unauthorized access'
      )
    })

    it('should handle server errors', async () => {
      mockApiError(500, 'Internal server error', { version: 'v1' })
      await expect(service.createSessionToken()).rejects.toThrow(
        'Internal server error'
      )
    })
  })

  it('should use Bearer token auth', async () => {
    const request: CreateStreamingSessionRequest = {
      quality: 'medium'
    }

    mockApiResponse(
      {
        ice_servers2: [],
        sdp: { sdp: 'v=0\r\n...', type: 'offer' },
        session_id: mockSessionId
      },
      { version: 'v1' }
    )

    await service.create(request)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-api-key'
        })
      })
    )
  })

  it('should use X-Api-Key for createSessionToken', async () => {
    mockApiResponse({ token: 'test-token' }, { version: 'v1' })

    await service.createSessionToken()

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Api-Key': 'test-api-key'
        })
      })
    )
  })
})
