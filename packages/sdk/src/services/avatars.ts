import { BASE_URL } from '../config/endpoints.js'
import { httpClient } from '../utils/httpClient.js'

import type {
  ListAvatarsResponse,
  ListAvatarGroupsRequest,
  ListAvatarGroupsResponse,
  ListAvatarsInGroupResponse
} from '../types/avatar.js'

export async function listAvatars(
  apiKey: string
): Promise<ListAvatarsResponse> {
  return httpClient(`${BASE_URL}/v2/avatars`, 'GET', { apiKey })
}

export async function listAvatarGroups(
  apiKey: string,
  params?: ListAvatarGroupsRequest
): Promise<ListAvatarGroupsResponse> {
  return httpClient(`${BASE_URL}/v2/avatar_group.list`, 'GET', {
    apiKey,
    ...params
  })
}

export async function listAvatarsInGroup(
  apiKey: string,
  groupId: string
): Promise<ListAvatarsInGroupResponse> {
  return httpClient(`${BASE_URL}/v2/avatar_group/${groupId}/avatars`, 'GET', {
    apiKey
  })
}
