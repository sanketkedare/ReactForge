import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFailedEmail extends Document {
  toEmail: string;
  displayName: string;
  template: string;
  errorMessage: string;
  errorStack?: string;
  payload: Record<string, any>;
  attempts: number;
  status: "failed" | "retrying" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const FailedEmailSchema = new Schema<IFailedEmail>(
  {
    toEmail: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      default: "Developer",
    },
    template: {
      type: String,
      default: "welcome_email",
      index: true,
    },
    errorMessage: {
      type: String,
      required: true,
    },
    errorStack: {
      type: String,
      default: "",
    },
    payload: {
      type: Schema.Types.Mixed,
      default: {},
    },
    attempts: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["failed", "retrying", "resolved"],
      default: "failed",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FailedEmail: Model<IFailedEmail> =
  mongoose.models.FailedEmail ||
  mongoose.model<IFailedEmail>("FailedEmail", FailedEmailSchema);
