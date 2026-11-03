/**
 * Validates and sanitizes a redirect target path to prevent Open Redirect vulnerabilities.
 * Ensures the target is strictly a relative path on the same origin.
 */
export function sanitizeRedirectPath(target: string | null | undefined, fallback = "/workspace"): string {
  if (!target || typeof target !== "string") {
    return fallback;
  }

  const trimmed = target.trim();
  if (!trimmed) {
    return fallback;
  }

  // Reject newlines, tabs, and null bytes (prevent HTTP response splitting or header injection)
  if (/[\r\n\t\0]/.test(trimmed)) {
    return fallback;
  }

  // Must begin with a single slash '/'
  // Strictly reject protocol-relative (//) and backslash tricks (/\, \/)
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\") || trimmed.startsWith("\\")) {
    return fallback;
  }

  // Disallow explicit schemes embedded before or after
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return fallback;
  }

  try {
    // Parse against a dummy base origin to verify no host override occurs
    const parsed = new URL(trimmed, "http://localhost");
    if (parsed.origin !== "http://localhost") {
      return fallback;
    }
    // Return relative pathname + search + hash
    const relative = parsed.pathname + parsed.search + parsed.hash;
    return relative.startsWith("/") ? relative : `/${relative}`;
  } catch {
    return fallback;
  }
}

