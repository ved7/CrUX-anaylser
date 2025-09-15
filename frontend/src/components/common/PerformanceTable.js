import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Tooltip,
  Box
} from '@mui/material';
import { METRIC_DEFINITIONS } from '../../constants/metrics';

function PerformanceTable({ data, showSummary = true, title = 'Performance Metrics' }) {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No performance data available</Typography>
      </Paper>
    );
  }

  const renderMetricCell = (metric, metricName) => {
    if (!metric) return <Typography color="text.secondary">N/A</Typography>;

    const config = METRIC_DEFINITIONS[metricName];
    const p75 = metric.p75;
    const p95 = metric.p95;
    const goodPercentage = metric.histogram?.[0]?.density ?
      Math.round(metric.histogram[0].density * 100) : null;

    const getScoreColor = (value) => {
      if (value === null || value === undefined) return 'default';
      const threshold = config.threshold;
      if (value <= threshold.good) return 'success';
      if (value <= threshold.needsImprovement) return 'warning';
      return 'error';
    };

    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="body2" fontWeight={600}>
            {p75 !== null ? `${p75}${config.unit}` : 'N/A'}
          </Typography>
          {p75 !== null && (
            <Chip
              label={`${goodPercentage}% good`}
              size="small"
              color={getScoreColor(p75)}
              variant="outlined"
            />
          )}
        </Box>
        {p95 !== null && (
          <Typography variant="caption" color="text.secondary">
            95th: {p95}{config.unit}
          </Typography>
        )}
      </Box>
    );
  };

  const calculateSummary = () => {
    const summary = {};
    Object.keys(METRIC_DEFINITIONS).forEach(metricName => {
      const values = data
        .map(item => item.processedMetrics?.[metricName]?.p75)
        .filter(val => val !== null && val !== undefined);

      if (values.length > 0) {
        summary[metricName] = {
          average: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
          min: Math.min(...values),
          max: Math.max(...values)
        };
      }
    });
    return summary;
  };

  const summary = showSummary ? calculateSummary() : null;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                {title}
              </Typography>
            </TableCell>
            {Object.entries(METRIC_DEFINITIONS).map(([key, config]) => (
              <TableCell key={key} align="center">
                <Tooltip title={config.description} arrow>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {config.name}
                  </Typography>
                </Tooltip>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {item.originalUrl || item.url}
                  </Typography>
                  {item.isMockData && (
                    <Chip label="Demo data, Configure API key for real data" size="small" color="info" variant="outlined" />
                  )}
                </Box>
              </TableCell>
              {Object.keys(METRIC_DEFINITIONS).map(metricName => (
                <TableCell key={metricName} align="center">
                  {renderMetricCell(item.processedMetrics?.[metricName], metricName)}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {summary && (
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Summary
                </Typography>
              </TableCell>
              {Object.entries(METRIC_DEFINITIONS).map(([metricName, config]) => {
                const metricSummary = summary[metricName];
                return (
                  <TableCell key={metricName} align="center">
                    {metricSummary ? (
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          Avg: {metricSummary.average}{config.unit}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Range: {metricSummary.min}-{metricSummary.max}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography color="text.secondary">N/A</Typography>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PerformanceTable;
