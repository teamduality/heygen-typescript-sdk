import { EmotionType, HeygenSDK } from '@teamduality/heygen-sdk'

import { Room, RoomEvent, VideoPresets } from 'livekit-client'
import protobuf from 'protobufjs'
import { convertFloat32ToS16PCM, sleep } from './utils'
import jsonDescriptor from './pipecat.json'

export interface StreamingAvatarApiConfig {
  token: string
  basePath?: string
}

export enum AvatarQuality {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}
export enum VoiceEmotion {
  EXCITED = 'excited',
  SERIOUS = 'serious',
  FRIENDLY = 'friendly',
  SOOTHING = 'soothing',
  BROADCASTER = 'broadcaster'
}
export interface StartAvatarRequest {
  quality?: AvatarQuality
  avatarName: string
  voice?: {
    voiceId?: string
    rate?: number
    emotion?: VoiceEmotion
  }
  knowledgeId?: string
  language?: string
  knowledgeBase?: string
  disableIdleTimeout?: boolean
}

export interface StartAvatarResponse {
  session_id: string
  access_token: string
  url: string
  is_paid: boolean
  session_duration_limit: number
}

export enum TaskType {
  TALK = 'talk',
  REPEAT = 'repeat'
}
export enum TaskMode {
  SYNC = 'sync',
  ASYNC = 'async'
}
export interface SpeakRequest {
  text: string
  task_type?: TaskType // should use camelCase
  taskType?: TaskType
  taskMode?: TaskMode
}

export interface CommonRequest {
  [key: string]: any
}

// event types --------------------------------
export enum StreamingEvents {
  AVATAR_START_TALKING = 'avatar_start_talking',
  AVATAR_STOP_TALKING = 'avatar_stop_talking',
  AVATAR_TALKING_MESSAGE = 'avatar_talking_message',
  AVATAR_END_MESSAGE = 'avatar_end_message',
  USER_TALKING_MESSAGE = 'user_talking_message',
  USER_END_MESSAGE = 'user_end_message',
  USER_START = 'user_start',
  USER_STOP = 'user_stop',
  USER_SILENCE = 'user_silence',
  STREAM_READY = 'stream_ready',
  STREAM_DISCONNECTED = 'stream_disconnected'
}
export type EventHandler = (...args: any[]) => void
export interface EventData {
  [key: string]: unknown
  task_id: string
}

export interface StreamingStartTalkingEvent extends EventData {
  type: StreamingEvents.AVATAR_START_TALKING
}

export interface StreamingStopTalkingEvent extends EventData {
  type: StreamingEvents.AVATAR_STOP_TALKING
}

export interface StreamingTalkingMessageEvent extends EventData {
  type: StreamingEvents.AVATAR_TALKING_MESSAGE
  message: string
}

export interface StreamingTalkingEndEvent extends EventData {
  type: StreamingEvents.AVATAR_END_MESSAGE
}

export interface UserTalkingMessageEvent extends EventData {
  type: StreamingEvents.USER_TALKING_MESSAGE
  message: string
}

export interface UserTalkingEndEvent extends EventData {
  type: StreamingEvents.USER_END_MESSAGE
}

type StreamingEventTypes =
  | StreamingStartTalkingEvent
  | StreamingStopTalkingEvent
  | StreamingTalkingMessageEvent
  | StreamingTalkingEndEvent
  | UserTalkingMessageEvent
  | UserTalkingEndEvent

interface WebsocketBaseEvent {
  [key: string]: unknown
}
interface UserStartTalkingEvent extends WebsocketBaseEvent {
  event_type: StreamingEvents.USER_START
}
interface UserStopTalkingEvent extends WebsocketBaseEvent {
  event_type: StreamingEvents.USER_STOP
}
interface UserSilenceEvent extends WebsocketBaseEvent {
  event_type: StreamingEvents.USER_SILENCE
  silence_times: number
  count_down: number
}

type StreamingWebSocketEventTypes =
  | UserStartTalkingEvent
  | UserStopTalkingEvent
  | UserSilenceEvent

class APIError extends Error {
  public status: number
  public responseText: string

  constructor(message: string, status: number, responseText: string) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.responseText = responseText
  }
}
console.log('YARRRRR MATEY')

export class StreamingAvatar {
  public room: Room | null = null
  public mediaStream: MediaStream | null = null

  private readonly sdk: HeygenSDK

  private readonly token: string
  private readonly basePath: string
  private eventTarget = new EventTarget()
  private audioContext: AudioContext | null = null
  private webSocket: globalThis.WebSocket = null
  private scriptProcessor: ScriptProcessorNode | null = null
  private mediaStreamAudioSource: MediaStreamAudioSourceNode | null = null
  private mediaDevicesStream: MediaStream | null = null
  private audioRawFrame: protobuf.Type | undefined
  private sessionId: string | null = null
  private language: string | undefined

  constructor({
    token,
    basePath = 'https://api.heygen.com'
  }: StreamingAvatarApiConfig) {
    this.sdk = new HeygenSDK(token)
    console.log('sdk', this.sdk)
    this.token = token
    this.basePath = basePath
  }

  public async createStartAvatar(
    requestData: StartAvatarRequest
  ): Promise<any> {
    const sessionInfo = await this.newSession(requestData)
    this.sessionId = sessionInfo.session_id
    this.language = requestData.language

    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
      videoCaptureDefaults: {
        resolution: VideoPresets.h720.resolution
      }
    })

    this.room = room
    this.mediaStream = null

    room.on(RoomEvent.DataReceived, (roomMessage) => {
      let eventMsg: StreamingEventTypes | null = null
      try {
        const messageString = new TextDecoder().decode(
          roomMessage as ArrayBuffer
        )
        eventMsg = JSON.parse(messageString) as StreamingEventTypes
      } catch (e) {
        console.error(e)
      }
      if (!eventMsg) {
        return
      }
      this.emit(eventMsg.type, eventMsg)
    })

    const mediaStream = new MediaStream()
    room.on(RoomEvent.TrackSubscribed, (track) => {
      if (track.kind === 'video' || track.kind === 'audio') {
        mediaStream.addTrack(track.mediaStreamTrack)

        const hasVideoTrack = mediaStream.getVideoTracks().length > 0
        const hasAudioTrack = mediaStream.getAudioTracks().length > 0
        if (hasVideoTrack && hasAudioTrack && !this.mediaStream) {
          this.mediaStream = mediaStream
          this.emit(StreamingEvents.STREAM_READY, this.mediaStream)
        }
      }
    })
    room.on(RoomEvent.TrackUnsubscribed, (track) => {
      const mediaTrack = track.mediaStreamTrack
      if (mediaTrack) {
        mediaStream.removeTrack(mediaTrack)
      }
    })

    room.on(RoomEvent.Disconnected, (reason) => {
      this.emit(StreamingEvents.STREAM_DISCONNECTED, reason)
    })

    try {
      await room.prepareConnection(sessionInfo.url, sessionInfo.access_token)
    } catch (error) {}

    await this.startSession()

    await room.connect(sessionInfo.url, sessionInfo.access_token)

    return sessionInfo
  }

  public async startVoiceChat(
    requestData: { useSilencePrompt?: boolean } = {}
  ) {
    requestData.useSilencePrompt = requestData.useSilencePrompt || false
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return
    }

    try {
      await this.loadAudioRawFrame()
      await this.connectWebSocket({
        useSilencePrompt: requestData.useSilencePrompt
      })

      this.audioContext = new window.AudioContext({
        latencyHint: 'interactive',
        sampleRate: 16000
      })
      const devicesStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true
        }
      })
      this.mediaDevicesStream = devicesStream

      this.mediaStreamAudioSource =
        this.audioContext?.createMediaStreamSource(devicesStream)
      this.scriptProcessor = this.audioContext?.createScriptProcessor(512, 1, 1)

      this.mediaStreamAudioSource.connect(this.scriptProcessor)
      this.scriptProcessor.connect(this.audioContext?.destination)

      this.scriptProcessor.onaudioprocess = (event) => {
        if (!this.webSocket) {
          return
        }
        const audioData = event.inputBuffer.getChannelData(0)
        const pcmS16Array = convertFloat32ToS16PCM(audioData)
        const pcmByteArray = new Uint8Array(pcmS16Array.buffer)
        const frame = this.audioRawFrame?.create({
          audio: {
            audio: Array.from(pcmByteArray),
            sampleRate: 16000,
            numChannels: 1
          }
        })
        const encodedFrame = new Uint8Array(
          this.audioRawFrame?.encode(frame).finish()
        )
        this.webSocket?.send(encodedFrame)
      }

      // though room has been connected, but the stream may not be ready.
      await sleep(2000)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  public closeVoiceChat() {
    try {
      if (this.audioContext) {
        this.audioContext = null
      }
      if (this.scriptProcessor) {
        this.scriptProcessor.disconnect()
        this.scriptProcessor = null
      }
      if (this.mediaStreamAudioSource) {
        this.mediaStreamAudioSource.disconnect()
        this.mediaStreamAudioSource = null
      }
      if (this.mediaDevicesStream) {
        this.mediaDevicesStream?.getTracks()?.forEach((track) => track.stop())
        this.mediaDevicesStream = null
      }
      if (this.webSocket) {
        this.webSocket.close()
      }
    } catch (e) {}
  }

  public async newSession(
    requestData: StartAvatarRequest
  ): Promise<StartAvatarResponse> {
    return this.sdk.streaming.create({
      avatar_id: requestData.avatarName,
      quality: requestData.quality ?? 'medium',
      voice: {
        voice_id: requestData.voice?.voiceId,
        rate: requestData.voice?.rate,
        emotion: requestData.voice?.emotion as unknown as EmotionType
      },
      knowledge_base: requestData.knowledgeBase,
      knowledge_base_id: requestData.knowledgeId,
      disable_idle_timeout: requestData.disableIdleTimeout
    })
  }

  public async startSession(): Promise<any> {
    return await this.sdk.streaming.start({
      session_id: this.sessionId
    })
  }

  public async speak(requestData: SpeakRequest): Promise<any> {
    console.log('SPEAAAAAAK', requestData)
    requestData.taskType =
      requestData.taskType || requestData.task_type || TaskType.TALK
    requestData.taskMode = requestData.taskMode || TaskMode.ASYNC

    // try to use websocket first
    // only support talk task
    if (
      this.webSocket &&
      this.audioRawFrame &&
      requestData.task_type === TaskType.TALK &&
      requestData.taskMode !== TaskMode.SYNC
    ) {
      const frame = this.audioRawFrame?.create({
        text: {
          text: requestData.text
        }
      })
      const encodedFrame = new Uint8Array(
        this.audioRawFrame?.encode(frame).finish()
      )
      this.webSocket?.send(encodedFrame)
      return
    }
    // Fall back to API
    return this.sdk.streaming.sendTask({
      session_id: this.sessionId!,
      text: requestData.text,
      task_mode: requestData.taskMode,
      task_type: requestData.taskType === TaskType.TALK ? 'chat' : 'repeat'
    })
  }

  public async startListening(): Promise<any> {
    return this.sdk.streaming.start({
      session_id: this.sessionId
    })
  }

  public async stopListening(): Promise<any> {
    return this.sdk.streaming.closeSession({
      session_id: this.sessionId
    })
  }

  public async interrupt(): Promise<any> {
    return this.sdk.streaming.interruptTask({
      session_id: this.sessionId
    })
  }

  public async stopAvatar(): Promise<any> {
    // clear some resources
    this.closeVoiceChat()
    return this.sdk.streaming.closeSession({
      session_id: this.sessionId
    })
  }

  public on(eventType: string, listener: EventHandler): this {
    this.eventTarget.addEventListener(eventType, listener)
    return this
  }

  public off(eventType: string, listener: EventHandler): this {
    this.eventTarget.removeEventListener(eventType, listener)
    return this
  }

  private emit(eventType: string, detail?: any) {
    const event = new CustomEvent(eventType, { detail })
    this.eventTarget.dispatchEvent(event)
  }

  private async connectWebSocket(requestData: { useSilencePrompt: boolean }) {
    let websocketUrl = `wss://${new URL(this.basePath).hostname}/v1/ws/streaming.chat?session_id=${this.sessionId}&session_token=${this.token}&silence_response=${requestData.useSilencePrompt}`
    if (this.language) {
      websocketUrl += `&stt_language=${this.language}`
    }
    this.webSocket = new WebSocket(websocketUrl)
    this.webSocket.addEventListener('message', (event) => {
      let eventData: StreamingWebSocketEventTypes | null = null
      try {
        eventData = JSON.parse(event.data)
      } catch (e) {
        console.error(e)
        return
      }
      this.emit(eventData.event_type, eventData)
    })
    this.webSocket.addEventListener('close', (event) => {
      this.webSocket = null
    })
    return new Promise((resolve, reject) => {
      this.webSocket?.addEventListener('error', (event) => {
        this.webSocket = null
        reject(event)
      })
      this.webSocket?.addEventListener('open', () => {
        resolve(true)
      })
    })
  }
  private async loadAudioRawFrame() {
    if (!this.audioRawFrame) {
      const root = protobuf.Root.fromJSON(jsonDescriptor)
      this.audioRawFrame = root?.lookupType('pipecat.Frame')
    }
  }
}