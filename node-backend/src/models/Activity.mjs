import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    activityType: {
      type: String,
      required: true,
      trim: true,
    },
    operation: {
      type: String,
      required: true,
      trim: true,
    },
    result: {
      type: String,
      default: '',
      trim: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

activitySchema.index({ userId: 1, timestamp: -1 });

export const Activity = mongoose.model('Activity', activitySchema);