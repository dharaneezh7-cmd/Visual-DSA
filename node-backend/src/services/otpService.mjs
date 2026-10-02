import crypto from 'node:crypto';
import { User } from '../models/User.mjs';

const OTP_TTL_MS = 10 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 10 * 60 * 1000;

export function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export function hashValue(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function timingSafeCompare(plainValue, storedHash) {
  if (!storedHash || !plainValue) return false;
  const a = Buffer.from(hashValue(plainValue), 'utf8');
  const b = Buffer.from(storedHash, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function storeOtp(email, otp) {
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  await User.updateOne(
    { email },
    {
      $set: {
        resetOtp: hashValue(otp),
        resetOtpExpires: expiresAt,
        resetOtpVerified: false,
        resetToken: null,
        resetTokenExpires: null,
      },
    }
  );
}

export async function createAndStoreResetToken(email) {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await User.updateOne(
    { email },
    {
      $set: {
        resetOtp: null,
        resetOtpExpires: null,
        resetOtpVerified: true,
        resetToken: hashValue(resetToken),
        resetTokenExpires: expiresAt,
      },
    }
  );
  return resetToken;
}

export async function clearOtpAndResetToken(email) {
  await User.updateOne(
    { email },
    {
      $set: {
        resetOtp: null,
        resetOtpExpires: null,
        resetOtpVerified: false,
        resetToken: null,
        resetTokenExpires: null,
      },
    }
  );
}

export async function validateStoredOtp(email, otp) {
  const user = await User.findOne({ email }).select('+resetOtp +resetOtpExpires').lean();
  if (!user) return { valid: false, reason: 'No account found with that email.' };
  if (!user.resetOtp || !user.resetOtpExpires) return { valid: false, reason: 'No active OTP request found.' };
  if (Date.now() > new Date(user.resetOtpExpires).getTime()) {
    return { valid: false, reason: 'OTP has expired. Please request a new one.' };
  }
  if (!timingSafeCompare(otp, user.resetOtp)) {
    return { valid: false, reason: 'Invalid OTP. Please check and try again.' };
  }
  return { valid: true };
}

export async function validateResetToken(email, resetToken) {
  if (!email || !resetToken) {
    return { valid: false, reason: 'Missing email or reset token.' };
  }
  const user = await User.findOne({ email }).select('+resetToken +resetTokenExpires').lean();
  if (!user || !user.resetToken || !user.resetTokenExpires) {
    return { valid: false, reason: 'Reset authorization invalid or expired. Please verify your OTP again.' };
  }
  if (Date.now() > new Date(user.resetTokenExpires).getTime()) {
    return { valid: false, reason: 'Reset token has expired. Please verify your OTP again.' };
  }
  if (!timingSafeCompare(resetToken, user.resetToken)) {
    return { valid: false, reason: 'Invalid reset token. Please verify your OTP again.' };
  }
  return { valid: true };
}