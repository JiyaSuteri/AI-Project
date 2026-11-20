/**
 * Resolves static assets against the Vite base path (e.g. /AI-Project/ on GitHub Pages or / locally).
 */
export function assetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const cleanPath = path.replace(/^\/+/, '');
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${cleanPath}`;
}
