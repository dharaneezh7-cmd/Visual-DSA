import { Router } from 'express';
import { body } from 'express-validator';
import { Practice } from '../models/Practice.mjs';
import { requireAuth } from '../middleware/auth.mjs';
import { validate } from '../middleware/validate.mjs';
import { TOPICS } from '../services/analytics.mjs';

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  validate([
    body('topic')
      .trim()
      .custom((value) => TOPICS.includes(value))
      .withMessage(`topic must be one of: ${TOPICS.join(', ')}`),
    body('questionId').trim().notEmpty().withMessage('questionId is required.'),
    body('answer').optional().isString(),
    body('correct').isBoolean().withMessage('correct must be boolean.'),
    body('attempts').optional().isInt({ min: 1 }).withMessage('attempts must be a positive integer.'),
  ]),
  async (req, res, next) => {
    try {
      const { topic, questionId, answer, correct, attempts } = req.body;

      const existing = await Practice.findOne({ userId: req.userId, topic, questionId });
      if (existing) {
        existing.answer = answer ?? existing.answer;
        existing.correct = correct;
        existing.attempts += attempts ?? 1;
        existing.timestamp = new Date();
        await existing.save();
        return res.json({ success: true, practice: existing });
      }

      const practice = await Practice.create({
        userId: req.userId,
        topic,
        questionId,
        answer: answer ?? '',
        correct,
        attempts: attempts ?? 1,
      });
      return res.status(201).json({ success: true, practice });
    } catch (err) {
      return next(err);
    }
  }
);

router.get('/', async (req, res, next) => {
  try {
    const practices = await Practice.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(200).lean();
    return res.json({ success: true, practices });
  } catch (err) {
    return next(err);
  }
});

export default router;