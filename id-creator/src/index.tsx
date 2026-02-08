import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App/App';
import * as Sentry from "@sentry/react";
import { EnvironmentVariables } from 'Config/Environments';

Sentry.init({
  dsn: EnvironmentVariables.REACT_APP_SENTRY_DSN,
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  enableLogs: true,
});


const root = createRoot(document.getElementById('root')!);

root.render(
    <App/>
);
