import mongoose, { InferSchemaType } from "mongoose"
const Schema = mongoose.Schema
import * as collect from "@/constants/document"
const col = collect.shortIdCollection()

const shortIdSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      required: [true, "required unique short code"]
    },
    originUrl: {
      type: String,
      required: [true, "required origin url"]
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    remark: String,
    active: {
      type: Boolean,
      default: true
    },
    lastUpdateTime: { type: Date, default: Date.now }
  },
  { collection: col.name }
)

export type ShortIdType = InferSchemaType<typeof shortIdSchema>
export interface ShortIdTypeWithId extends ShortIdType {
  _id: string
}

export const ShortIdModel = mongoose.model<ShortIdType>(col.schema, shortIdSchema)
