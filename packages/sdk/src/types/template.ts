export interface Template {
  template_id: string
  name: string
  thumbnail_image_url: string
}

export interface ListTemplatesResponse {
  templates: Template[]
}

export interface TemplateVariableProperties {
  content?: string
  url?: string
  asset_id?: string
  fit?: string
  play_style?: string
  character_id?: string
  type?: string
  voice_id?: string
}

export interface TemplateVariable {
  name: string
  type: string
  properties: TemplateVariableProperties
}

export interface GetTemplateResponse {
  variables: Record<string, TemplateVariable>
}

export interface GenerateFromTemplateRequest {
  caption?: boolean
  callback_id?: string
  title?: string
}

export interface GenerateFromTemplateResponse {
  video_id: string
}
