/**
 * Returns the absolute URL for a Strapi media file.
 * @param relativePath - The relative path from the Strapi API (e.g., /uploads/...)
 * @returns The absolute URL (e.g., http://localhost:1337/uploads/...)
 */
export function getStrapiMedia(relativePath: string | null | undefined): string | null {
  const strapiUrl = process.env.STRAPI_API_URL || "http://localhost:1337";

  if (!relativePath) {
    return null;
  }

  if (relativePath.startsWith("http")) {
    return relativePath;
  }

  return `${strapiUrl}${relativePath}`;
}
