export interface TalkingPhoto {
  id: string
  circle_image: string
  image_url: string
}

export interface ListTalkingPhotosResponse {
  list: TalkingPhoto[]
}

export interface UploadTalkingPhotoResponse {
  talking_photo_id: string
  talking_photo_url: string
}

// Since we're handling image uploads, let's define allowed content types
export type TalkingPhotoContentType = 'image/jpeg' | 'image/png'
