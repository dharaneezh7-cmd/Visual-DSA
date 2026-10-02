import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.mjs';
import { createToken } from '../middleware/auth.mjs';
import { validate } from '../middleware/validate.mjs';
import {
  generateOtp,
  storeOtp,
  createAndStoreResetToken,
  clearOtpAndResetToken,
  validateStoredOtp,
  validateResetToken,
} from '../services/otpService.mjs';
import { callPython } from '../services/pythonClient.mjs';
import { config } from '../config.mjs';

const router = Router();

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

router.post(
  '/register',
  validate([
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required.')
      .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters.'),
    body('email')
      .trim()
      .toLowerCase()
      .isEmail().withMessage('Please provide a valid email address.'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match.'),
  ]),
  async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ success: false, message: 'Email already exists' });
      }

      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(409).json({ success: false, message: 'Username is already taken.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        tokenVersion: 1,
      });

      const token = createToken(user._id, user.tokenVersion);
      return res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: sanitizeUser(user._doc),
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  '/login',
  validate([
    body('email').trim().toLowerCase().isEmail().withMessage('Please provide a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      if (user.lockedUntil && user.lockedUntil > new Date()) {
        const remainingMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
        return res.status(401).json({
          success: false,
          message: `Account is temporarily locked. Please try again in ${remainingMinutes} minute(s).`,
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
          user.lockedUntil = new Date(Date.now() + LOCK_TIME_MS);
        }
        await user.save();
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      if (user.failedLoginAttempts > 0 || user.lockedUntil) {
        user.failedLoginAttempts = 0;
        user.lockedUntil = null;
        await user.save();
      }

      const token = createToken(user._id, user.tokenVersion || 1);
      return res.json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: sanitizeUser(user._doc),
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

router.post(
  '/forgot-password',
  validate([
    body('email').trim().toLowerCase().isEmail().withMessage('Please provide a valid email address.'),
  ]),
  async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.json({
          success: true,
          message: 'If an account exists for this email, an OTP has been sent.',
        });
      }

      const otp = generateOtp();
      await storeOtp(email, otp);

      let message = 'If an account exists for this email, an OTP has been sent.';
      try {
        const delivery = await callPython('/send-otp', { email, otp, purpose: 'password-reset' });
        if (delivery.delivered === false && config.nodeEnv !== 'production') {
          console.log('[auth dev] OTP for', email, 'is:', otp);
        }
      } catch {
        if (config.nodeEnv !== 'production') {
          console.warn('[auth dev] Python OTP service unreachable. OTP is:', otp);
        }
      }

      return res.json({ success: true, message });
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  '/verify-otp',
  validate([
    body('email').trim().toLowerCase().isEmail().withMessage('Please provide a valid email address.'),
    body('otp')
      .trim()
      .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.')
      .isNumeric().withMessage('OTP must be numeric.'),
  ]),
  async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      const result = await validateStoredOtp(email, otp);
      if (!result.valid) {
        return res.status(400).json({ success: false, message: result.reason });
      }

      const resetToken = await createAndStoreResetToken(email);
      return res.json({
        success: true,
        message: 'OTP verified successfully.',
        resetToken,
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  '/reset-password',
  validate([
    body('email').trim().toLowerCase().isEmail().withMessage('Please provide a valid email address.'),
    body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
    body('resetToken').optional().trim(),
  ]),
  async (req, res, next) => {
    try {
      const { email, newPassword, resetToken } = req.body;

      const validToken = await validateResetToken(email, resetToken);
      if (!validToken.valid) {
        return res.status(400).json({ success: false, message: validToken.reason });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updateOne(
        { email },
        {
          $set: { password: hashedPassword },
          $inc: { tokenVersion: 1 },
        }
      );

      await clearOtpAndResetToken(email);

      return res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
    } catch (err) {
      return next(err);
    }
  }
);

export default router;