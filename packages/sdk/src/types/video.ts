/**
 * Create Video Types
 */
export interface CreateVideoRequest {
  caption?: boolean
  test?: boolean
  title?: string
  callback_id?: string
  video_inputs: VideoInput[]
  dimensions: Dimension
  callback_url?: string
}

export interface VideoInput {
  character?: AvatarSettings | TalkingPhotoSettings
  voice: TextVoiceSettings | AudioVoiceSettings | SilenceVoiceSettings
  background?: ColorBackground | ImageBackground | VideoBackground
}

export interface Dimension {
  width: number
  height: number
}

export interface AvatarSettings {
  type: 'avatar'
  avatar_id: string
  scale: number
  avatar_style?: 'circle' | 'normal' | 'closeUp'
  offset?: Offset
  matting?: boolean
  circle_background_color?: string
}

export interface TalkingPhotoSettings {
  type: 'talking_photo'
  talking_photo_id: string
  scale: number
  talking_photo_style?: 'square' | 'circle'
  offset?: Offset
  talking_style?: 'stable' | 'expressive'
  expression?: 'default' | 'happy'
  super_resolution?: boolean
  matting?: boolean
  circle_background_color?: string
}

export interface Offset {
  x: number
  y: number
}

export interface TextVoiceSettings {
  type: 'text'
  voice_id: string
  input_text: string
  speed?: number
  pitch?: number
  emotion?: 'Excited' | 'Friendly' | 'Serious' | 'Soothing' | 'Broadcaster'
}

export interface AudioVoiceSettings {
  type: 'audio'
  audio_url?: string
  audio_asset_id?: string
}

export interface SilenceVoiceSettings {
  type: 'silence'
  duration: number
}

export interface ColorBackground {
  type: 'color'
  value: string
}

export interface ImageBackground {
  type: 'image'
  url?: string
  image_asset_id?: string
  fit?: 'cover' | 'crop' | 'contain' | 'none'
}

export interface VideoBackground {
  type: 'video'
  url?: string
  video_asset_id?: string
  play_style?: 'fit_to_scene' | 'freeze' | 'loop' | 'once'
  fit?: 'cover' | 'crop' | 'contain' | 'none'
}

export interface CreateVideoResponse {
  video_id: string
}

/** Get Video Types */
export interface VideoDetailsResponse {
  id: string // Unique identifier for the object
  error?: Record<string, any> // Optional: Error details if rendering failed
  status: 'processing' | 'completed' | 'failed' | 'pending' // Video rendering status
  video_url?: string // Video URL, valid for 7 days if status is "completed"
  video_url_caption?: string // Captioned video URL, valid for 7 days if applicable
  callback_id?: string // Custom callback ID
  duration: number // Length of the video
  thumbnail_url?: string // URL of the video thumbnail
  created_at: number // Creation time (Unix timestamp)
}

export type VideoType = 'GENERATED' | 'TRANSLATED'
export type VideoStatus = 'completed' | 'processing' | 'failed' | 'draft'

export interface VideoListItem {
  video_id: string
  status: VideoStatus
  created_at: number
  type: VideoType
}

export interface ListVideosRequest {
  limit?: number
  token?: string
}

export interface ListVideosResponse {
  code: number
  data: {
    token: string | null
    videos: VideoListItem[]
  }
  message: string | null
}

export interface ListSupportedLanguagesResponse {
  languages: string[]
}

export interface TranslateVideoRequest {
  video_url: string
  title?: string
  output_language: string
  translate_audio_only?: boolean
  speaker_num?: number
  callback_id?: string
  enable_dynamic_duration?: boolean
  brand_voice_id?: string
  callback_url?: string
}

export interface TranslateVideoResponse {
  video_translate_id: string
}

export type TranslationStatus = 'running' | 'success' | 'failed' | 'pending'

export interface TranslationStatusResponse {
  error: null
  data: {
    video_translate_id: string
    title: string
    status: TranslationStatus
    url: string | null
    message: string | null
  }
}
