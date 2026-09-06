export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
}

/**
 * Robust fetch wrapper with exponential backoff, jitter, and timeout limits.
 */
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: RetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    initialDelayMs = 500,
    maxDelayMs = 4000,
    backoffFactor = 2,
    timeoutMs = 10000,
    signal,
  } = options;

  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt <= maxRetries) {
    const timeoutController = new AbortController();
    const timer = setTimeout(() => timeoutController.abort(), timeoutMs);

    // Merge signals
    const combinedSignal = signal
      ? anySignal([signal, timeoutController.signal])
      : timeoutController.signal;

    try {
      const response = await fetch(input, {
        ...init,
        signal: combinedSignal,
      });

      clearTimeout(timer);

      // Only retry on 5xx server errors or 429 rate limit
      if (response.ok || (response.status < 500 && response.status !== 429)) {
        return response;
      }

      if (attempt === maxRetries) {
        return response;
      }
    } catch (err: unknown) {
      clearTimeout(timer);
      if (signal?.aborted) {
        throw new Error("Request was cancelled");
      }
      if (attempt === maxRetries) {
        throw err;
      }
    }

    attempt++;
    // Add jitter (±20%)
    const jitter = delay * 0.2 * (Math.random() * 2 - 1);
    const sleepDuration = Math.min(delay + jitter, maxDelayMs);
    await new Promise((resolve) => setTimeout(resolve, sleepDuration));
    delay *= backoffFactor;
  }

  throw new Error("Max retries exceeded");
}

function anySignal(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const sig of signals) {
    if (sig.aborted) {
      controller.abort();
      return controller.signal;
    }
    sig.addEventListener("abort", () => controller.abort(), { once: true });
  }
  return controller.signal;
}
