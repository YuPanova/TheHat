import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializeApp } from "firebase/app";

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const firebaseConfig = {
  apiKey: "AIzaSyDI5kPdCbmc1ScXKmGEnlpq5iOvOfHcogA",
  authDomain: "the-hat-1a8da.firebaseapp.com",
  projectId: "the-hat-1a8da",
  storageBucket: "the-hat-1a8da.appspot.com",
  messagingSenderId: "521386905679",
  appId: "1:521386905679:web:2021bdd3ef9a2b221cda3a"
};
initializeApp(firebaseConfig);

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
