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
