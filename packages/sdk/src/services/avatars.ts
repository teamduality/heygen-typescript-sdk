import { BaseService } from './base.js'
import type { QueryParams } from './base.js'
import type {
  AvatarListData,
  AvatarGroupListData,
  ListAvatarGroupsRequest,
  AvatarGroupData
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

  async listInGroup(groupId: string): Promise<AvatarGroupData> {
    return this.requestV2<AvatarGroupData>(`/avatar_group/${groupId}/avatars`, {
      method: 'GET'
    })
  }
}
