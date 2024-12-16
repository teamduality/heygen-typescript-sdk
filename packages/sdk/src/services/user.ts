import { BaseService } from './base.js'
import type {
  GetQuotaResponse,
  UserInfo,
  V1UserInfoResponse
} from '../types/user.js'

export class UserService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async getRemainingQuota(): Promise<GetQuotaResponse> {
    return this.requestV2<GetQuotaResponse>('/user/remaining_quota', 'GET')
  }

  async getCurrentUser(): Promise<UserInfo> {
    const response = await this.requestV1<V1UserInfoResponse>('/user/me', 'GET')
    return response.data
  }
}
