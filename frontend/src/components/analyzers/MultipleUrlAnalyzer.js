import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Grid,
  Paper
} from '@mui/material';
import { Search as SearchIcon, Download as DownloadIcon } from '@mui/icons-material';
import { usePerformanceData } from '../../contexts/PerformanceDataContext';
import { useSnackbar } from '../../hooks/useSnackbar';
import { isValidUrl, formatUrlForApi } from '../../utils/urlUtils';
import { exportToCSV, exportToJSON, exportToTextReport } from '../../utils/exportUtils';
import PerformanceTable from '../common/PerformanceTable';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';

function MultipleUrlAnalyzer() {
  const [urls, setUrls] = useState('');
  const { loading, error, data, analyzeMultipleUrls, clearError } = usePerformanceData();
  const { snackbar, showInfo, hideSnackbar } = useSnackbar();

  const handleAnalyze = async () => {
    if (!urls.trim()) return;

    const urlList = urls.split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urlList.length === 0) {
      showInfo('Please enter at least one URL');
      return;
    }

    if (urlList.length > 10) {
      showInfo('Maximum 10 URLs allowed per request');
      return;
    }

    const invalidUrls = urlList.filter(url => !isValidUrl(url));
    if (invalidUrls.length > 0) {
      showInfo(`Invalid URLs found: ${invalidUrls.join(', ')}`);
      return;
    }

    try {
      const formattedUrls = urlList.map(formatUrlForApi);
      const result = await analyzeMultipleUrls(formattedUrls);

      if (result.results.some(r => r.isMockData)) {
        showInfo('Using demo data for some URLs. Configure API key for live data.');
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
    if (data?.results) {
      exportToCSV(data.results, 'multiple-urls-performance.csv');
    }
  };

  const handleExportJSON = () => {
    if (data?.results) {
      exportToJSON(data.results, 'multiple-urls-performance.json');
    }
  };

  const handleExportReport = () => {
    if (data?.results) {
      exportToTextReport(data.results, 'performance-analysis-report.txt');
    }
  };

  const getSummaryStats = () => {
    if (!data?.results) return null;

    const successful = data.results.filter(r => r.success);
    const failed = data.results.filter(r => !r.success);
    const mockData = data.results.filter(r => r.isMockData);

    return { successful, failed, mockData };
  };

  const summaryStats = getSummaryStats();

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Analyze Multiple URLs
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter multiple URLs (one per line) to compare their performance
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              multiline
              rows={4}
              label="Enter URLs (one per line)"
              placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              disabled={loading}
              helperText={`${urls.split('\n').filter(url => url.trim()).length}/10 URLs`}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleAnalyze}
              disabled={loading || !urls.trim()}
              sx={{ alignSelf: 'flex-start' }}
            >
              {loading ? 'Analyzing...' : 'Analyze All'}
            </Button>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Enter one URL per line. Maximum 10 URLs per analysis.
              Some URLs may not have performance data available.
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {loading && <LoadingSpinner message="Analyzing multiple URLs..." />}

      {error && <ErrorDisplay error={error} onRetry={handleRetry} />}

      {data && (
        <Box>
          {summaryStats && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" fontWeight={600}>
                    {summaryStats.successful.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Successful
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main" fontWeight={600}>
                    {summaryStats.failed.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Failed
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main" fontWeight={600}>
                    {summaryStats.mockData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Demo data, Configure API key for real data
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
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
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportReport}
              size="small"
            >
              Export Report
            </Button>
          </Box>

          {data.results && (
            <PerformanceTable
              data={data.results}
              showSummary={true}
              title="Performance Comparison"
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

export default MultipleUrlAnalyzer;
