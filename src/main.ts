import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => {
      console.log('Service Worker registered');
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
