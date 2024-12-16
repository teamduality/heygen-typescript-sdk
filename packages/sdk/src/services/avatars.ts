import { BaseService } from './base.js'
import { BASE_URL } from '../config/endpoints.js'
import type {
  AvatarListData,
  AvatarGroupListData,
  AvatarGroupData,
  ListAvatarGroupsRequest
} from '../types/avatar.js'

export class AvatarsService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey, 'v2') // v2 endpoint
  }

  async list(): Promise<AvatarListData> {
    return this.request<AvatarListData>(`${BASE_URL}/v2/avatars`, 'GET')
  }

  async listGroups(
    params?: ListAvatarGroupsRequest
  ): Promise<AvatarGroupListData> {
    return this.request<AvatarGroupListData, ListAvatarGroupsRequest>(
      `${BASE_URL}/v2/avatar_group.list`,
      'GET',
      params
    )
  }
}
