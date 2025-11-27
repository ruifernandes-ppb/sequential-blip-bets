import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Import websocket service to initialize it
import './services/websocket';

// Start MSW for API mocking in development
async function enableMocking() {
  // Enable MSW in all environments
  const { worker } = await import('./mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    serviceWorker: {
      url: '/sequential-blip-bets/mockServiceWorker.js',
    },
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});
