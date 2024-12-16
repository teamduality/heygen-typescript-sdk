import type { TalkingPhoto } from './talking-photo.js'

export interface Avatar {
  avatar_id: string
  avatar_name: string
  gender: string
  preview_image_url: string
  preview_video_url: string
}

export interface AvatarListData {
  avatars: Avatar[]
  talking_photos: TalkingPhoto[]
}

export interface AvatarGroupListData {
  total_count: number
  avatar_group_list: AvatarGroup[]
}

export interface AvatarGroupData {
  avatar_list: Avatar[]
}

export type GroupType = 'PUBLIC_PHOTO' | 'PRIVATE'
export type TrainStatus = 'empty' | null

export interface AvatarGroup {
  id: string
  name: string
  created_at: number
  num_looks: number
  preview_image_url: string | null
  group_type: GroupType
  train_status: TrainStatus
}

export interface ListAvatarGroupsRequest extends Record<string, unknown> {
  include_public?: boolean
}
