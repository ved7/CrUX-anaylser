import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchSingleUrlData, fetchMultipleUrlData } from '../services/api';

const PerformanceDataContext = createContext();

export function usePerformanceData() {
  const context = useContext(PerformanceDataContext);
  if (!context) {
    throw new Error('usePerformanceData must be used within a PerformanceDataProvider');
  }
  return context;
}

export function PerformanceDataProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const analyzeSingleUrl = useCallback(async (url) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchSingleUrlData(url);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An error occurred while analyzing the URL';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeMultipleUrls = useCallback(async (urls) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchMultipleUrlData(urls);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An error occurred while analyzing URLs';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    loading,
    error,
    data,
    analyzeSingleUrl,
    analyzeMultipleUrls,
    clearData,
    clearError
  };

  return (
    <PerformanceDataContext.Provider value={value}>
      {children}
    </PerformanceDataContext.Provider>
  );
}
