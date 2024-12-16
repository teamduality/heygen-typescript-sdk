export type AssetFileType = 'image' | 'video' | 'audio'
export type AssetContentType =
  | 'image/jpeg'
  | 'image/png'
  | 'video/mp4'
  | 'video/webm'
  | 'audio/mpeg'

export interface AssetResponse {
  id: string
  name: string
  file_type: AssetFileType
  folder_id: string
  meta: unknown | null
  image_key?: string
  created_ts: number
  url: string
}
