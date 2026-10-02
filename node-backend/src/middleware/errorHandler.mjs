import { config } from '../config.mjs';

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error('[error]', err);

  const message =
    config.nodeEnv === 'production'
      ? status < 500
        ? err.message || 'Bad Request'
        : 'Internal server error'
      : err.message || 'Internal server error';

  res.status(status).json({ success: false, message });
}