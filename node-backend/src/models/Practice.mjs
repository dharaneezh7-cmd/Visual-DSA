import mongoose from 'mongoose';

const practiceSchema = new mongoose.Schema(
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
    questionId: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      default: '',
      trim: true,
    },
    correct: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 1,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

practiceSchema.index({ userId: 1, topic: 1, questionId: 1 }, { unique: true });

export const Practice = mongoose.model('Practice', practiceSchema);