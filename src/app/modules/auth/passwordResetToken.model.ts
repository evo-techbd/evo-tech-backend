import { Schema, model } from "mongoose";

interface TPasswordResetToken {
  email: string;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
}

const passwordResetTokenSchema = new Schema<TPasswordResetToken>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for automatic token cleanup after expiration
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetToken = model<TPasswordResetToken>(
  "PasswordResetToken",
  passwordResetTokenSchema
);