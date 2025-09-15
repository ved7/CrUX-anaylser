import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { Search as SearchIcon, Download as DownloadIcon } from '@mui/icons-material';
import { usePerformanceData } from '../../contexts/PerformanceDataContext';
import { useSnackbar } from '../../hooks/useSnackbar';
import { isValidUrl, formatUrlForApi } from '../../utils/urlUtils';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';
import PerformanceTable from '../common/PerformanceTable';
import PerformanceScore from '../common/PerformanceScore';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';

function SingleUrlAnalyzer() {
  const [url, setUrl] = useState('');
  const { loading, error, data, analyzeSingleUrl, clearError } = usePerformanceData();
  const { snackbar, showInfo, hideSnackbar } = useSnackbar();

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    if (!isValidUrl(url)) {
      showInfo('Please enter a valid URL');
      return;
    }

    try {
      const formattedUrl = formatUrlForApi(url);
      const result = await analyzeSingleUrl(formattedUrl);

      if (result.isMockData) {
        showInfo('Using demo data. Configure API key for live data.');
      }
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleRetry = () => {
    clearError();
    handleAnalyze();
  };

  const handleExportCSV = () => {
    if (data) {
      exportToCSV([data], `${data.url}-performance.csv`);
    }
  };

  const handleExportJSON = () => {
    if (data) {
      exportToJSON([data], `${data.url}-performance.json`);
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Analyze Single URL
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter a URL to analyze its performance metrics
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              label="Enter URL"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              disabled={loading}
              error={url && !isValidUrl(url)}
              helperText={url && !isValidUrl(url) ? 'Please enter a valid URL' : ''}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Some URLs may not have performance data available. Try some popular website like google.com.
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {loading && <LoadingSpinner message="Analyzing performance data..." />}

      {error && <ErrorDisplay error={error} onRetry={handleRetry} />}

      {data && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              {data.originalUrl}
            </Typography>
            <Chip
              label={data.isMockData ? 'Demo data, Configure API key for real data' : 'Live Data'}
              color={data.isMockData ? 'info' : 'success'}
              size="small"
              variant="outlined"
            />
            <Box sx={{ flex: 1 }} />
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportCSV}
              size="small"
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportJSON}
              size="small"
            >
              Export JSON
            </Button>
          </Box>

          {data.processedMetrics && (
            <PerformanceScore
              metrics={data.processedMetrics}
              url={data.originalUrl}
            />
          )}

          {data.processedMetrics && (
            <PerformanceTable
              data={[data]}
              showSummary={false}
              title=""
            />
          )}
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={hideSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
}

export default SingleUrlAnalyzer;
