function normalizeUrl(url) {
  if (!url || typeof url !== 'string') {
    return 'https://example.com';
  }

  let normalizedUrl = url.trim();
  
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    const urlObj = new URL(normalizedUrl);
    
    if (urlObj.protocol === 'http:') {
      urlObj.protocol = 'https:';
    }

    return urlObj.origin;
  } catch (error) {
    return 'https://example.com';
  }
}

module.exports = {
  normalizeUrl
};