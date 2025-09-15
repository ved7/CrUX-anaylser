const { PERFORMANCE_THRESHOLDS } = require('../config/constants');

function processMetrics(record) {
  if (!record || !record.metrics) {
    return null;
  }

  const processedMetrics = {};
  const metrics = record.metrics;

  Object.keys(metrics).forEach(metricName => {
    const metric = metrics[metricName];
    if (metric && metric.percentiles) {
      processedMetrics[metricName] = {
        p75: metric.percentiles.p75 || null,
        p95: metric.percentiles.p95 || null,
        histogram: metric.histogram || []
      };
    }
  });

  return processedMetrics;
}

function calculateMetricScore(metricName, value) {
  const threshold = PERFORMANCE_THRESHOLDS[metricName.toUpperCase()];
  if (!threshold || value === null || value === undefined) {
    return 0;
  }

  if (value <= threshold.good) {
    return 100;
  } else if (value <= threshold.needsImprovement) {
    const ratio = (threshold.needsImprovement - value) / (threshold.needsImprovement - threshold.good);
    return Math.round(50 + (ratio * 50));
  } else {
    const ratio = Math.max(0, (threshold.needsImprovement * 2 - value) / threshold.needsImprovement);
    return Math.round(ratio * 50);
  }
}

function generateRecommendations(metrics) {
  const recommendations = [];
  
  Object.entries(metrics).forEach(([metricName, metric]) => {
    if (metric && metric.p75 !== null) {
      const score = calculateMetricScore(metricName, metric.p75);
      if (score < 70) {
        recommendations.push({
          metric: metricName,
          score,
          priority: score < 50 ? 'high' : 'medium',
          value: metric.p75,
          threshold: PERFORMANCE_THRESHOLDS[metricName.toUpperCase()]
        });
      }
    }
  });

  return recommendations.sort((a, b) => a.score - b.score);
}

module.exports = {
  processMetrics,
  calculateMetricScore,
  generateRecommendations
};
