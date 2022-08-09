import * as WebSocket from "ws"

export interface DefUidSocket extends WebSocket {
  uid: string
}

export enum SocketMsgType {
  // msg will save to redis
  message = "message",
  // realtime broadcast to all clients
  cooperate = "cooperate",
  // error type
  error = "error",
  // only send to identify client
  notify = "notify"
}

export enum MsgType {
  text = "text",
  online = "online",
  identify = "identify"
}

export interface MessageEvent {
  type: keyof typeof SocketMsgType
  data: any
  // Date to string
  date: string
}
