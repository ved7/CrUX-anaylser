const CruxService = require('../services/cruxService');
const { ERROR_MESSAGES, HTTP_STATUS } = require('../config/constants');

class CruxController {
  constructor() {
    this.cruxService = new CruxService(process.env.GOOGLE_API_KEY);
  }

  async analyzeSingleUrl(req, res) {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'URL is required'
        });
      }

      let result;
      
      // Use mock data if API key is not available
      if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_api_key_here') {
        result = this.cruxService.generateMockData(url);
      } else {
        result = await this.cruxService.fetchSingleUrlData(url);
      }

      res.json(result);
    } catch (error) {
      console.error('Error in analyzeSingleUrl:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.SERVER_ERROR
      });
    }
  }

  async analyzeMultipleUrls(req, res) {
    try {
      const { urls } = req.body;

      if (!urls || !Array.isArray(urls)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'URLs array is required'
        });
      }

      let results;
      
      // Use mock data if API key is not available
      if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_api_key_here') {
        results = urls.map(url => this.cruxService.generateMockData(url));
      } else {
        results = await this.cruxService.fetchMultipleUrlData(urls);
      }

      res.json({
        success: true,
        results,
        totalUrls: urls.length,
        successfulUrls: results.filter(r => r.success).length,
        failedUrls: results.filter(r => !r.success).length
      });
    } catch (error) {
      console.error('Error in analyzeMultipleUrls:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.SERVER_ERROR
      });
    }
  }

  healthCheck(req, res) {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  }
}

module.exports = new CruxController();
