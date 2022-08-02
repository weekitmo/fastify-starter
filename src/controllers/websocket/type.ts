import * as WebSocket from "ws"

export interface DefUidSocket extends WebSocket {
  uid: string
}

export enum SocketDataEnum {
  // 消息记录
  message = "message",
  // 协作(不保存历史)
  cooperate = "cooperate",
  // 错误
  error = "error",
  // 仅通信
  notify = "notify",
  // 心跳
  pingpong = "pingpong"
}

export interface MessageEvent {
  type: keyof typeof SocketDataEnum
  data: any
  // Date to string
  date: string
}
