import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGuestUsage extends Document {
  ip: string;
  count: number;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GuestUsageSchema = new Schema<IGuestUsage>(
  {
    ip: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const GuestUsage: Model<IGuestUsage> =
  mongoose.models.GuestUsage ||
  mongoose.model<IGuestUsage>("GuestUsage", GuestUsageSchema);
