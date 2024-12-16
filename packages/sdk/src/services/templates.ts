import { BaseService } from './base.js'
import type {
  ListTemplatesResponse,
  GetTemplateResponse,
  GenerateFromTemplateRequest,
  GenerateFromTemplateResponse
} from '../types/template.js'

export class TemplatesService extends BaseService {
  constructor(apiKey: string) {
    super(apiKey)
  }

  async list(): Promise<ListTemplatesResponse> {
    return this.requestV2<ListTemplatesResponse>('/templates', 'GET')
  }

  async get(templateId: string): Promise<GetTemplateResponse> {
    return this.requestV2<GetTemplateResponse>(
      `/templates/${templateId}`,
      'GET'
    )
  }

  async generate(
    templateId: string,
    data?: GenerateFromTemplateRequest
  ): Promise<GenerateFromTemplateResponse> {
    return this.requestV2<
      GenerateFromTemplateResponse,
      GenerateFromTemplateRequest
    >(`/templates/${templateId}/generate`, 'POST', data)
  }
}
