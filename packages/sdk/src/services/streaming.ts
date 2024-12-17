import { BaseService } from './base.js'
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
} from '../types/index.js'

export class StreamingService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey, true)
  }

  async create(
    data: CreateStreamingSessionRequest
  ): Promise<CreateStreamingSessionResponse> {
    return this.requestV1<
      CreateStreamingSessionResponse,
      CreateStreamingSessionRequest
    >('/streaming.new', {
      method: 'POST',
      body: data
    })
  }

  async start(
    data: StartStreamingSessionRequest
  ): Promise<StartStreamingSessionResponse> {
    return this.requestV1<
      StartStreamingSessionResponse,
      StartStreamingSessionRequest
    >('/streaming.start', {
      method: 'POST',
      body: data
    })
  }

  async listSessions(): Promise<ListStreamingSessionsResponse> {
    return this.requestV1<ListStreamingSessionsResponse>('/streaming.list', {
      method: 'GET'
    })
  }

  async submitICE(data: SubmitICERequest): Promise<SubmitICEResponse> {
    return this.requestV1<SubmitICEResponse, SubmitICERequest>(
      '/streaming.ice',
      {
        method: 'POST',
        body: data
      }
    )
  }

  async sendTask(data: SendTaskRequest): Promise<SendTaskResponse> {
    return this.requestV1<SendTaskResponse, SendTaskRequest>(
      '/streaming.task',
      {
        method: 'POST',
        body: data
      }
    )
  }

  async closeSession(data: CloseSessionRequest): Promise<CloseSessionResponse> {
    return this.requestV1<CloseSessionResponse, CloseSessionRequest>(
      '/streaming.stop',
      {
        method: 'POST',
        body: data
      }
    )
  }

  async interruptTask(data: InterruptTaskRequest): Promise<void> {
    return this.requestV1<void, InterruptTaskRequest>('/streaming.interrupt', {
      method: 'POST',
      body: data
    })
  }

  async createSessionToken(): Promise<CreateSessionTokenResponse> {
    return this.requestV1<CreateSessionTokenResponse>(
      '/streaming.create_token',
      {
        method: 'POST',
        headers: {
          'X-Api-Key': this.apiKey
        }
      }
    )
  }

  async listStreamingAvatars(): Promise<ListStreamingAvatarsResponse> {
    return this.requestV1<ListStreamingAvatarsResponse>(
      '/streaming/avatar.list',
      {
        method: 'GET'
      }
    )
  }
}
