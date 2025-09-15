const config = {
  cache: {
    maxSize: 1000,
    ttl: 15 * 60 * 1000,
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  }
};

module.exports = config;
