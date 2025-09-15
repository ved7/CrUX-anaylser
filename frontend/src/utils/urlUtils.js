export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export function normalizeUrlForDisplay(url) {
  if (!url) return '';

  let normalized = url.trim();

  if (normalized.startsWith('https://')) {
    normalized = normalized.substring(8);
  } else if (normalized.startsWith('http://')) {
    normalized = normalized.substring(7);
  }

  if (normalized.endsWith('/')) {
    normalized = normalized.substring(0, normalized.length - 1);
  }

  return normalized;
}

export function formatUrlForApi(url) {
  if (!url) return '';

  let formatted = url.trim();

  if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
    formatted = `https://${formatted}`;
  }

  return formatted;
}

export function extractDomain(url) {
  if (!url) return '';

  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname;
  } catch {
    return url;
  }
}
