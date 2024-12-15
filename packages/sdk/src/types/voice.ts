export interface Voice {
  voice_id: string
  language: string
  gender: 'Female' | 'Male' | 'unknown'
  name: string
  preview_audio: string
  support_pause: boolean
  emotion_support: boolean
}

export interface ListVoicesResponse {
  voices: Voice[]
}
