import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
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
    concept: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    operationsPerformed: {
      type: Number,
      default: 0,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

progressSchema.index({ userId: 1, topic: 1, concept: 1 }, { unique: true });

export const Progress = mongoose.model('Progress', progressSchema);