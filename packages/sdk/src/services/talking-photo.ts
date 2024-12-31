import { BaseService } from './base.js'
import type {
  ListTalkingPhotosResponse,
  UploadTalkingPhotoResponse,
  TalkingPhotoContentType
} from '../types/index.js'
import { V1_UPLOAD_BASE_URL } from '../config/endpoints.js'

export class TalkingPhotoService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async list(): Promise<ListTalkingPhotosResponse> {
    return this.requestV1<ListTalkingPhotosResponse>('/talking_photo.list', {
      method: 'GET'
    })
  }

  async upload(
    file: Buffer | Blob,
    contentType: TalkingPhotoContentType
  ): Promise<UploadTalkingPhotoResponse> {
    return this.requestV1<UploadTalkingPhotoResponse>('/talking_photo', {
      method: 'POST',
      file,
      contentType,
      baseUrl: V1_UPLOAD_BASE_URL
    })
  }

  async delete(photoId: string): Promise<void> {
    return this.requestV2<void>(`/talking_photo/${photoId}`, {
      method: 'DELETE'
    })
  }
}
