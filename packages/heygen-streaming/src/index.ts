import {
  HeygenSDK,
  StreamingQuality,
  EmotionType,
  TaskMode,
  TaskType,
  SDP
} from '@teamduality/heygen-sdk'
import { Room, RoomEvent, VideoPresets } from 'livekit-client'
import protobuf, { Message } from 'protobufjs'
import { convertFloat32ToS16PCM, sleep } from './utils'
import jsonDescriptor from './pipecat.json'

export interface StartAvatarRequest {
  quality?: StreamingQuality
  avatarId: string
  voice?: {
    voiceId?: string
    rate?: number
    emotion?: EmotionType
  }
  knowledgeId?: string
  language?: string
  knowledgeBase?: string
  disableIdleTimeout?: boolean
}

export interface SpeakRequest {
  sessionId: string
  text: string
  taskType?: TaskType
  taskMode?: TaskMode
}

// Event types
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

export class HeygenStreamingAvatar {
  public room: Room | null = null
  public mediaStream: MediaStream | null = null

  private readonly token: string
  private readonly sdk: HeygenSDK
  private eventTarget = new EventTarget()
  private audioContext: AudioContext | null = null
  private webSocket: WebSocket | null = null
  private scriptProcessor: ScriptProcessorNode | null = null
  private mediaStreamAudioSource: MediaStreamAudioSourceNode | null = null
  private mediaDevicesStream: MediaStream | null = null
  private audioRawFrame: protobuf.Type | undefined
  private sessionId: string | null = null
  private language: string | undefined
  private sdp: SDP | null = null
  constructor(apiKey: string) {
    this.sdk = new HeygenSDK(apiKey)
    this.token = apiKey
  }

  public async createStartAvatar(requestData: StartAvatarRequest) {
    // Create session using SDK
    const sessionInfo = await this.sdk.streaming.create({
      avatar_id: requestData.avatarId,
      quality: requestData.quality ?? 'medium',
      voice: {
        voice_id: requestData.voice?.voiceId,
        rate: requestData.voice?.rate,
        emotion: requestData.voice?.emotion
      },
      knowledge_base: requestData.knowledgeBase,
      knowledge_base_id: requestData.knowledgeId,
      disable_idle_timeout: requestData.disableIdleTimeout
    })

    this.sessionId = sessionInfo.session_id
    this.sdp = sessionInfo.sdp
    this.language = requestData.language

    // Setup LiveKit room
    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
      videoCaptureDefaults: {
        resolution: VideoPresets.h720.resolution
      }
    })

    this.room = room
    this.mediaStream = null

    // Handle room events
    this.setupRoomEvents(room)

    try {
      await room.prepareConnection(sessionInfo.sdp.sdp, sessionInfo.session_id)
    } catch (error) {
      console.error('Failed to prepare connection:', error)
    }

    // Start session using SDK
    await this.sdk.streaming.start({
      session_id: sessionInfo.session_id,
      sdp: sessionInfo.sdp
    })

    await room.connect(sessionInfo.sdp.sdp, sessionInfo.session_id)

    return sessionInfo
  }

  private setupRoomEvents(room: Room) {
    // Handle data messages
    room.on(RoomEvent.DataReceived, (roomMessage) => {
      let eventMsg = null
      try {
        const messageString = new TextDecoder().decode(
          roomMessage as ArrayBuffer
        )
        eventMsg = JSON.parse(messageString)
      } catch (e) {
        console.error(e)
      }
      if (!eventMsg) return
      this.emit((eventMsg as { type: string }).type, eventMsg)
    })

    // Handle media tracks
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
        this.audioContext.createMediaStreamSource(devicesStream)
      this.scriptProcessor = this.audioContext.createScriptProcessor(512, 1, 1)

      this.mediaStreamAudioSource.connect(this.scriptProcessor)
      this.scriptProcessor.connect(this.audioContext.destination)

      this.scriptProcessor.onaudioprocess = (event) => {
        if (!this.webSocket) return
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
        if (frame) {
          const message = this.audioRawFrame?.encode(frame as Message<{}>)
          if (message) {
            const encodedFrame = new Uint8Array(message.finish())
            this.webSocket?.send(encodedFrame)
          }
        }
      }

      // Wait for stream to be ready
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
    } catch (e) {
      console.error('Error closing voice chat:', e)
    }
  }

  public async speak(requestData: SpeakRequest) {
    requestData.taskType = requestData.taskType || 'chat'
    requestData.taskMode = requestData.taskMode || 'async'

    // Try WebSocket first for non-sync talk tasks
    if (
      this.webSocket &&
      this.audioRawFrame &&
      requestData.taskType === 'chat' &&
      requestData.taskMode !== 'sync'
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
      task_type: requestData.taskType
    })
  }

  public async startListening() {
    if (!this.sessionId) throw new Error('Session not started')
    return this.sdk.streaming.start({
      session_id: this.sessionId,
      sdp: this.sdp!
    })
  }

  public async stopListening() {
    if (!this.sessionId) throw new Error('Session not started')
    return this.sdk.streaming.closeSession({
      session_id: this.sessionId
    })
  }

  public async interrupt() {
    if (!this.sessionId) throw new Error('Session not started')
    return this.sdk.streaming.interruptTask({
      session_id: this.sessionId
    })
  }

  public async stopAvatar() {
    this.closeVoiceChat()
    if (!this.sessionId) return

    try {
      await this.sdk.streaming.interruptTask({
        session_id: this.sessionId
      })
      await this.room?.disconnect()
    } catch (e) {
      console.error('Error stopping avatar:', e)
    }
  }

  public on(eventType: string, listener: EventListener): this {
    this.eventTarget.addEventListener(eventType, listener as EventListener)
    return this
  }

  public off(eventType: string, listener: EventListener): this {
    this.eventTarget.removeEventListener(eventType, listener as EventListener)
    return this
  }

  private emit(eventType: string, detail?: any) {
    const event = new CustomEvent(eventType, { detail })
    this.eventTarget.dispatchEvent(event)
  }

  private async connectWebSocket(requestData: { useSilencePrompt: boolean }) {
    if (!this.sessionId) throw new Error('Session not started')

    const url = new URL(this.sdk.basePath)
    let websocketUrl = `wss://${url.hostname}/v1/ws/streaming.chat?session_id=${
      this.sessionId
    }&session_token=${this.token}&silence_response=${
      requestData.useSilencePrompt
    }`

    if (this.language) {
      websocketUrl += `&stt_language=${this.language}`
    }

    this.webSocket = new WebSocket(websocketUrl)

    this.webSocket.addEventListener('message', (event) => {
      let eventData = null
      try {
        eventData = JSON.parse(event.data)
      } catch (e) {
        console.error(e)
        return
      }
      if (eventData) {
        this.emit((eventData as { event_type: string }).event_type, eventData)
      }
    })

    this.webSocket.addEventListener('close', () => {
      this.webSocket = null
    })

    return new Promise((resolve, reject) => {
      if (!this.webSocket) return reject(new Error('WebSocket not initialized'))

      this.webSocket.addEventListener('error', (event) => {
        this.webSocket = null
        reject(event)
      })

      this.webSocket.addEventListener('open', () => {
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

export default HeygenStreamingAvatar
