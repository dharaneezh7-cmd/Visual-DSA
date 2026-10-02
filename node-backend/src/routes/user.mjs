import { Router } from 'express';
import { User } from '../models/User.mjs';
import { requireAuth } from '../middleware/auth.mjs';

const router = Router();

router.get('/profile', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    return next(err);
  }
});

export default router;