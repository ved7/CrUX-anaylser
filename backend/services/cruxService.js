const axios = require('axios');
const { CRUX_API, ERROR_MESSAGES, HTTP_STATUS } = require('../config/constants');
const { normalizeUrl } = require('../utils/urlNormalizer');
const { processMetrics } = require('../utils/metricProcessor');

class CruxService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = CRUX_API.BASE_URL;
  }

  async fetchSingleUrlData(url) {
    try {
      const normalizedUrl = normalizeUrl(url);
      const requestBody = {
        origin: normalizedUrl,
        formFactor: CRUX_API.FORM_FACTOR,
        metrics: CRUX_API.METRICS
      };

      const response = await axios.post(`${this.baseUrl}?key=${this.apiKey}`, requestBody);
      
      if (!response.data || !response.data.record) {
        throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
      }

      const processedMetrics = processMetrics(response.data.record);
      
      return {
        success: true,
        url: normalizedUrl,
        originalUrl: url,
        data: response.data.record,
        processedMetrics,
        isMockData: false
      };
    } catch (error) {
      return this.handleError(error, url);
    }
  }

  async fetchMultipleUrlData(urls) {
    const promises = urls.map(url => this.fetchSingleUrlData(url));
    const results = await Promise.allSettled(promises);
    
    return results.map(result => 
      result.status === 'fulfilled' ? result.value : result.reason
    );
  }

  handleError(error, url) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case HTTP_STATUS.BAD_REQUEST:
          return {
            success: false,
            error: ERROR_MESSAGES.INVALID_URL,
            errorType: 'validation',
            url,
            originalUrl: url
          };
        case HTTP_STATUS.UNAUTHORIZED:
        case HTTP_STATUS.FORBIDDEN:
          return {
            success: false,
            error: ERROR_MESSAGES.API_KEY_INVALID,
            errorType: 'authentication',
            url,
            originalUrl: url
          };
        case HTTP_STATUS.NOT_FOUND:
          return {
            success: false,
            error: ERROR_MESSAGES.DATA_NOT_FOUND,
            errorType: 'not_found',
            url,
            originalUrl: url
          };
        case HTTP_STATUS.TOO_MANY_REQUESTS:
          return {
            success: false,
            error: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
            errorType: 'rate_limit',
            url,
            originalUrl: url
          };
        default:
          return {
            success: false,
            error: ERROR_MESSAGES.SERVER_ERROR,
            errorType: 'server_error',
            url,
            originalUrl: url
          };
      }
    }

    return {
      success: false,
      error: error.message || ERROR_MESSAGES.SERVER_ERROR,
      errorType: 'unknown',
      url,
      originalUrl: url
    };
  }

  generateMockData(url) {
    const normalizedUrl = normalizeUrl(url);
    
    return {
      success: true,
      url: normalizedUrl,
      originalUrl: url,
      data: {
        record: {
          key: {
            formFactor: 'PHONE',
            origin: normalizedUrl
          },
          metrics: {
            largest_contentful_paint: {
              histogram: [
                { start: 0, end: 2500, density: 0.7 },
                { start: 2500, end: 4000, density: 0.2 },
                { start: 4000, end: 8000, density: 0.1 }
              ],
              percentiles: { p75: 2800, p95: 4500 }
            },
            cumulative_layout_shift: {
              histogram: [
                { start: 0, end: 0.1, density: 0.8 },
                { start: 0.1, end: 0.25, density: 0.15 },
                { start: 0.25, end: 1, density: 0.05 }
              ],
              percentiles: { p75: 0.08, p95: 0.15 }
            },
            first_contentful_paint: {
              histogram: [
                { start: 0, end: 1800, density: 0.6 },
                { start: 1800, end: 3000, density: 0.3 },
                { start: 3000, end: 6000, density: 0.1 }
              ],
              percentiles: { p75: 2200, p95: 3500 }
            },
            interaction_to_next_paint: {
              histogram: [
                { start: 0, end: 200, density: 0.75 },
                { start: 200, end: 500, density: 0.2 },
                { start: 500, end: 1000, density: 0.05 }
              ],
              percentiles: { p75: 180, p95: 300 }
            }
          }
        }
      },
      processedMetrics: {
        largest_contentful_paint: {
          p75: 2800,
          p95: 4500,
          histogram: [
            { start: 0, end: 2500, density: 0.7 },
            { start: 2500, end: 4000, density: 0.2 },
            { start: 4000, end: 8000, density: 0.1 }
          ]
        },
        cumulative_layout_shift: {
          p75: 0.08,
          p95: 0.15,
          histogram: [
            { start: 0, end: 0.1, density: 0.8 },
            { start: 0.1, end: 0.25, density: 0.15 },
            { start: 0.25, end: 1, density: 0.05 }
          ]
        },
        first_contentful_paint: {
          p75: 2200,
          p95: 3500,
          histogram: [
            { start: 0, end: 1800, density: 0.6 },
            { start: 1800, end: 3000, density: 0.3 },
            { start: 3000, end: 6000, density: 0.1 }
          ]
        },
        interaction_to_next_paint: {
          p75: 180,
          p95: 300,
          histogram: [
            { start: 0, end: 200, density: 0.75 },
            { start: 200, end: 500, density: 0.2 },
            { start: 500, end: 1000, density: 0.05 }
          ]
        }
      },
      isMockData: true
    };
  }
}

module.exports = CruxService;
