import { BASE_URL } from '../config/endpoints.js'
import { httpClient } from '../utils/httpClient.js'
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

export async function createStreamingSession(
  apiKey: string,
  data: CreateStreamingSessionRequest
): Promise<CreateStreamingSessionResponse> {
  return httpClient(`${BASE_URL}/streaming/sessions`, 'POST', {
    apiKey,
    ...data
  })
}

export async function startStreamingSession(
  apiKey: string,
  data: StartStreamingSessionRequest
): Promise<StartStreamingSessionResponse> {
  return httpClient(`${BASE_URL}/streaming/start`, 'POST', {
    apiKey,
    ...data
  })
}

export async function listStreamingSessions(
  apiKey: string
): Promise<ListStreamingSessionsResponse> {
  return httpClient(`${BASE_URL}/streaming/list`, 'GET', { apiKey })
}

export async function submitICE(
  apiKey: string,
  data: SubmitICERequest
): Promise<SubmitICEResponse> {
  return httpClient(`${BASE_URL}/streaming/ice`, 'POST', {
    apiKey,
    ...data
  })
}

export async function sendTask(
  apiKey: string,
  data: SendTaskRequest
): Promise<SendTaskResponse> {
  return httpClient(`${BASE_URL}/streaming/task`, 'POST', {
    apiKey,
    ...data
  })
}

export async function closeSession(
  apiKey: string,
  data: CloseSessionRequest
): Promise<CloseSessionResponse> {
  return httpClient(`${BASE_URL}/streaming/stop`, 'POST', {
    apiKey,
    ...data
  })
}

export async function interruptTask(
  apiKey: string,
  data: InterruptTaskRequest
): Promise<void> {
  return httpClient(`${BASE_URL}/streaming/interrupt`, 'POST', {
    apiKey,
    ...data
  })
}

export async function createSessionToken(
  apiKey: string
): Promise<CreateSessionTokenResponse> {
  return httpClient(`${BASE_URL}/streaming/create_token`, 'POST', { apiKey })
}

export async function listStreamingAvatars(
  apiKey: string
): Promise<ListStreamingAvatarsResponse> {
  return httpClient(`${BASE_URL}/streaming/avatar.list`, 'GET', { apiKey })
}
