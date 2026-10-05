import 'dotenv/config';

const asInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret === 'change-this-in-production' || jwtSecret.length < 16) {
  throw new Error(
    '[FATAL CONFIG ERROR] Insecure or missing JWT_SECRET environment variable. ' +
      'Please set JWT_SECRET to a strong random string (minimum 16 characters).'
  );
}

export const config = {
  port: asInt(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Visual_DSA',
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  pythonServiceUrl: process.env.PYTHON_SERVICE_URL || 'http://localhost:8000',
  internalApiKey: process.env.INTERNAL_API_KEY || 'default-internal-key-change-me',
  trustProxy: process.env.TRUST_PROXY === 'true',
  clientOrigins: (process.env.CLIENT_URL || 'https://visual-dsa-five.vercel.app/')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2:3b',
};

export const isProduction = config.nodeEnv === 'production';