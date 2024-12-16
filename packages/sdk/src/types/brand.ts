export interface BrandVoice {
  id: string
  name: string
  blacklist: string[]
  whitelist: string[]
  tones: string[]
  vocabulary: string[]
}

export interface ListBrandVoicesRequest extends Record<string, unknown> {
  limit?: number
  token?: string
  name_only?: boolean
}

export interface ListBrandVoicesResponse {
  list: BrandVoice[]
  total: number
  token: string | null
}
