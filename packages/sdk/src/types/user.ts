export interface QuotaDetails {
  api: number
  seat: number
}

export interface GetQuotaResponse {
  remaining_quota: number
  details: QuotaDetails
}

export interface UserInfo {
  username: string
  email: string
  first_name: string
  last_name: string
}

// Internal types for API responses
export interface V1UserInfoResponse {
  code: number
  data: UserInfo
  msg: string | null
  message: string | null
}
