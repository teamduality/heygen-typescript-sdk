// Quality options for streaming
export type StreamingQuality = 'high' | 'medium' | 'low'
export type VideoEncoding = 'H264' | 'VP8'
export type EmotionType =
  | 'Excited'
  | 'Serious'
  | 'Friendly'
  | 'Soothing'
  | 'Broadcaster'

// Voice settings interface
export interface VoiceSetting {
  voice_id?: string
  rate?: number
  emotion?: EmotionType
}

// New Session Request
export interface CreateStreamingSessionRequest {
  quality: StreamingQuality
  avatar_id?: string
  voice?: VoiceSetting
  video_encoding?: VideoEncoding
  knowledge_base?: string
  version?: 'v2'
  knowledge_base_id?: string
  disable_idle_timeout?: boolean
}

// Response interfaces
export interface ICEServer {
  urls: string[]
  username?: string
  credential?: string
  credentialType?: string
}

export interface SDP {
  sdp: string
  type: 'offer'
}

export interface CreateStreamingSessionResponse {
  ice_servers?: string[] // deprecated
  ice_servers2: ICEServer[]
  sdp: {
    sdp: string
    type: string // "offer"
  }
  session_id: string
}

export interface StartStreamingSessionRequest {
  session_id: string
  sdp: {
    type: string
    sdp: string
  }
}

export interface StartStreamingSessionResponse {
  status: string
}

export type SessionStatus = 'new' | 'connecting' | 'connected'

export interface StreamingSession {
  session_id: string
  status: SessionStatus
  created_at: number
}

export interface ListStreamingSessionsResponse {
  sessions: StreamingSession[]
}

export interface ICECandidate {
  candidate: string
  sdpMid: string
  sdpMLineIndex: number
  usernameFragment: string
}

export interface SubmitICERequest {
  session_id: string
  candidate: ICECandidate
}

export interface SubmitICEResponse {
  status: string
}

export type TaskMode = 'sync' | 'async'
export type TaskType = 'repeat' | 'chat'

export interface SendTaskRequest {
  session_id: string
  text: string
  task_mode?: TaskMode
  task_type?: TaskType
}

export interface SendTaskResponse {
  duration_ms: number
  task_id: string
}

export interface CloseSessionRequest {
  session_id: string
}

export interface CloseSessionResponse {
  status: string
}

export interface InterruptTaskRequest {
  session_id: string
}

// Since there's no specific response structure, we'll use void

export interface CreateSessionTokenResponse {
  token: string
}

export interface StreamingAvatarData {
  avatar_id: string
  created_at: number
  is_public: boolean
  status: 'ACTIVE' | 'INACTIVE'
}

export type ListStreamingAvatarsResponse = StreamingAvatarData[]
