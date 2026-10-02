import { Router } from 'express';
import { body } from 'express-validator';
import { Activity } from '../models/Activity.mjs';
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
    body('activityType').trim().notEmpty().withMessage('activityType is required.'),
    body('operation').trim().notEmpty().withMessage('operation is required.'),
    body('result').optional().isString(),
    body('duration').optional().isFloat({ min: 0 }).withMessage('duration must be non-negative.'),
  ]),
  async (req, res, next) => {
    try {
      const activity = await Activity.create({
        userId: req.userId,
        topic: req.body.topic,
        activityType: req.body.activityType,
        operation: req.body.operation,
        result: req.body.result ?? '',
        duration: req.body.duration ?? 0,
      });
      return res.status(201).json({ success: true, activity });
    } catch (err) {
      return next(err);
    }
  }
);

router.get('/', async (req, res, next) => {
  try {
    const activities = await Activity.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(200).lean();
    return res.json({ success: true, activities });
  } catch (err) {
    return next(err);
  }
});

export default router;