/**
 * In-memory rate limiting for login attempts.
 *
 * IMPORTANT: This implementation uses in-memory storage and is suitable for:
 * - Development environments
 * - Single-instance deployments
 * - Low-traffic applications
 *
 * For production with multiple instances, migrate to Redis/Upstash/Vercel KV.
 * See SECURITY.md for migration guide.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (persists only during server lifetime)
const rateLimitStore = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Check if an identifier (IP or email) has exceeded rate limits.
 *
 * @param identifier - Unique identifier (e.g., "ip:127.0.0.1" or "email:user@example.com")
 * @returns Rate limit status
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No existing entry or window expired - create new entry
  if (!entry || now > entry.resetAt) {
    const resetAt = now + WINDOW_MS;
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - 1,
      resetAt,
    };
  }

  // Increment attempt count
  entry.count += 1;
  rateLimitStore.set(identifier, entry);

  const allowed = entry.count <= MAX_ATTEMPTS;
  const remaining = Math.max(0, MAX_ATTEMPTS - entry.count);

  // Optional: Log suspicious activity
  if (entry.count > MAX_ATTEMPTS) {
    console.warn(`Rate limit exceeded for ${identifier}: ${entry.count} attempts`);
  }

  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
  };
}

/**
 * Reset rate limit for an identifier (e.g., after successful login).
 *
 * @param identifier - Unique identifier to reset
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Clear all rate limit entries (useful for testing).
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Clean up expired entries (optional optimization).
 * Call this periodically or in a cron job.
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// Optional: Auto-cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 60 * 60 * 1000);
}
