/**
 * Release mode utilities for production deployment.
 * Sanitizes preview-only URL artifacts on initial load.
 */

/**
 * Removes preview-only URL parameters and hash fragments
 * to ensure production visitors see the clean Version 21 experience.
 */
export function sanitizePreviewArtifacts(): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  let modified = false;

  // Remove preview-only query parameters
  const previewParams = ['preview', 'version', 'v', 'build', 'test'];
  previewParams.forEach((param) => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      modified = true;
    }
  });

  // Remove preview-only hash fragments
  if (url.hash && (url.hash.includes('preview') || url.hash.includes('version'))) {
    url.hash = '';
    modified = true;
  }

  // Replace URL without reload if modified
  if (modified) {
    window.history.replaceState({}, '', url.toString());
  }
}

/**
 * Initialize release mode on app bootstrap.
 * Call this once during app mount.
 */
export function initReleaseMode(): void {
  sanitizePreviewArtifacts();
}
