import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Grid
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { calculatePerformanceScore } from '../../utils/performanceScore';
import { METRIC_DEFINITIONS } from '../../constants/metrics';

function InsightsPanel({ data }) {
  const insights = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    const successfulData = data.filter(item => item.success && item.processedMetrics);
    if (successfulData.length === 0) return null;

    const allMetrics = {};
    Object.keys(METRIC_DEFINITIONS).forEach(metricName => {
      const values = successfulData
        .map(item => item.processedMetrics[metricName]?.p75)
        .filter(val => val !== null && val !== undefined);
      
      if (values.length > 0) {
        allMetrics[metricName] = {
          average: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length
        };
      }
    });

    const scores = successfulData.map(item => ({
      url: item.originalUrl || item.url,
      score: calculatePerformanceScore(item.processedMetrics)
    }));

    const bestPerformer = scores.reduce((best, current) => 
      current.score.score > best.score.score ? current : best
    );
    const worstPerformer = scores.reduce((worst, current) => 
      current.score.score < worst.score.score ? current : worst
    );

    const averageScore = scores.reduce((sum, item) => sum + item.score.score, 0) / scores.length;

    const recommendations = [];
    Object.entries(allMetrics).forEach(([metricName, metric]) => {
      const config = METRIC_DEFINITIONS[metricName];
      const threshold = config.threshold;
      
      if (metric.average > threshold.needsImprovement) {
        recommendations.push({
          metric: metricName,
          priority: 'high',
          message: `${config.name} is poor across all URLs (avg: ${Math.round(metric.average)}${config.unit})`,
          suggestion: getRecommendation(metricName, 'high')
        });
      } else if (metric.average > threshold.good) {
        recommendations.push({
          metric: metricName,
          priority: 'medium',
          message: `${config.name} needs improvement (avg: ${Math.round(metric.average)}${config.unit})`,
          suggestion: getRecommendation(metricName, 'medium')
        });
      }
    });

    return {
      allMetrics,
      scores,
      bestPerformer,
      worstPerformer,
      averageScore: Math.round(averageScore),
      recommendations: recommendations.sort((a, b) => a.priority === 'high' ? -1 : 1)
    };
  }, [data]);

  const getRecommendation = (metricName, priority) => {
    const recommendations = {
      largest_contentful_paint: {
        high: 'Optimize images, preload critical resources, and improve server response time.',
        medium: 'Consider optimizing images and reducing server response time.'
      },
      cumulative_layout_shift: {
        high: 'Set explicit dimensions for images and avoid inserting content above existing content.',
        medium: 'Review layout shifts and set explicit dimensions for dynamic content.'
      },
      first_contentful_paint: {
        high: 'Optimize critical rendering path and minimize render-blocking resources.',
        medium: 'Consider reducing render-blocking resources and optimizing CSS.'
      },
      interaction_to_next_paint: {
        high: 'Reduce main thread blocking time and optimize JavaScript execution.',
        medium: 'Consider code splitting and optimizing JavaScript performance.'
      }
    };
    
    return recommendations[metricName]?.[priority] || 'Consider optimizing this metric.';
  };

  if (!insights) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Performance Insights
          </Typography>
          <Alert severity="info">
            <Typography variant="body2">
              No performance data available. Analyze some URLs to see insights and recommendations.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Performance Insights
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Overall Performance
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main" fontWeight={600}>
                  {insights.averageScore}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Score
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main" fontWeight={600}>
                  {insights.bestPerformer.url}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Best Performer ({insights.bestPerformer.score.score})
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error.main" fontWeight={600}>
                  {insights.worstPerformer.url}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Needs Improvement ({insights.worstPerformer.score.score})
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {insights.recommendations.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Recommendations
            </Typography>
            <List>
              {insights.recommendations.map((rec, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    {rec.priority === 'high' ? (
                      <WarningIcon color="error" />
                    ) : (
                      <TrendingUpIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={rec.message}
                    secondary={rec.suggestion}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'body2' }}
                  />
                  <Chip
                    label={rec.priority}
                    color={rec.priority === 'high' ? 'error' : 'warning'}
                    size="small"
                    variant="outlined"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Metric Analysis
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(insights.allMetrics).map(([metricName, metric]) => {
              const config = METRIC_DEFINITIONS[metricName];
              const isGood = metric.average <= config.threshold.good;
              const needsImprovement = metric.average <= config.threshold.needsImprovement;
              
              return (
                <Grid item xs={12} sm={6} md={3} key={metricName}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      {config.name}
                    </Typography>
                    <Typography variant="h6" color={isGood ? 'success.main' : needsImprovement ? 'warning.main' : 'error.main'}>
                      {Math.round(metric.average)}{config.unit}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Range: {Math.round(metric.min)}-{Math.round(metric.max)}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={isGood ? 'Good' : needsImprovement ? 'Needs Improvement' : 'Poor'}
                        color={isGood ? 'success' : needsImprovement ? 'warning' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default InsightsPanel;
