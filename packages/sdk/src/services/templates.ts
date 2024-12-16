import { BaseService } from './base.js'
import { BASE_URL } from '../config/endpoints.js'
import type {
  ListTemplatesResponse,
  GetTemplateResponse,
  GenerateFromTemplateRequest,
  GenerateFromTemplateResponse
} from '../types/template.js'

export class TemplatesService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey, 'v2')
  }

  async list(): Promise<ListTemplatesResponse> {
    return this.request<ListTemplatesResponse>(
      `${BASE_URL}/v2/templates`,
      'GET'
    )
  }

  async get(templateId: string): Promise<GetTemplateResponse> {
    return this.request<GetTemplateResponse>(
      `${BASE_URL}/v2/templates/${templateId}`,
      'GET'
    )
  }

  async generate(
    templateId: string,
    data?: GenerateFromTemplateRequest
  ): Promise<GenerateFromTemplateResponse> {
    return this.request<
      GenerateFromTemplateResponse,
      GenerateFromTemplateRequest
    >(`${BASE_URL}/v2/templates/${templateId}/generate`, 'POST', data)
  }
}
