import React from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

function ErrorDisplay({ error, onRetry, title = 'Error' }) {
  if (!error) return null;

  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry} startIcon={<RefreshIcon />}>
            Retry
          </Button>
        )
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {error}
    </Alert>
  );
}

export default ErrorDisplay;
