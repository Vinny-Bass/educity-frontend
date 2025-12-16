"use server";

import { fetchFromStrapi } from "@/lib/strapi";
import type { User } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import qs from "qs";

const STRAPI_API_URL = process.env.STRAPI_API_URL || "http://127.0.0.1:1337";
const TOKEN_COOKIE_NAME = "token";

type EnrollmentResponse = Array<{
  documentId: string;
  class: {
    documentId: string;
  };
}>;

export interface StudentSession {
  user: User;
  enrollmentId: string | null;
  classDocId: string | null;
}

// --- Cookie Writers ---

/**
 * Sets the JWT as a secure, HttpOnly cookie.
 * This is called by the `login` Server Action.
 */
export async function setAuthCookie(token: string) {
  (await cookies()).set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax",
  });
}

/**
 * Clears the auth cookie.
 * This is called by the `logout` Server Action.
 */
export async function clearAuthCookie() {
  (await cookies()).set(TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire immediately
    path: "/",
  });
}

// --- Auth Readers & Utilities ---

/**
 * Gets the raw JWT from the cookie.
 */
export async function getAuthToken(): Promise<string | null> {
  return (await cookies()).get(TOKEN_COOKIE_NAME)?.value || null;
}

/**
 * Gets the "heavy" user data: Fetches the full user profile from Strapi.
 * If this request succeeds, the token is valid.
 * If it fails, the token is invalid.
 */
export async function getUser(): Promise<User | null> {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${STRAPI_API_URL}/api/users/me?populate=role`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // Always fetch fresh user data
    });

    if (!response.ok) {
      // 401 (Unauthorized) or 403 (Forbidden)
      // This means the token is invalid or expired
      return null;
    }

    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}

/**
 * Loads the authenticated student session, including the active enrollment.
 */
export async function getStudentSession(): Promise<StudentSession | null> {
  const user = await getUser();
  if (!user) {
    return null;
  }

  try {
    const query = qs.stringify({
      filters: { student: { id: { $eq: user.id } } },
      populate: {
        class: {
          fields: ["documentId"],
        },
      },
      sort: ["createdAt:desc"],
      limit: 1,
      fields: ["*"],
    });

    const enrollments = await fetchFromStrapi<EnrollmentResponse>(
      `/enrollments?${query}`
    );

    const activeEnrollment =
      Array.isArray(enrollments) && enrollments.length > 0
        ? enrollments[0]
        : null;

    return {
      user,
      enrollmentId: activeEnrollment?.documentId ?? null,
      classDocId: activeEnrollment?.class?.documentId ?? null,
    };
  } catch (error) {
    console.error("Failed to fetch student enrollment:", error);

    return {
      user,
      enrollmentId: null,
      classDocId: null,
    };
  }
}

/**
 * A utility for Server Components to protect pages.
 * It uses the getUser() check.
 * If the user is not authenticated, it redirects to /login.
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
