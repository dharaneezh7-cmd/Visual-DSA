import jwt from 'jsonwebtoken';
import { config } from '../config.mjs';
import { User } from '../models/User.mjs';

export function createToken(userId, tokenVersion = 1) {
  return jwt.sign({ userId, tokenVersion }, config.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: config.jwtExpiresIn,
  });
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
    if (!payload.userId || payload.tokenVersion === undefined) {
      return res.status(401).json({ success: false, message: 'Invalid session token. Please log in again.' });
    }

    const user = await User.findById(payload.userId).select('tokenVersion').lean();
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ success: false, message: 'Session expired or invalidated. Please log in again.' });
    }

    req.userId = payload.userId;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
  }
}