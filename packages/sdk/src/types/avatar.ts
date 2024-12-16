export interface Avatar {
  avatar_id: string
  avatar_name: string
  gender: string
  preview_image_url: string
  preview_video_url: string
}

export interface TalkingPhoto {
  talking_photo_id: string
  talking_photo_name: string
  preview_image_url: string
}

export interface ListAvatarsResponse {
  avatars: Avatar[]
  talking_photos: TalkingPhoto[]
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

export interface ListAvatarGroupsRequest {
  include_public?: boolean
}

export interface ListAvatarGroupsResponse {
  error: null
  data: {
    total_count: number
    avatar_group_list: AvatarGroup[]
  }
}

export interface ListAvatarsInGroupResponse {
  error: null
  data: {
    avatar_list: Avatar[]
  }
}
