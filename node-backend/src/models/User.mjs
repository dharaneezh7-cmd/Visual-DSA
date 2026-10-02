import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    tokenVersion: {
      type: Number,
      default: 1,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
    resetOtp: {
      type: String,
      select: false,
      default: null,
    },
    resetOtpExpires: {
      type: Date,
      select: false,
      default: null,
    },
    resetOtpVerified: {
      type: Boolean,
      select: false,
      default: false,
    },
    resetToken: {
      type: String,
      select: false,
      default: null,
    },
    resetTokenExpires: {
      type: Date,
      select: false,
      default: null,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);