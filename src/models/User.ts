// models/User.ts
import mongoose, { Document, Schema } from "mongoose";

// Interface for Telegram User data (from WebApp.initDataUnsafe.user)
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_bot?: boolean;
  photo_url?: string;
  // Add any other relevant fields from initDataUnsafe.user
}

// Interface for your User Document
export interface IUser extends Document {
  telegramId: number; // Unique Telegram User ID
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  photoUrl?: string;
  isAdmin: boolean; // Flag for admin access
  isBanned: boolean; // Flag to ban/unban users
  telegramData: TelegramUser; // Store full Telegram user data
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    telegramId: {
      type: Number,
      required: true,
      unique: true, // Telegram IDs are unique
      index: true, // Index for faster lookups
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
      sparse: true, // Allows null/undefined values without creating duplicate unique index entries
    },
    languageCode: {
      type: String,
    },
    photoUrl: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false, // Default to non-admin
    },
    isBanned: {
      type: Boolean,
      default: false, // Default to not banned
    },
    telegramData: {
      type: Object, // Store the raw Telegram user object
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Avoids recompiling the model if it's already defined
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
