export type AvatarAge =
  | 'Young Adult'
  | 'Early Middle Age'
  | 'Late Middle Age'
  | 'Senior'
  | 'Unspecified'

export type AvatarGender = 'Woman' | 'Man' | 'Unspecified'

export type AvatarEthnicity =
  | ''
  | 'White'
  | 'Black'
  | 'Asian American'
  | 'East Asian'
  | 'South East Asian'
  | 'South Asian'
  | 'Middle Eastern'
  | 'Pacific'
  | 'Hispanic'
  | 'Unspecified'

export type PhotoOrientation = 'square' | 'horizontal' | 'vertical'
export type PhotoPose = 'half_body' | 'close_up' | 'full_body'
export type PhotoStyle =
  | ''
  | 'Realistic'
  | 'Pixar'
  | 'Cinematic'
  | 'Vintage'
  | 'Noir'
  | 'Cyberpunk'
  | 'Unspecified'

export interface GeneratePhotoRequest {
  name: string
  age: AvatarAge
  gender: AvatarGender
  ethnicity: AvatarEthnicity
  orientation: PhotoOrientation
  pose: PhotoPose
  style: PhotoStyle
  appearance: string // max 1000 chars
}

export interface GeneratePhotoResponse {
  generation_id: string
}

export interface CreatePhotoGroupRequest extends Record<string, unknown> {
  name: string
  image_key: string
  generation_id?: string
}

export interface UpscaleAvailability {
  available: boolean
  reason?: string
}

export interface PhotoAvatarGroup {
  id: string
  group_id: string
  name: string
  image_url: string
  created_at: number
  status: 'pending' | string // Add other statuses as we discover them
  is_motion: boolean
  motion_preview_url: string | null
  business_type: string
  upscale_availability: UpscaleAvailability
  upscaled: boolean
  background_sound_effect: string | null
}

export interface CreatePhotoGroupResponse {
  id: string
  group_id: string
  name: string
  image_url: string
  created_at: number
  status: string
  is_motion: boolean
  motion_preview_url: string | null
  business_type: string
  upscale_availability: UpscaleAvailability
  upscaled: boolean
  background_sound_effect: string | null
}

export type TrainingStatus = 'pending' | 'ready' | 'training' | string

export interface TrainingJobStatus {
  status: TrainingStatus
  error_msg: string | null
  created_at: number
  updated_at: number | null
}

export interface AddLooksRequest extends Record<string, unknown> {
  group_id: string
  image_keys: string[] // max 4 at a time
  name: string
  generation_id?: string // required for generated images, optional for uploads
}

export interface PhotoAvatarLook {
  id: string
  image_url: string
  created_at: number
  name: string
  status: string
  group_id: string
  is_motion: boolean
  motion_preview_url: string | null
  business_type: string
  upscale_availability: UpscaleAvailability
  upscaled: boolean
  background_sound_effect: string | null
}

export interface AddLooksResponse {
  photo_avatar_list: PhotoAvatarLook[]
}

export interface AddMotionRequest extends Record<string, unknown> {
  id: string
}

export interface AddMotionResponse {
  id: string
}

export interface AddSoundEffectRequest extends Record<string, unknown> {
  id: string
}

export interface AddSoundEffectResponse {
  sound_effect_id: string
}

export interface UpscaleAvatarRequest extends Record<string, unknown> {
  id: string
}

export interface UpscaleAvatarResponse {
  id: string
}

export interface TrainPhotoGroupRequest extends Record<string, unknown> {
  group_id: string
}

// Since the response data is null, we'll just use void for the response type

export interface GenerateLooksRequest extends Record<string, unknown> {
  group_id: string
  prompt: string
  orientation: PhotoOrientation
  pose: PhotoPose
  style: PhotoStyle
}

export interface GenerateLooksResponse {
  generation_id: string
}

export type GenerationStatus = 'success' | 'pending' | 'failed' | string

export interface GenerationStatusResponse {
  id: string
  status: GenerationStatus
  msg: string | null
  image_url_list: string[]
  image_key_list: string[]
}
export interface AvatarGroupData {
  avatar_list: PhotoAvatarGroup[]
}
