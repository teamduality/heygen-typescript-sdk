import { BaseService } from './base.js'
import { BASE_URL } from '../config/endpoints.js'
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
  ListStreamingAvatarsResponse
} from '../types/streaming.js'

export class StreamingService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey, 'v1') // v1 endpoint
  }

  async create(
    data: CreateStreamingSessionRequest
  ): Promise<CreateStreamingSessionResponse> {
    return this.request<
      CreateStreamingSessionResponse,
      CreateStreamingSessionRequest
    >(`${BASE_URL}/v1/streaming.new`, 'POST', data)
  }

  async start(
    data: StartStreamingSessionRequest
  ): Promise<StartStreamingSessionResponse> {
    return this.request<
      StartStreamingSessionResponse,
      StartStreamingSessionRequest
    >(`${BASE_URL}/v1/streaming/start`, 'POST', data)
  }

  async listSessions(): Promise<ListStreamingSessionsResponse> {
    return this.request<ListStreamingSessionsResponse>(
      `${BASE_URL}/v1/streaming/list`,
      'GET'
    )
  }

  async submitICE(data: SubmitICERequest): Promise<SubmitICEResponse> {
    return this.request<SubmitICEResponse, SubmitICERequest>(
      `${BASE_URL}/v1/streaming/ice`,
      'POST',
      data
    )
  }

  async sendTask(data: SendTaskRequest): Promise<SendTaskResponse> {
    return this.request<SendTaskResponse, SendTaskRequest>(
      `${BASE_URL}/v1/streaming/task`,
      'POST',
      data
    )
  }

  async closeSession(data: CloseSessionRequest): Promise<CloseSessionResponse> {
    return this.request<CloseSessionResponse, CloseSessionRequest>(
      `${BASE_URL}/v1/streaming/stop`,
      'POST',
      data
    )
  }

  async interruptTask(data: InterruptTaskRequest): Promise<void> {
    return this.request<void, InterruptTaskRequest>(
      `${BASE_URL}/v1/streaming/interrupt`,
      'POST',
      data
    )
  }

  async createSessionToken(): Promise<CreateSessionTokenResponse> {
    return this.request<CreateSessionTokenResponse>(
      `${BASE_URL}/v1/streaming/create_token`,
      'POST'
    )
  }

  async listStreamingAvatars(): Promise<ListStreamingAvatarsResponse> {
    return this.request<ListStreamingAvatarsResponse>(
      `${BASE_URL}/v1/streaming/avatar.list`,
      'GET'
    )
  }
}
