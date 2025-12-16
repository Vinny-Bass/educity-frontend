# Security Enhancements Documentation

This document describes the security improvements implemented in the authentication system.

## 🔒 Security Features Implemented

### 1. ✅ Token Verification in Middleware

**Problem Solved:** Middleware now validates JWT tokens, checking for:
- Token structure validity
- Expiration status
- Invalid/tampered tokens

**Implementation:**
- `src/lib/jwt.ts` - JWT validation utilities
- `src/middleware.ts` - Validates tokens on every request

**How it works:**
1. Middleware decodes and validates the JWT structure
2. Checks if the token is expired (without full signature verification for performance)
3. Clears invalid/expired tokens automatically
4. Full signature verification happens when calling Strapi's `/api/users/me`

**JWT Payload Structure (Strapi Standard):**
```typescript
{
  id: number;      // User ID (safe to expose)
  iat: number;     // Issued at timestamp
  exp: number;     // Expiration timestamp
}
```

✅ **Safe:** No sensitive data (passwords, PII) in JWT payload.
⚠️ **Note:** JWTs are encoded (base64), not encrypted. Anyone can decode them.

---

### 2. ✅ Rate Limiting for Login

**Problem Solved:** Prevents brute force attacks on user accounts.

**Implementation:**
- `src/lib/rate-limit.ts` - In-memory rate limiting
- `src/features/auth/actions.ts` - Integrated into login flow

**Configuration:**
- **Max Attempts:** 5 login attempts per IP
- **Window:** 15 minutes
- **Reset:** Automatically resets after successful login

**Current Implementation:**
- ✅ In-memory store (works for single-instance deployments)
- ⚠️ **For production with multiple instances/serverless:**
  - Use Redis (Upstash, Vercel KV, AWS ElastiCache)
  - Or database with TTL indexes
  - See `src/lib/rate-limit.ts` comments for migration guide

**Rate Limit Response:**
```typescript
{
  success: false,
  error: "Too many login attempts. Please try again in X minutes.",
  rateLimitResetAt: timestamp
}
```

---

### 3. ✅ CSRF Protection

**Problem Solved:** Protects against Cross-Site Request Forgery attacks on state-changing operations.

**Implementation:**
- `src/lib/csrf.ts` - CSRF token utilities
- `src/lib/csrf-middleware.ts` - Middleware helper for API routes
- `src/app/api/auth/csrf/route.ts` - Endpoint to get CSRF token

**How it works:**
1. Server generates CSRF token, stores in HttpOnly cookie
2. Client fetches token from `/api/auth/csrf`
3. Client includes token in `X-CSRF-Token` header for mutations
4. Server verifies token matches cookie value

**Usage in API Routes:**
```typescript
import { requireCsrf } from '@/lib/csrf-middleware';

export async function POST(request: NextRequest) {
  const csrfError = await requireCsrf(request);
  if (csrfError) return csrfError;

  // Your protected logic here
}
```

**Note:** Next.js Server Actions are **automatically protected** by Next.js against CSRF. This CSRF protection is primarily for:
- Custom API routes accepting POST/PUT/DELETE/PATCH
- Direct fetch calls to your API routes

---

### 4. ✅ JWT Payload Inspection

**Implementation:**
- `src/lib/jwt.ts` - Utilities to decode and inspect JWT payloads

**Usage:**
```typescript
import { decodeToken, validateTokenStructure } from '@/lib/jwt';

// Decode without verification (for inspection)
const payload = decodeToken(token);

// Validate structure and expiration
const validation = validateTokenStructure(token);
```

---

## 🛡️ Security Best Practices

### Cookie Security
- ✅ **HttpOnly:** Prevents XSS attacks from reading tokens
- ✅ **Secure:** HTTPS only in production
- ✅ **SameSite:** Lax (helps prevent CSRF)

### Token Storage
- ✅ **HttpOnly Cookies:** Tokens never exposed to JavaScript
- ✅ **Server-Side Validation:** All token verification happens server-side

### Rate Limiting
- ✅ **IP-based:** Tracks attempts per IP address
- ✅ **Automatic Reset:** Clears on successful login
- ✅ **User-Friendly Messages:** Shows remaining attempts and reset time

### CSRF Protection
- ✅ **Double Cookie:** Token in HttpOnly cookie + header comparison
- ✅ **Constant-Time Comparison:** Prevents timing attacks
- ✅ **Automatic for Server Actions:** Next.js handles it

---

## 📋 Migration Guide for Production

### Rate Limiting Migration

For multi-instance or serverless deployments, replace in-memory store:

**Option 1: Vercel KV / Upstash**
```typescript
import { kv } from '@vercel/kv';

// Replace Map operations with KV operations
await kv.set(`rate_limit:${ip}`, count, { ex: 900 }); // 15 min TTL
```

**Option 2: Redis**
```typescript
import { Redis } from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

await redis.setex(`rate_limit:${ip}`, 900, count.toString());
```

### Enhanced JWT Verification

For production, consider caching Strapi's JWT secret and verifying signatures:

```typescript
import { jwtVerify, createRemoteJWKSet } from 'jose';

const JWKS = createRemoteJWKSet(
  new URL(`${STRAPI_URL}/.well-known/jwks.json`)
);

const { payload } = await jwtVerify(token, JWKS);
```

---

## 🔍 Testing Security Features

### Test Token Expiration
```bash
# Wait for token to expire, then try accessing protected route
# Should redirect to /login
```

### Test Rate Limiting
```bash
# Try 6 login attempts with wrong password
# 6th attempt should be blocked
```

### Test CSRF Protection
```bash
# Try POST without X-CSRF-Token header
# Should return 403
```

### Verify JWT Payload
```typescript
import { decodeToken } from '@/lib/jwt';
const payload = decodeToken(token);
console.log(payload); // Should only contain id, iat, exp
```

---

## ⚠️ Important Notes

1. **In-Memory Rate Limiting:** Current implementation works for single-instance. For production with multiple instances, migrate to Redis/KV.

2. **JWT Secret:** Strapi manages JWT secrets. We don't verify signatures in middleware (performance), but full verification happens when calling Strapi APIs.

3. **CSRF for Server Actions:** Next.js automatically protects Server Actions. Use CSRF middleware only for custom API routes.

4. **Token Expiration:** Tokens expire after 7 days (configured in Strapi). Users will need to re-authenticate.

---

## 📚 Additional Resources

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [Strapi Security Documentation](https://docs.strapi.io/dev-docs/security)

