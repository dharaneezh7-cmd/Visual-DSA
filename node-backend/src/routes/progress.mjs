import { Router } from 'express';
import { body } from 'express-validator';
import { Progress } from '../models/Progress.mjs';
import { requireAuth } from '../middleware/auth.mjs';
import { validate } from '../middleware/validate.mjs';
import { TOPICS } from '../services/analytics.mjs';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const progress = await Progress.find({ userId: req.userId }).sort({ updatedAt: -1 }).lean();
    return res.json({ success: true, progress });
  } catch (err) {
    return next(err);
  }
});

router.get('/:topic', async (req, res, next) => {
  try {
    const progress = await Progress.findOne({ userId: req.userId, topic: req.params.topic }).lean();
    if (!progress) {
      return res.status(404).json({ success: false, message: 'No progress found for this topic.' });
    }
    return res.json({ success: true, progress });
  } catch (err) {
    return next(err);
  }
});

router.post(
  '/',
  validate([
    body('topic')
      .trim()
      .custom((value) => TOPICS.includes(value))
      .withMessage(`topic must be one of: ${TOPICS.join(', ')}`),
    body('concept').trim().notEmpty().withMessage('concept is required.'),
    body('completed').optional().isBoolean().withMessage('completed must be boolean.'),
    body('completionPercentage')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('completionPercentage must be 0-100.'),
    body('timeSpent').optional().isFloat({ min: 0 }).withMessage('timeSpent must be a non-negative number.'),
    body('operationsPerformed')
      .optional()
      .isInt({ min: 0 })
      .withMessage('operationsPerformed must be a non-negative integer.'),
  ]),
  async (req, res, next) => {
    try {
      const { topic, concept } = req.body;

      const existing = await Progress.findOne({ userId: req.userId, topic, concept });
      const updates = {
        userId: req.userId,
        topic,
        concept,
        completed: req.body.completed ?? existing?.completed ?? false,
        completionPercentage: req.body.completionPercentage ?? existing?.completionPercentage ?? 0,
        timeSpent: (existing?.timeSpent ?? 0) + (req.body.timeSpent ?? 0),
        operationsPerformed: (existing?.operationsPerformed ?? 0) + (req.body.operationsPerformed ?? 0),
        lastAccessed: new Date(),
        updatedAt: new Date(),
      };

      const progress = await Progress.findOneAndUpdate(
        { userId: req.userId, topic, concept },
        { $set: updates },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean();

      return res.status(201).json({ success: true, progress });
    } catch (err) {
      return next(err);
    }
  }
);

export default router;