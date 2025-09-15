import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { calculatePerformanceScore } from '../../utils/performanceScore';
import { PERFORMANCE_GRADES } from '../../constants/metrics';

function PerformanceScore({ metrics, url }) {
  if (!metrics) return null;

  const { score, grade, breakdown, recommendations } = calculatePerformanceScore(metrics);

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getGradeColor = (grade) => {
    const gradeConfig = PERFORMANCE_GRADES[grade];
    return gradeConfig?.color || 'error';
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return <CheckCircleIcon />;
    if (score >= 70) return <TrendingUpIcon />;
    return <ErrorIcon />;
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Performance Score
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overall performance rating for {url}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={score}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: '50%',
                    backgroundColor: `${getScoreColor(score)}.main`
                  }
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <Typography variant="h4" fontWeight={700} color={`${getScoreColor(score)}.main`}>
                  {score}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {grade}
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={getScoreIcon(score)}
              label={`Grade ${grade}`}
              color={getGradeColor(grade)}
              variant="outlined"
            />
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Metric Breakdown
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {Object.entries(breakdown).map(([metric, score]) => (
              <Box key={metric} sx={{ minWidth: 120 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  {metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={score}
                    sx={{ flex: 1, height: 6, borderRadius: 3 }}
                    color={getScoreColor(score)}
                  />
                  <Typography variant="body2" fontWeight={600} color={`${getScoreColor(score)}.main`}>
                    {score}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {recommendations.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Recommendations
            </Typography>
            <List dense>
              {recommendations.map((rec, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    {rec.priority === 'high' ? (
                      <ErrorIcon color="error" />
                    ) : (
                      <WarningIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={rec.message}
                    secondary={`Priority: ${rec.priority}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {recommendations.length === 0 && (
          <Alert severity="success" icon={<CheckCircleIcon />}>
            <Typography variant="body2">
              Excellent performance! All metrics are within good thresholds.
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default PerformanceScore;
