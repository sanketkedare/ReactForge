import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  uid: string;
  email: string;
  displayName: string;
  username?: string;
  photoURL: string;
  role: "user" | "pro" | "admin";
  isRegistrationComplete: boolean;
  experienceLevel?: "fresher" | "junior" | "mid" | "senior" | "architect";
  primaryFocus?: string;
  targetRole?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  completedTasks: string[];
  bookmarkedTasks: string[];
  streak: {
    current: number;
    longest: number;
    lastActiveDate: Date | null;
  };
  xp: number;
  lastLoginAt: Date;
  onboardingCompletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      default: "Frontend Engineer",
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    photoURL: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "pro", "admin"],
      default: "user",
    },
    isRegistrationComplete: {
      type: Boolean,
      default: false,
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior", "architect"],
      default: "junior",
    },
    primaryFocus: {
      type: String,
      default: "Machine Coding Interviews",
    },
    targetRole: {
      type: String,
      default: "Frontend Engineer",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    githubUrl: {
      type: String,
      default: "",
    },
    linkedinUrl: {
      type: String,
      default: "",
    },
    portfolioUrl: {
      type: String,
      default: "",
    },
    completedTasks: {
      type: [String],
      default: [],
    },
    bookmarkedTasks: {
      type: [String],
      default: [],
    },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: null },
    },
    xp: {
      type: Number,
      default: 0,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    onboardingCompletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
