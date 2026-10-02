import { Router } from 'express';
import { requireAuth } from '../middleware/auth.mjs';
import { Progress } from '../models/Progress.mjs';
import { Practice } from '../models/Practice.mjs';
import { buildDashboard } from '../services/analytics.mjs';
import { callPython } from '../services/pythonClient.mjs';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    let dashboard;
    try {
      const [progress, practices] = await Promise.all([
        Progress.find({ userId: req.userId }).lean(),
        Practice.find({ userId: req.userId }).lean(),
      ]);
      const py = await callPython('/analyze-progress', { progress, practices });
      if (py.success && py.analysis) {
        dashboard = py.analysis;
      }
    } catch {
      dashboard = null;
    }
    if (!dashboard) {
      dashboard = await buildDashboard(req.userId);
    }
    return res.json({ success: true, dashboard });
  } catch (err) {
    return next(err);
  }
});

export default router;