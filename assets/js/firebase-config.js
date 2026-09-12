/**
 * OPHEI ANSAH AUTO IMPORTS - FIREBASE CONFIGURATION & INITIALIZATION ENGINE
 * Project ID: opheiansahimports
 * Firebase App & Google Analytics (G-MKP2PHMJHZ)
 */

const firebaseConfig = {
  apiKey: "AIzaSyB6aYWRCbAR1HgWsRiL5u6P2kORhqqfJ7U",
  authDomain: "opheiansahimports.firebaseapp.com",
  projectId: "opheiansahimports",
  storageBucket: "opheiansahimports.firebasestorage.app",
  messagingSenderId: "151056548995",
  appId: "1:151056548995:web:90fa7d13d21cb1274d47b6",
  measurementId: "G-MKP2PHMJHZ"
};

// Global Firebase Wrapper
window.OpheiFirebase = {
  app: null,
  analytics: null,
  isInitialized: false,

  init() {
    try {
      if (typeof firebase !== 'undefined') {
        // Compat mode (v8/v9 compat script)
        if (!firebase.apps.length) {
          this.app = firebase.initializeApp(firebaseConfig);
        } else {
          this.app = firebase.app();
        }
        if (typeof firebase.analytics === 'function') {
          this.analytics = firebase.analytics();
        }
        this.isInitialized = true;
        console.log("🔥 Ophei Ansah Firebase Initialized (Compat Mode)");
      }
    } catch (e) {
      console.warn("Firebase initialization notice:", e.message);
    }
  },

  // Event Logging Helper for Google Analytics
  logEvent(eventName, eventParams = {}) {
    try {
      if (this.analytics && typeof this.analytics.logEvent === 'function') {
        this.analytics.logEvent(eventName, eventParams);
      } else if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
      }
      console.log(`📊 [Analytics Event] ${eventName}:`, eventParams);
    } catch (e) {
      // Fallback safe
    }
  },

  // Specialized Business Events
  trackDutyCalculation(cifUsd, totalDutyGhs, carCategory) {
    this.logEvent('calculate_duty', {
      cif_usd: cifUsd,
      duty_ghs: totalDutyGhs,
      category: carCategory,
      currency: 'GHS'
    });
  },

  trackCarInquiry(carName, cifUsd) {
    this.logEvent('inquire_car_purchase', {
      item_name: carName,
      value: cifUsd,
      currency: 'USD'
    });
  },

  trackRentalQuote(carName, days, totalGhs) {
    this.logEvent('generate_rental_quote', {
      item_name: carName,
      duration_days: days,
      value: totalGhs,
      currency: 'GHS'
    });
  },

  trackPartOrder(partName, priceGhs) {
    this.logEvent('order_spare_part', {
      item_name: partName,
      value: priceGhs,
      currency: 'GHS'
    });
  },

  trackShipmentSearch(trackingId) {
    this.logEvent('search_shipment_tracking', {
      tracking_id: trackingId
    });
  },

  trackWhatsAppContact(contactType, subject) {
    this.logEvent('whatsapp_click', {
      contact_type: contactType,
      subject: subject
    });
  }
};

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.OpheiFirebase.init();
  });
}
