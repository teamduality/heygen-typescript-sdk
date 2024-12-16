import { BaseService } from './base.js'
import type {
  AvatarListData,
  AvatarGroupListData,
  AvatarGroupData,
  ListAvatarGroupsRequest
} from '../types/avatar.js'

export class AvatarsService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async list(): Promise<AvatarListData> {
    return this.requestV2<AvatarListData>('/avatars', 'GET')
  }

  async listGroups(
    params?: ListAvatarGroupsRequest
  ): Promise<AvatarGroupListData> {
    return this.requestV2<AvatarGroupListData, ListAvatarGroupsRequest>(
      '/avatar_group.list',
      'GET',
      params
    )
  }
}
