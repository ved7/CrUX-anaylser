import { METRIC_DEFINITIONS, PERFORMANCE_GRADES, RECOMMENDATIONS } from '../constants/metrics';

export function calculatePerformanceScore(metrics) {
  if (!metrics) return { score: 0, breakdown: {}, grade: 'F' };

  const scores = {};
  let totalWeight = 0;
  let weightedScore = 0;

  Object.entries(METRIC_DEFINITIONS).forEach(([metricName, config]) => {
    const metric = metrics[metricName];
    if (metric && metric.p75 !== null) {
      const score = calculateMetricScore(metricName, metric.p75, config);
      scores[metricName] = score;
      weightedScore += score * config.weight;
      totalWeight += config.weight;
    }
  });

  const finalScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  const grade = getPerformanceGrade(finalScore);

  return {
    score: finalScore,
    grade,
    breakdown: scores,
    recommendations: generateRecommendations(scores, metrics)
  };
}

function calculateMetricScore(metricName, value, config) {
  if (value === null || value === undefined) return 0;

  const { threshold } = config;
  
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

function getPerformanceGrade(score) {
  for (const [grade, config] of Object.entries(PERFORMANCE_GRADES)) {
    if (score >= config.min) return grade;
  }
  return 'F';
}

function generateRecommendations(scores, metrics) {
  const recommendations = [];
  
  Object.entries(scores).forEach(([metricName, score]) => {
    if (score < 70) {
      const metric = metrics[metricName];
      if (metric) {
        recommendations.push({
          metric: metricName,
          score,
          priority: score < 50 ? 'high' : 'medium',
          message: getRecommendationMessage(metricName, metric.p75, score)
        });
      }
    }
  });

  return recommendations.sort((a, b) => a.score - b.score);
}

function getRecommendationMessage(metricName, value, score) {
  const config = METRIC_DEFINITIONS[metricName];
  const priority = score < 50 ? 'high' : score < 70 ? 'medium' : 'low';
  const recommendation = RECOMMENDATIONS[metricName][priority];
  
  return `${config.name} of ${value}${config.unit} is ${priority}. ${recommendation}`;
}
