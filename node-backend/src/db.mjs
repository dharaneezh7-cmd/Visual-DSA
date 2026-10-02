import mongoose from 'mongoose';
import { config } from './config.mjs';

export async function connectDatabase() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongoUri);
  console.log(`[db] Connected to MongoDB at ${config.mongoUri}`);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  console.log('[db] Disconnected from MongoDB');
}