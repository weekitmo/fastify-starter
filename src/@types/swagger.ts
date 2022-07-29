export interface SwaggerFastifySchema {
  schema: {
    body?: unknown
    querystring?: unknown
    params?: unknown
    headers?: unknown
    response?: unknown
    hide?: boolean
    deprecated?: boolean
    tags?: string[]
    description?: string
    summary?: string
    consumes?: string[]
    produces?: string[]
    externalDocs?: { [index: string]: any; description?: string; url: string }
    security?: Array<{ [securityLabel: string]: string[] }>
    operationId?: string
  }
}
