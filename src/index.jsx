import { render } from 'solid-js/web';
import App from './App';
import './index.css';
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: import.meta.env.VITE_PUBLIC_SENTRY_DSN,
  environment: import.meta.env.VITE_PUBLIC_APP_ENV,
  integrations: [Sentry.browserTracingIntegration()],
  initialScope: {
    tags: {
      type: 'frontend',
      projectId: import.meta.env.VITE_PUBLIC_APP_ID,
    },
  },
});

// Add PWA support to the app (this will add a service worker and a manifest file, you don't need to do anything else, just add the public/progressier.js file)
window.progressierAppRuntimeSettings = {
  uid: import.meta.env.VITE_PUBLIC_APP_ID,
  icon512: "https://otebnzqfzytqyyjdfhzr.supabase.co/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512",
  name: "Name That Puppy",
  shortName: "Name That Puppy"
};
let script = document.createElement('script');
script.setAttribute('src', 'https://progressier.app/z8yY3IKmfpDIw3mSncPh/script.js');
script.setAttribute('defer', 'true');
document.querySelector('head').appendChild(script);

// Umami analytics
if (!window.location.hostname.includes('vercel.app')) {
  const umamiScript = document.createElement('script');
  umamiScript.defer = true;
  umamiScript.src = 'https://cloud.umami.is/script.js';
  umamiScript.setAttribute('data-website-id', import.meta.env.VITE_PUBLIC_UMAMI_WEBSITE_ID);
  document.head.appendChild(umamiScript);
}

render(() => <App />, document.getElementById('root'));