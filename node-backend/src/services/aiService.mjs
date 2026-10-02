import { config } from '../config.mjs';

/**
 * Check if the local Ollama daemon is reachable and whether the configured model is installed.
 */
export async function checkOllamaStatus() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${config.ollamaBaseUrl}/api/tags`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        available: false,
        error: `Ollama returned status ${response.status}`,
        models: [],
        configuredModel: config.ollamaModel,
        hasConfiguredModel: false,
      };
    }

    const data = await response.json();
    const models = (data.models || []).map((m) => m.name);
    const hasConfiguredModel = models.some(
      (m) => m === config.ollamaModel || m.startsWith(`${config.ollamaModel}:`) || config.ollamaModel.startsWith(m)
    );

    return {
      available: true,
      models,
      configuredModel: config.ollamaModel,
      hasConfiguredModel,
    };
  } catch (err) {
    return {
      available: false,
      error: err.name === 'AbortError' ? 'Connection timed out' : err.message,
      models: [],
      configuredModel: config.ollamaModel,
      hasConfiguredModel: false,
    };
  }
}

/**
 * Generate a response using local Ollama on RTX 4050.
 */
export async function askLemmyAI({ message, topic, history = [] }) {
  const systemPrompt = `You are Lemmy, the playful, energetic, buck-toothed blue cartoon Lemming mascot and tutor for the interactive platform "Visual DSA".
The learner is currently interacting with the topic: "${topic || 'General Data Structures and Algorithms'}".

Core Guidelines:
1. Tone: Friendly, humorous, encouraging, and clear. Speak like a smart, bouncy cartoon guide!
2. Intuition first: Use vivid real-world analogies (e.g. egg cartons for arrays, cafeteria trays for stacks, ticket lines for queues, rotating pizza carousels for circular queues, treasure hunts for linked lists).
3. Big-O: Always clearly state Time & Space Complexity (Big-O) whenever relevant.
4. Concurrency & Depth: Keep responses concise (2 to 4 punchy paragraphs) so they fit nicely in a chat window, unless the student explicitly asks for in-depth code or proofs.
5. Code: If code is requested, provide clean, idiomatic, and readable JavaScript/TypeScript or Python with concise comments.
6. Edge Cases: Mention common interview gotchas and edge cases!`;

  // Format history messages
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map((h) => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.text,
    })),
    { role: 'user', content: message },
  ];

  const controller = new AbortController();
  // 60-second timeout for first-token load
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.ollamaModel,
        messages: formattedMessages,
        stream: false,
        options: {
          temperature: 0.7,
          num_ctx: 4096,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return {
      success: true,
      answer: data.message?.content || "Yikes! My thoughts bounced away, ask me again!",
      source: 'ollama-rtx4050',
      model: config.ollamaModel,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: err.name === 'AbortError' ? 'Ollama inference timed out' : err.message,
      source: 'fallback',
    };
  }
}
