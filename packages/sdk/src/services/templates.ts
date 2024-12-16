import { BASE_URL } from '../config/endpoints.js'
import { httpClient } from '../utils/httpClient.js'
import type {
  ListTemplatesResponse,
  GetTemplateResponse,
  GenerateFromTemplateRequest,
  GenerateFromTemplateResponse
} from '../types/template.js'

export async function listTemplates(
  apiKey: string
): Promise<ListTemplatesResponse> {
  return httpClient(`${BASE_URL}/v2/templates`, 'GET', { apiKey })
}

export async function getTemplate(
  apiKey: string,
  templateId: string
): Promise<GetTemplateResponse> {
  return httpClient(`${BASE_URL}/v2/template/${templateId}`, 'GET', { apiKey })
}

export async function generateFromTemplate(
  apiKey: string,
  templateId: string,
  data?: GenerateFromTemplateRequest
): Promise<GenerateFromTemplateResponse> {
  return httpClient(`${BASE_URL}/v2/template/${templateId}/generate`, 'POST', {
    apiKey,
    ...data
  })
}
