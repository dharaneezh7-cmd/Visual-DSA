import { config } from '../config.mjs';

const PYTHON_TIMEOUT_MS = 5000;

export async function callPython(pathname, payload = {}) {
  const url = `${config.pythonServiceUrl}${pathname}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PYTHON_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-API-Key': config.internalApiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const err = new Error(data.message || `Python service error (${response.status})`);
      err.status = response.status;
      throw err;
    }
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutErr = new Error('Python service timed out.');
      timeoutErr.status = 504;
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}