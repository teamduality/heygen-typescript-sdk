import { BaseService } from './base.js'
import type {
  GeneratePhotoRequest,
  GeneratePhotoResponse,
  CreatePhotoGroupRequest,
  CreatePhotoGroupResponse,
  TrainingJobStatus,
  AddLooksRequest,
  AddLooksResponse,
  AddMotionRequest,
  AddMotionResponse,
  AddSoundEffectRequest,
  AddSoundEffectResponse,
  UpscaleAvatarRequest,
  UpscaleAvatarResponse,
  TrainPhotoGroupRequest,
  GenerateLooksRequest,
  GenerateLooksResponse,
  GenerationStatusResponse,
  PhotoAvatar,
  AvatarGroupData
} from '../types/index.js'

export class PhotoAvatarService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async generatePhoto(
    data: GeneratePhotoRequest
  ): Promise<GeneratePhotoResponse> {
    return this.requestV2<GeneratePhotoResponse, GeneratePhotoRequest>(
      '/photo_avatar/photo/generate',
      {
        method: 'POST',
        body: data
      }
    )
  }

  async createGroup(
    data: CreatePhotoGroupRequest
  ): Promise<CreatePhotoGroupResponse> {
    return this.requestV2<CreatePhotoGroupResponse, CreatePhotoGroupRequest>(
      '/photo_avatar/avatar_group/create',
      {
        method: 'POST',
        body: data
      }
    )
  }

  async getTrainingStatus(groupId: string): Promise<TrainingJobStatus> {
    return this.requestV2<TrainingJobStatus>(
      `/photo_avatar/train/status/${groupId}`,
      {
        method: 'GET'
      }
    )
  }

  async addLooks(data: AddLooksRequest): Promise<AddLooksResponse> {
    return this.requestV2<AddLooksResponse, AddLooksRequest>(
      '/photo_avatar/avatar_group/add',
      {
        method: 'POST',
        body: data
      }
    )
  }

  async addMotion(data: AddMotionRequest): Promise<AddMotionResponse> {
    return this.requestV2<AddMotionResponse, AddMotionRequest>(
      '/photo_avatar/add_motion',
      {
        method: 'POST',
        body: data
      }
    )
  }

  async addSoundEffect(
    data: AddSoundEffectRequest
  ): Promise<AddSoundEffectResponse> {
    return this.requestV2<AddSoundEffectResponse, AddSoundEffectRequest>(
      '/photo_avatar/add_sound_effect',
      {
        method: 'POST',
        body: data
      }
    )
  }

  async upscale(data: UpscaleAvatarRequest): Promise<UpscaleAvatarResponse> {
    return this.requestV2<UpscaleAvatarResponse, UpscaleAvatarRequest>(
      '/photo_avatar/upscale',
      {
        method: 'POST',
        body: data
      }
    )
  }

  async trainGroup(data: TrainPhotoGroupRequest): Promise<void> {
    return this.requestV2<void, TrainPhotoGroupRequest>('/photo_avatar/train', {
      method: 'POST',
      body: data
    })
  }

  async generateLooks(
    data: GenerateLooksRequest
  ): Promise<GenerateLooksResponse> {
    return this.requestV2<GenerateLooksResponse, GenerateLooksRequest>(
      '/photo_avatar/look/generate',
      {
        method: 'POST',
        body: data
      }
    )
  }

  async checkGenerationStatus(
    generationId: string
  ): Promise<GenerationStatusResponse> {
    return this.requestV2<GenerationStatusResponse>(
      `/photo_avatar/generation/${generationId}`,
      {
        method: 'GET'
      }
    )
  }

  async getDetails(id: string): Promise<PhotoAvatar> {
    return this.requestV2<PhotoAvatar>(`/photo_avatar/${id}`, {
      method: 'GET'
    })
  }

  async listInGroup(groupId: string): Promise<AvatarGroupData> {
    return this.requestV2<AvatarGroupData>(`/avatar_group/${groupId}/avatars`, {
      method: 'GET'
    })
  }
}
