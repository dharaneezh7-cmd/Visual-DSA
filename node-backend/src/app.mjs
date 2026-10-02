import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { config } from './config.mjs';
import authRoutes from './routes/auth.mjs';
import userRoutes from './routes/user.mjs';
import progressRoutes from './routes/progress.mjs';
import activityRoutes from './routes/activity.mjs';
import practiceRoutes from './routes/practice.mjs';
import dashboardRoutes from './routes/dashboard.mjs';
import assistantRoutes from './routes/assistant.mjs';
import { notFound, errorHandler } from './middleware/errorHandler.mjs';

export function createApp() {
  const app = express();

  if (config.trustProxy) {
    app.set('trust proxy', 1);
  }

  app.disable('x-powered-by');

  app.use(helmet());
  app.use(mongoSanitize());

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || config.clientOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Origin not allowed by CORS policy.'));
      },
      credentials: false,
    })
  );

  app.use(express.json({ limit: '1mb' }));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
  });

  const otpLimiter = rateLimit({
    windowMs: 15 * 1 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many OTP requests or verification attempts. Please try again later.' },
  });

  app.use('/api/auth/register', authLimiter);
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/forgot-password', otpLimiter);
  app.use('/api/auth/verify-otp', otpLimiter);
  app.use('/api/auth/reset-password', otpLimiter);

  app.get('/api/health', (req, res) => {
    res.json({ success: true, service: 'visual-dsa-backend', status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/progress', progressRoutes);
  app.use('/api/activity', activityRoutes);
  app.use('/api/practice', practiceRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/assistant', assistantRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}