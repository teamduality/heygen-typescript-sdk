import { TalkingPhotoService } from './talking-photo.js'

export class AIAPI {
  public talkingPhoto: TalkingPhotoService

  constructor(protected readonly apiKey: string) {
    this.talkingPhoto = new TalkingPhotoService(apiKey)
  }
}
