import React, { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  Chip
} from '@mui/material';
import { Speed as SpeedIcon, Assessment as AssessmentIcon, Insights as InsightsIcon } from '@mui/icons-material';
import theme from './constants/theme';
import SingleUrlAnalyzer from './components/analyzers/SingleUrlAnalyzer';
import MultipleUrlAnalyzer from './components/analyzers/MultipleUrlAnalyzer';
import InsightsPanel from './components/analyzers/InsightsPanel';
import { PerformanceDataProvider, usePerformanceData } from './contexts/PerformanceDataContext';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState(0);
  const { data } = usePerformanceData();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getTabData = () => {
    if (activeTab === 0) {
      return data ? [data] : [];
    } else if (activeTab === 1) {
      return data?.results || [];
    } else if (activeTab === 2) {
      // For Insights tab, return all available data
      const allData = [];
      if (data) {
        // Check if it's single URL data (has processedMetrics directly) or multiple URL data (has results array)
        if (data.processedMetrics) {
          // Single URL data - wrap it in the expected format
          allData.push({
            success: true,
            url: data.url,
            originalUrl: data.originalUrl,
            processedMetrics: data.processedMetrics,
            isMockData: data.isMockData
          });
        } else if (data.results) {
          // Multiple URL data - use results directly
          allData.push(...data.results);
        }
      }
      return allData;
    }
    return [];
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <SpeedIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CrUX Performance Analytics
          </Typography>
          <Chip
            label="Live Data"
            color="success"
            size="small"
            variant="outlined"
            sx={{ ml: 2 }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="analysis tabs">
            <Tab
              icon={<SpeedIcon />}
              label="Single URL"
              id="tab-0"
              aria-controls="tabpanel-0"
            />
            <Tab
              icon={<AssessmentIcon />}
              label="Multiple URLs"
              id="tab-1"
              aria-controls="tabpanel-1"
            />
            <Tab
              icon={<InsightsIcon />}
              label="Insights"
              id="tab-2"
              aria-controls="tabpanel-2"
            />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <SingleUrlAnalyzer />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <MultipleUrlAnalyzer />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <InsightsPanel data={getTabData()} />
        </TabPanel>
      </Container>
    </ThemeProvider>
  );
}

function App() {
  return (
    <PerformanceDataProvider>
      <AppContent />
    </PerformanceDataProvider>
  );
}

export default App;
