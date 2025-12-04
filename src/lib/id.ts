/**
 * ID encoding/decoding helpers
 *
 * These functions provide a simple reversible mapping between numeric IDs
 * and URL-safe string slugs. This is primarily for obfuscation/UX, not
 * strong security.
 *
 * Scheme:
 *  - Multiply the ID by a prime and add an offset
 *  - Convert to base-36 and prefix with 'ev-'
 */

const ID_SALT_MULTIPLIER = 9973;
const ID_SALT_OFFSET = 123;
const ID_PREFIX = 'ev-';

/**
 * Encode a numeric ID to a URL-safe string.
 */
export function encodeEventId(id: number): string {
  const salted = id * ID_SALT_MULTIPLIER + ID_SALT_OFFSET;
  return `${ID_PREFIX}${salted.toString(36)}`;
}

/**
 * Decode a URL slug back to a numeric ID.
 * Returns null if the slug is invalid.
 */
export function decodeEventId(slug: string): number | null {
  if (!slug.startsWith(ID_PREFIX)) {
    return null;
  }

  const raw = slug.slice(ID_PREFIX.length);
  const value = parseInt(raw, 36);

  if (Number.isNaN(value) || value <= ID_SALT_OFFSET) {
    return null;
  }

  const id = (value - ID_SALT_OFFSET) / ID_SALT_MULTIPLIER;
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}



