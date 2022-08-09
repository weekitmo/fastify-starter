// https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format
export interface EventMessage {
  /**
   * Message payload
   */
  data: string | object

  /**
   * Message identifier, if set, client will send `Last-Event-ID: <id>` header on reconnect
   */
  id?: string

  /**
   * Message type
   */
  event?: string

  /**
   * Update client reconnect interval (how long will client wait before trying to reconnect).
   */
  retry?: number

  comment?: string
}
