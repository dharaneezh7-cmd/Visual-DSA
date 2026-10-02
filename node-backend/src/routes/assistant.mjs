import { Router } from 'express';
import { checkOllamaStatus, askLemmyAI } from '../services/aiService.mjs';

const router = Router();

/**
 * GET /api/assistant/status
 * Check if local AI is online and ready
 */
router.get('/status', async (req, res) => {
  try {
    const status = await checkOllamaStatus();
    res.json({ success: true, ...status });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/assistant/chat
 * Ask Lemmy a question powered by Ollama on RTX 4050
 */
router.post('/chat', async (req, res) => {
  const { message, topic, history } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'A non-empty question string is required.',
    });
  }

  try {
    const result = await askLemmyAI({
      message: message.trim(),
      topic: topic || 'General DSA',
      history: Array.isArray(history) ? history : [],
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      source: 'fallback',
    });
  }
});

export default router;
