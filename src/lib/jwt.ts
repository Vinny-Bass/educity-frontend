import { decodeJwt } from 'jose';

/**
 * Strapi JWT payload structure (standard Strapi JWT contains):
 * - id: user ID
 * - iat: issued at timestamp
 * - exp: expiration timestamp
 *
 * Note: Strapi JWTs are signed but NOT encrypted.
 * The payload is base64-encoded and can be decoded by anyone.
 * NEVER store sensitive data (passwords, SSN, credit cards, PII) in JWTs.
 */
export interface StrapiJWTPayload {
  id: number;
  iat: number;
  exp: number;
}

/**
 * Decodes a JWT without verification (for inspection purposes only).
 * DO NOT use this for authentication - use verifyToken() instead.
 */
export function decodeToken(token: string): StrapiJWTPayload | null {
  try {
    const decoded = decodeJwt<StrapiJWTPayload>(token);
    return decoded as StrapiJWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Verifies a JWT token's signature and expiration.
 * Since Strapi manages the JWT secret, we need to fetch it from Strapi.
 * However, for middleware performance, we can do a quick expiration check first.
 *
 * For full verification, we validate by calling Strapi's /api/users/me endpoint
 * (which is what getUser() does in auth.ts).
 *
 * This function does a lightweight expiration check only.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (error) {
    return true;
  }
}

/**
 * Validates token structure and expiration without full signature verification.
 * For production, consider caching Strapi's JWT secret and verifying signatures.
 *
 * NOTE: This is a lightweight check. Full verification happens when we call
 * Strapi's /api/users/me endpoint, which validates the signature server-side.
 */
export function validateTokenStructure(token: string): {
  valid: boolean;
  expired: boolean;
  payload: StrapiJWTPayload | null;
} {
  try {
    const payload = decodeToken(token);

    if (!payload) {
      return { valid: false, expired: true, payload: null };
    }

    // Check required fields
    if (!payload.id || !payload.iat || !payload.exp) {
      return { valid: false, expired: true, payload: null };
    }

    const expired = isTokenExpired(token);

    return {
      valid: !expired,
      expired,
      payload: expired ? null : payload,
    };
  } catch (error) {
    return { valid: false, expired: true, payload: null };
  }
}

