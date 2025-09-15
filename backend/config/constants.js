const CRUX_API = {
  BASE_URL: 'https://chromeuxreport.googleapis.com/v1/records:queryRecord',
  METRICS: ['largest_contentful_paint', 'cumulative_layout_shift', 'first_contentful_paint', 'interaction_to_next_paint'],
  FORM_FACTOR: 'PHONE',
  ORIGIN: 'ORIGIN'
};

const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  INP: { good: 200, needsImprovement: 500 }
};

const ERROR_MESSAGES = {
  INVALID_URL: 'Invalid URL format. Please provide a valid URL.',
  API_KEY_MISSING: 'Google API key is required for live data.',
  API_KEY_INVALID: 'Invalid API key. Please check your configuration.',
  DATA_NOT_FOUND: 'No performance data available for this URL.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  SERVER_ERROR: 'Internal server error. Please try again later.'
};

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  CRUX_API,
  PERFORMANCE_THRESHOLDS,
  ERROR_MESSAGES,
  HTTP_STATUS
};
