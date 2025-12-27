'use server';

import { StrapiApiError } from '@/types/errors';
import { cookies } from 'next/headers';

const STRAPI_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';

/**
 * A centralized, server-side, authenticated Strapi API client.
 * It automatically gets the HttpOnly token from cookies.
 *
 * @param endpoint The API endpoint (e.g., '/courses')
 * @param options Standard RequestInit options
 * @returns The 'data' property from the Strapi response
 */
export async function fetchFromStrapi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = (await cookies()).get('token')?.value;
  const url = `${STRAPI_URL}/api${endpoint}`;
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    cache: 'no-store',
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      const errorBody = await response.json();
      const message = errorBody.error?.message || 'Strapi API request failed';
      console.error('Strapi API Error:', message);

      throw new StrapiApiError(message, response.status);
    }

    const data = await response.json();

    return data.data;

  } catch (error) {
    console.error(`fetchFromStrapi Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

export async function postToStrapi<T>(
  endpoint: string,
  body: T,
  options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(body),
  }
): Promise<T> {
  const token = (await cookies()).get('token')?.value;
  const url = `${STRAPI_URL}/api${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    cache: 'no-store',
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      const errorBody = await response.json();
      const message = errorBody.error?.message || 'Strapi API request failed';
      console.error('Strapi API Error:', message);

      throw new StrapiApiError(message, response.status);
    }

    const data = await response.json();

    return data.data;

  } catch (error) {
    console.error(`postToStrapi Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

export async function putToStrapi<T>(
  endpoint: string,
  body: Partial<T>,
  options: RequestInit = {
    method: 'PUT',
    body: JSON.stringify(body),
  }
): Promise<T> {
  const token = (await cookies()).get('token')?.value;
  const url = `${STRAPI_URL}/api${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    cache: 'no-store',
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      const errorBody = await response.json();
      const message = errorBody.error?.message || JSON.stringify(errorBody.error) || 'Strapi API request failed';
      console.error('Strapi API Error:', message);

      throw new StrapiApiError(message, response.status);
    }

    const data = await response.json();

    return data.data || data;

  } catch (error) {
    console.error(`putToStrapi Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}
