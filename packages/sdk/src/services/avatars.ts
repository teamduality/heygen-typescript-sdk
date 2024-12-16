import { BaseService } from './base.js'
import type { QueryParams } from './base.js'
import type {
  AvatarListData,
  AvatarGroupListData,
  ListAvatarGroupsRequest
} from '../types/index.js'

export class AvatarsService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async list(): Promise<AvatarListData> {
    return this.requestV2<AvatarListData>('/avatars', {
      method: 'GET'
    })
  }

  async listGroups(
    params?: ListAvatarGroupsRequest
  ): Promise<AvatarGroupListData> {
    return this.requestV2<AvatarGroupListData>('/avatar_group.list', {
      method: 'GET',
      queryParams: params as QueryParams
    })
  }
}
