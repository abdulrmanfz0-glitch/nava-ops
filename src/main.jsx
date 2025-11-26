// src/main.jsx
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './styles/animations.css';
import './styles/ui-fixes.css';
import './styles/print-styles.css';
import './styles/omni-reality.css';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BrandThemeProvider } from './contexts/BrandThemeContext';
import { LocaleProvider } from './contexts/LocaleContext';
import { AIProvider } from './contexts/AIContext';
import { AIChatProvider } from './contexts/AIChatContext';
import { DataProvider } from './contexts/DataContext';
import { OmniRealityProvider } from './contexts/OmniRealityContext';

// AI Components (Global)
import { AIChatSidebar, AIFloatingButton } from './components/AI';

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary';

// Logger
import logger from './lib/logger';

// Performance monitoring
import { reportWebVitals } from './lib/performanceUtils';

// Initialize logger
logger.info('Application starting', {
  version: import.meta.env.VITE_APP_VERSION || '2.0.0',
  environment: import.meta.env.VITE_APP_ENV || 'development',
});

// Report Web Vitals (Core Web Vitals monitoring)
reportWebVitals((metric) => {
  logger.debug('Web Vital', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
  });
});

// Root component with all providers
const Root = () => {
  return (
    <StrictMode>
      <ErrorBoundary>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <OmniRealityProvider>
            <NotificationProvider>
              <LocaleProvider>
                <ThemeProvider>
                  <BrandThemeProvider>
                    <AuthProvider>
                      <DataProvider>
                        <SubscriptionProvider>
                          <AIProvider>
                            <AIChatProvider>
                              <App />
                              {/* Global AI Components */}
                              <AIChatSidebar />
                              <AIFloatingButton />
                            </AIChatProvider>
                          </AIProvider>
                        </SubscriptionProvider>
                      </DataProvider>
                    </AuthProvider>
                  </BrandThemeProvider>
                </ThemeProvider>
              </LocaleProvider>
            </NotificationProvider>
          </OmniRealityProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>
  );
};

// Render the application
const rootElement = document.getElementById('root');

if (!rootElement) {
  logger.error('Root element not found', { selector: '#root' });
  throw new Error('Failed to find root element');
}

const root = ReactDOM.createRoot(rootElement);
root.render(<Root />);

// Log successful mount
logger.info('Application mounted successfully');

// Service Worker Registration (for PWA support)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        logger.info('Service Worker registered', {
          scope: registration.scope,
        });
      })
      .catch((error) => {
        logger.warn('Service Worker registration failed', {
          error: error.message,
        });
      });
  });
}

// Hot Module Replacement (HMR) for development
if (import.meta.hot) {
  import.meta.hot.accept();
  logger.debug('HMR enabled');
}
 
