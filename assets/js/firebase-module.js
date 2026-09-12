// Modular Firebase SDK Export
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Ophei Ansah Auto Imports - Firebase Config
export const firebaseConfig = {
  apiKey: "AIzaSyB6aYWRCbAR1HgWsRiL5u6P2kORhqqfJ7U",
  authDomain: "opheiansahimports.firebaseapp.com",
  projectId: "opheiansahimports",
  storageBucket: "opheiansahimports.firebasestorage.app",
  messagingSenderId: "151056548995",
  appId: "1:151056548995:web:90fa7d13d21cb1274d47b6",
  measurementId: "G-MKP2PHMJHZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Track custom event helper
export function trackEvent(name, params = {}) {
  if (analytics) {
    logEvent(analytics, name, params);
  }
}

// Attach to window for global access
if (typeof window !== 'undefined') {
  window.firebaseModularApp = app;
  window.firebaseModularAnalytics = analytics;
}
