/**
 * OPHEI ANSAH AUTO IMPORTS - MAIN JAVASCRIPT ENGINE
 * Direct Japan & Korea Vehicle Imports, Shipping, Rental, Spare Parts & GRA Duty Estimator
 * WhatsApp Hotline: 0245663155 (+233245663155)
 */

function getLiveExchangeRate() {
  const stored = localStorage.getItem('OA_FX_RATE');
  return stored ? parseFloat(stored) : 15.50;
}

function getLiveCars() {
  const stored = localStorage.getItem('OA_CARS_DATA');
  return stored ? JSON.parse(stored) : PRACTICAL_CARS;
}

function getLiveRentals() {
  const stored = localStorage.getItem('OA_RENTALS_DATA');
  return stored ? JSON.parse(stored) : RENTAL_RATES;
}

function getLiveSpareParts() {
  const stored = localStorage.getItem('OA_PARTS_DATA');
  return stored ? JSON.parse(stored) : SPARE_PARTS;
}

function getLiveShipments() {
  const stored = localStorage.getItem('OA_SHIPMENTS_DATA');
  return stored ? JSON.parse(stored) : SAMPLE_SHIPMENTS;
}

document.addEventListener('DOMContentLoaded', () => {
  const fx = getLiveExchangeRate();
  document.querySelectorAll('.currency-badge').forEach(el => {
    el.textContent = `💱 Reference Rate: $1 ≈ GH₵ ${fx.toFixed(2)}`;
  });

  initDutyEstimator();
  initCarCatalogue();
  initRentalCalculator();
  initSpareParts();
  initTrackingSimulator();
  initNavigation();
  initFloatingWhatsApp();
});

const WHATSAPP_PHONE = '233245663155'; // 0245663155
let EXCHANGE_RATE_USD_GHS = getLiveExchangeRate(); // Current exchange rate synced with admin portal

// ============================================================================
// 1. GHANA CUSTOMS (GRA / ICUMS) DUTY ESTIMATOR ENGINE
// ============================================================================
function initDutyEstimator() {
  const categorySelect = document.getElementById('dutyCategory');
  const yearSelect = document.getElementById('dutyYear');
  const engineSelect = document.getElementById('dutyEngine');
  const cifInput = document.getElementById('dutyCifUsd');
  const cifSlider = document.getElementById('dutyCifSlider');
  const presetChips = document.querySelectorAll('.preset-chip');

  if (!categorySelect || !cifInput) return;

  // Preset quick selections for popular cars in Ghana
  const PRESETS = {
    'corolla': { category: 'saloon', year: 2018, engine: 1800, cif: 4800 },
    'yaris': { category: 'saloon', year: 2018, engine: 1500, cif: 3600 },
    'rav4': { category: 'suv', year: 2019, engine: 2400, cif: 8200 },
    'elantra': { category: 'saloon', year: 2018, engine: 1600, cif: 4400 },
    'crv': { category: 'suv', year: 2018, engine: 2400, cif: 7500 },
    'hilux': { category: 'pickup', year: 2020, engine: 2800, cif: 12500 },
    'prado': { category: 'suv_large', year: 2018, engine: 2700, cif: 18000 },
    'hiace': { category: 'bus', year: 2018, engine: 2700, cif: 11500 },
    'urvan': { category: 'bus', year: 2018, engine: 2500, cif: 10200 }
  };

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const key = chip.getAttribute('data-preset');
      if (PRESETS[key]) {
        const p = PRESETS[key];
        categorySelect.value = p.category;
        yearSelect.value = p.year;
        engineSelect.value = p.engine;
        cifInput.value = p.cif;
        if (cifSlider) cifSlider.value = p.cif;
        calculateDuty();
      }
    });
  });

  // Sync slider and input
  if (cifSlider) {
    cifSlider.addEventListener('input', (e) => {
      cifInput.value = e.target.value;
      calculateDuty();
    });
  }

  cifInput.addEventListener('input', (e) => {
    if (cifSlider) cifSlider.value = e.target.value;
    calculateDuty();
  });

  [categorySelect, yearSelect, engineSelect].forEach(el => {
    el.addEventListener('change', calculateDuty);
  });

  const sendBtn = document.getElementById('btnSendDutyWhatsApp');
  if (sendBtn) {
    sendBtn.addEventListener('click', sendDutyToWhatsApp);
  }

  // Check URL query param for car preloading across standalone pages
  const urlParams = new URLSearchParams(window.location.search);
  const carParam = urlParams.get('car');
  if (carParam && typeof window.loadCarToEstimator === 'function') {
    window.loadCarToEstimator(carParam);
  } else {
    calculateDuty();
  }
}

function calculateDuty() {
  const category = document.getElementById('dutyCategory').value;
  const year = parseInt(document.getElementById('dutyYear').value, 10);
  const engineCc = parseInt(document.getElementById('dutyEngine').value, 10);
  const cifUsd = parseFloat(document.getElementById('dutyCifUsd').value) || 0;

  const currentYear = 2026;
  const age = Math.max(0, currentYear - year);

  const cifGhs = cifUsd * EXCHANGE_RATE_USD_GHS;

  // 1. Import Duty Rate (Ghana Customs Standards)
  // <= 1500cc: 10%
  // > 1500cc: 20%
  // Commercial Pickup: 5% - 10%
  let importDutyRate = 0.20;
  if (category === 'pickup') {
    importDutyRate = 0.10;
  } else if (engineCc <= 1500) {
    importDutyRate = 0.10;
  }

  const importDuty = cifGhs * importDutyRate;

  // 2. Over-age Penalty (GRA Vehicle Over-aged Penalty Table)
  // 0 - 10 years: 0%
  // 10 - 12 years: 5% of CIF
  // 12 - 15 years: 20% of CIF
  // > 15 years: 50% of CIF
  let overageRate = 0;
  let overageLabel = 'None (0 - 10 yrs)';
  if (age > 15) {
    overageRate = 0.50;
    overageLabel = 'High Over-Age Penalty (50% of CIF)';
  } else if (age > 12) {
    overageRate = 0.20;
    overageLabel = 'Over-Age Penalty (20% of CIF)';
  } else if (age > 10) {
    overageRate = 0.05;
    overageLabel = 'Over-Age Penalty (5% of CIF)';
  }

  const overagePenalty = cifGhs * overageRate;

  // 3. Levies (calculated on CIF)
  const nhil = cifGhs * 0.025; // NHIL 2.5%
  const getFund = cifGhs * 0.025; // GETFund 2.5%
  const covidLevy = cifGhs * 0.01; // COVID-19 Health Levy 1.0%
  const sil = cifGhs * 0.02; // Special Import Levy 2.0%
  const ecowasLevy = cifGhs * 0.005; // ECOWAS Levy 0.5%
  const eximLevy = cifGhs * 0.0075; // EXIM Levy 0.75%
  const processingFee = 850; // Fixed ICUMS / GCNET processing fee in GHS

  // 4. Import VAT (15% standard Ghana VAT on taxable base: CIF + Duty + NHIL + GETFund)
  const vatTaxableBase = cifGhs + importDuty + nhil + getFund;
  const importVat = vatTaxableBase * 0.15;

  // Total Customs Duty & Statutory Taxes Payable to GRA
  const totalCustomsDutyGhs = importDuty + importVat + nhil + getFund + covidLevy + sil + ecowasLevy + eximLevy + processingFee + overagePenalty;
  const totalCustomsDutyUsd = totalCustomsDutyGhs / EXCHANGE_RATE_USD_GHS;

  // Update DOM elements
  const formatGhs = (val) => 'GH₵ ' + Math.round(val).toLocaleString();
  const formatUsd = (val) => '$ ' + Math.round(val).toLocaleString();

  document.getElementById('dutyTotalGhs').textContent = formatGhs(totalCustomsDutyGhs);
  document.getElementById('dutyTotalUsd').textContent = `≈ ${formatUsd(totalCustomsDutyUsd)} USD`;

  document.getElementById('valImportDuty').textContent = `${formatGhs(importDuty)} (${Math.round(importDutyRate * 100)}%)`;
  document.getElementById('valImportVat').textContent = formatGhs(importVat);
  document.getElementById('valNhilGetfund').textContent = formatGhs(nhil + getFund);
  document.getElementById('valSilEcowas').textContent = formatGhs(sil + ecowasLevy + eximLevy + covidLevy);
  document.getElementById('valProcessingFee').textContent = formatGhs(processingFee);

  const overageEl = document.getElementById('rowOverage');
  const overageBadge = document.getElementById('overageBadge');
  if (overageRate > 0) {
    overageEl.style.display = 'flex';
    document.getElementById('valOveragePenalty').textContent = formatGhs(overagePenalty);
    if (overageBadge) {
      overageBadge.style.display = 'inline-block';
      overageBadge.textContent = `${age} Yrs Old: +${Math.round(overageRate * 100)}% Penalty`;
    }
  } else {
    overageEl.style.display = 'none';
    if (overageBadge) overageBadge.style.display = 'none';
  }

  // Store calculated data on window for WhatsApp payload
  window.lastDutyEstimate = {
    category,
    year,
    age,
    engineCc,
    cifUsd,
    cifGhs,
    totalGhs: totalCustomsDutyGhs,
    totalUsd: totalCustomsDutyUsd,
    dutyRate: Math.round(importDutyRate * 100),
    overagePenalty: overagePenalty
  };
}

function sendDutyToWhatsApp() {
  const d = window.lastDutyEstimate;
  if (!d) return;

  if (window.OpheiFirebase?.trackDutyCalculation) {
    window.OpheiFirebase.trackDutyCalculation(d.cifUsd, d.totalGhs, d.category);
    window.OpheiFirebase.trackWhatsAppContact('Duty Assessment Quote', `${d.category.toUpperCase()} (${d.year})`);
  }

  const msg = `Hello Ophei Ansah Auto Imports!%0A%0AI used your website Duty Cost Estimator for my vehicle import:%0A%0A` +
    `🚗 *Vehicle Category:* ${d.category.toUpperCase()}%0A` +
    `📅 *Year:* ${d.year} (${d.age} yrs old)%0A` +
    `⚡ *Engine Capacity:* ${d.engineCc} cc%0A` +
    `💵 *CIF Value:* $${d.cifUsd.toLocaleString()} USD (approx GH₵ ${Math.round(d.cifGhs).toLocaleString()})%0A` +
    `📊 *Estimated GRA Duty:* *GH₵ ${Math.round(d.totalGhs).toLocaleString()}* (≈ $${Math.round(d.totalUsd).toLocaleString()})%0A%0A` +
    `Please confirm the exact ICUMS assessment and let me know your clearing procedure at Tema Port. Thank you!`;

  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`, '_blank');
}

// ============================================================================
// 2. PRACTICAL CARS CATALOGUE (REAL CARS DRIVEN IN GHANA)
// ============================================================================
const PRACTICAL_CARS = [
  {
    id: 'corolla-2019',
    name: '2019 Toyota Corolla LE',
    tagline: "Ghana's #1 Daily Driver — Unmatched Fuel Efficiency & Resale",
    type: 'sedan',
    image: 'assets/images/toyota_corolla.jpg',
    specs: {
      engine: '1.8L 4-Cylinder VVTi',
      transmission: 'CVT Automatic',
      mileage: '48,200 km',
      fuel: 'Petrol (Clean Fuel Economy)',
      grade: 'Auction Grade 4.5',
      origin: 'Japan (USS Tokyo Auction)'
    },
    cifUsd: 5400,
    dutyEstGhs: 36500,
    totalEstGhs: 120200
  },
  {
    id: 'rav4-2019',
    name: '2019 Toyota RAV4 XLE AWD',
    tagline: 'Top Compact SUV in Accra — Handles Ghanaian Roads with Ease',
    type: 'suv',
    image: 'assets/images/toyota_rav4.jpg',
    specs: {
      engine: '2.5L Dynamic Force Dual VVTi',
      transmission: '8-Speed Direct-Shift Auto',
      mileage: '52,100 km',
      fuel: 'Petrol AWD',
      grade: 'Auction Grade 4.5',
      origin: 'Japan (TAA Yokohama)'
    },
    cifUsd: 8900,
    dutyEstGhs: 58000,
    totalEstGhs: 195950
  },
  {
    id: 'elantra-2018',
    name: '2018 Hyundai Elantra SE',
    tagline: 'Sleek, Modern Executive Saloon with Low Maintenance Cost',
    type: 'sedan',
    image: 'assets/images/hyundai_elantra.jpg',
    specs: {
      engine: '2.0L Nu MPI Engine',
      transmission: '6-Speed Shiftronic Auto',
      mileage: '58,400 km',
      fuel: 'Petrol',
      grade: 'Auction Grade 4.0',
      origin: 'Korea (Encar Verified)'
    },
    cifUsd: 4600,
    dutyEstGhs: 31800,
    totalEstGhs: 103100
  },
  {
    id: 'yaris-2018',
    name: '2018 Toyota Yaris / Vitz',
    tagline: 'Ultimate Fuel Economy & City Runabout — High Demand Ride-Hailing',
    type: 'hatchback',
    image: 'assets/images/toyota_yaris.jpg',
    specs: {
      engine: '1.3L / 1.5L 1NZ Engine',
      transmission: 'Automatic Super CVT-i',
      mileage: '41,000 km',
      fuel: 'Petrol (Super Economical)',
      grade: 'Auction Grade 4.5',
      origin: 'Japan (Nagoya Auction)'
    },
    cifUsd: 3800,
    dutyEstGhs: 22800,
    totalEstGhs: 81700
  },
  {
    id: 'crv-2018',
    name: '2018 Honda CR-V EX-L',
    tagline: 'Spacious Family Crossover — Luxurious Comfort & Rugged Suspension',
    type: 'suv',
    image: 'assets/images/honda_crv.jpg',
    specs: {
      engine: '1.5L Turbo / 2.4L i-VTEC',
      transmission: 'Automatic CVT AWD',
      mileage: '54,600 km',
      fuel: 'Petrol AWD',
      grade: 'Auction Grade 4.5',
      origin: 'Japan (USS Kobe)'
    },
    cifUsd: 8200,
    dutyEstGhs: 53500,
    totalEstGhs: 180600
  },
  {
    id: 'camry-2019',
    name: '2019 Toyota Camry SE',
    tagline: 'Executive Prestige Saloon — Superior Comfort & Reliability',
    type: 'sedan',
    image: 'assets/images/toyota_camry.jpg',
    specs: {
      engine: '2.5L 4-Cylinder DOHC VVTi',
      transmission: '8-Speed Automatic',
      mileage: '49,800 km',
      fuel: 'Petrol',
      grade: 'Auction Grade 4.5',
      origin: 'Japan (Aucnet Japan)'
    },
    cifUsd: 7900,
    dutyEstGhs: 51800,
    totalEstGhs: 174250
  },
  {
    id: 'hilux-2020',
    name: '2020 Toyota Hilux Double Cabin 4x4',
    tagline: 'King of Ghana Utility & Projects — Built for Rough Terrain & Sites',
    type: 'pickup',
    image: 'assets/images/toyota_hilux.jpg',
    specs: {
      engine: '2.4L / 2.8L D-4D Turbo Diesel',
      transmission: '6-Speed 4x4 High/Low',
      mileage: '64,000 km',
      fuel: 'Diesel Heavy Duty',
      grade: 'Auction Grade 4.0',
      origin: 'Japan (Kobe Port Direct)'
    },
    cifUsd: 13500,
    dutyEstGhs: 64200,
    totalEstGhs: 273450
  },
  {
    id: 'prado-2018',
    name: '2018 Toyota Land Cruiser Prado TX-L',
    tagline: 'High Executive & Chieftaincy Favorite — Unrivaled Presence & Durability',
    type: 'suv',
    image: 'assets/images/toyota_prado.jpg',
    specs: {
      engine: '2.7L Dual VVTi / 2.8L D-4D',
      transmission: '6-Speed Super ECT 4WD',
      mileage: '68,500 km',
      fuel: 'Petrol / Diesel',
      grade: 'Auction Grade 4.5',
      origin: 'Japan (Yokohama Export)'
    },
    cifUsd: 19500,
    dutyEstGhs: 118000,
    totalEstGhs: 420250
  },
  {
    id: 'picanto-2018',
    name: '2018 Kia Picanto / Morning',
    tagline: 'Most Affordable City Cruiser — Extremely Low Fuel & Part Replacement',
    type: 'hatchback',
    image: 'assets/images/kia_picanto.jpg',
    specs: {
      engine: '1.0L / 1.2L Kappa MPI',
      transmission: 'Automatic 4-Speed',
      mileage: '37,800 km',
      fuel: 'Petrol (Ultra Economy)',
      grade: 'Auction Grade 4.0',
      origin: 'Korea (Incheon Port)'
    },
    cifUsd: 3200,
    dutyEstGhs: 19800,
    totalEstGhs: 69400
  },
  {
    id: 'hiace-2018',
    name: '2018 Toyota Hiace Commuter / DX Bus',
    tagline: "Ghana's Commercial Transportation Workhorse — High Profit Trotros & Tour Fleets",
    type: 'van',
    image: 'assets/images/toyota_hiace.jpg',
    specs: {
      engine: '2.7L Petrol / 3.0L 1KD Diesel',
      transmission: '5-Speed Manual / Auto',
      mileage: '62,400 km',
      fuel: 'Petrol / Diesel (15-Seater)',
      grade: 'Auction Grade 4.0',
      origin: 'Japan (USS Tokyo)'
    },
    cifUsd: 11500,
    dutyEstGhs: 54000,
    totalEstGhs: 232250
  },
  {
    id: 'urvan-2018',
    name: '2018 Nissan NV350 Caravan / Urvan',
    tagline: 'Reliable High-Roof Commercial Van for Passenger & Heavy Cargo Haulage',
    type: 'van',
    image: 'assets/images/nissan_urvan.jpg',
    specs: {
      engine: '2.5L QR25DE Petrol / YD25 Diesel',
      transmission: 'Automatic 5-Speed',
      mileage: '58,900 km',
      fuel: 'Diesel / Petrol (15-Seater)',
      grade: 'Auction Grade 4.0',
      origin: 'Japan (Yokohama Auction)'
    },
    cifUsd: 10200,
    dutyEstGhs: 49500,
    totalEstGhs: 207600
  }
];

function initCarCatalogue() {
  const container = document.getElementById('carsGrid');
  const filterBtns = document.querySelectorAll('.car-filter-btn');

  if (!container) return;

  function renderCars(filter = 'all') {
    container.innerHTML = '';
    const activeCars = getLiveCars();
    const filtered = filter === 'all' ? activeCars : activeCars.filter(c => c.type === filter);

    filtered.forEach(car => {
      const card = document.createElement('div');
      card.className = 'car-card';
      card.innerHTML = `
        <div class="car-image-box">
          <img src="${car.image}" alt="${car.name}" loading="lazy" onerror="this.src='logo.png'">
          <div class="car-badges-top">
            <span class="badge-pill japan">${(car.specs?.origin || 'Japan').split(' ')[0]}</span>
            <span class="badge-pill grade">${car.specs?.grade || 'Grade 4.5'}</span>
          </div>
        </div>
        <div class="car-details">
          <div class="car-title-wrap">
            <h3 class="car-title">${car.name}</h3>
            <p class="car-subtitle">${car.tagline || ''}</p>
          </div>
          <div class="car-specs-grid">
            <div class="spec-item"><span>⚡</span> <span>${car.specs?.engine || 'Engine'}</span></div>
            <div class="spec-item"><span>🕹️</span> <span>${car.specs?.transmission || 'Auto'}</span></div>
            <div class="spec-item"><span>🛣️</span> <span>${car.specs?.mileage || 'Low km'}</span></div>
            <div class="spec-item"><span>⛽</span> <span>${car.specs?.fuel || 'Petrol'}</span></div>
          </div>
          <div class="car-price-block">
            <div class="price-row">
              <span class="price-label">CIF Tema Port Price:</span>
              <span class="price-value-cif">$${car.cifUsd.toLocaleString()} USD</span>
            </div>
            <div class="price-row-est">
              <span>Estimated Duty: GH₵ ${(car.dutyEstGhs || 0).toLocaleString()}</span>
              <span>Total: GH₵ ${(car.totalEstGhs || (car.cifUsd * getLiveExchangeRate() + (car.dutyEstGhs || 0))).toLocaleString()}</span>
            </div>
          </div>
          <div class="car-card-actions">
            <a href="https://wa.me/${WHATSAPP_PHONE}?text=Hello%20Ophei%20Ansah%20Auto%20Imports!%20I%20am%20interested%20in%20buying/importing%20the%20${encodeURIComponent(car.name)}%20(CIF%20Tema%20Port%20$${car.cifUsd.toLocaleString()}).%20Please%20provide%20more%20details%20and%20pictures." target="_blank" class="btn-card-whatsapp">
              <span>💬</span> Inquire on WhatsApp
            </a>
            <button type="button" class="btn-card-calc" onclick="loadCarToEstimator('${car.id}')">
              <span>🧮</span> Calc Duty
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCars(btn.getAttribute('data-filter'));
    });
  });

  renderCars('all');
}

window.loadCarToEstimator = function(carId) {
  const targetSec = document.getElementById('duty-estimator');
  if (!targetSec) {
    window.location.href = `duty-estimator.php?car=${encodeURIComponent(carId)}`;
    return;
  }

  const activeCars = getLiveCars();
  const car = activeCars.find(c => c.id === carId) || PRACTICAL_CARS.find(c => c.id === carId);
  if (!car) return;

  const catMap = {
    'sedan': 'saloon',
    'hatchback': 'saloon',
    'suv': 'suv',
    'pickup': 'pickup',
    'van': 'bus'
  };

  const categorySelect = document.getElementById('dutyCategory');
  const yearSelect = document.getElementById('dutyYear');
  const engineSelect = document.getElementById('dutyEngine');
  const cifInput = document.getElementById('dutyCifUsd');
  const cifSlider = document.getElementById('dutyCifSlider');

  if (categorySelect && cifInput) {
    categorySelect.value = catMap[car.type] || 'saloon';
    // Extract year from name (e.g. 2019 Toyota)
    const matchYear = car.name.match(/\d{4}/);
    if (matchYear && yearSelect) yearSelect.value = matchYear[0];
    
    // Extract engine cc approximately
    if (engineSelect) {
      if (car.specs.engine.includes('1.3L') || car.specs.engine.includes('1.0L') || car.specs.engine.includes('1.5L')) {
        engineSelect.value = '1500';
      } else if (car.specs.engine.includes('1.8L') || car.specs.engine.includes('2.0L')) {
        engineSelect.value = '1800';
      } else if (car.specs.engine.includes('2.4L') || car.specs.engine.includes('2.5L')) {
        engineSelect.value = '2400';
      } else if (car.specs.engine.includes('2.7L') || car.specs.engine.includes('2.8L') || car.specs.engine.includes('3.0L')) {
        engineSelect.value = '2800';
      }
    }

    cifInput.value = car.cifUsd;
    if (cifSlider) cifSlider.value = car.cifUsd;

    calculateDuty();

    // Scroll smoothly to estimator
    targetSec.scrollIntoView({ behavior: 'smooth' });
  }
};

// ============================================================================
// 3. RENTAL & CAR HIRING FLEET WITH LIVE BOOKING ESTIMATOR
// ============================================================================
const RENTAL_RATES = {
  'yaris': { name: 'Toyota Yaris / Vitz (Hatchback)', dailyRate: 350 },
  'corolla': { name: 'Toyota Corolla (Saloon)', dailyRate: 450 },
  'elantra': { name: 'Hyundai Elantra (Saloon)', dailyRate: 450 },
  'rav4': { name: 'Toyota RAV4 / Honda CR-V (SUV)', dailyRate: 700 },
  'hilux': { name: 'Toyota Hilux Double Cabin 4x4', dailyRate: 1200 },
  'prado': { name: 'Toyota Prado TX-L 4x4 (Executive)', dailyRate: 1800 },
  'hiace': { name: 'Toyota Hiace Bus (15-Seater Commercial/Tour)', dailyRate: 1100 },
  'urvan': { name: 'Nissan Urvan Caravan (15-Seater Van)', dailyRate: 1000 }
};

function initRentalCalculator() {
  const carSelect = document.getElementById('rentalCarSelect');
  const daysInput = document.getElementById('rentalDays');
  const driverSelect = document.getElementById('rentalDriverOption');
  const totalDisplay = document.getElementById('rentalTotalDisplay');
  const bookBtn = document.getElementById('btnBookRentalWhatsApp');

  if (!carSelect || !daysInput || !totalDisplay) return;

  function updateRentalTotal() {
    const carKey = carSelect.value;
    const days = Math.max(1, parseInt(daysInput.value, 10) || 1);
    const withDriver = driverSelect.value === 'with_driver';
    const liveRentals = getLiveRentals();

    const baseRate = (liveRentals[carKey]?.dailyRate) || RENTAL_RATES[carKey]?.dailyRate || 450;
    const driverFeePerDay = withDriver ? 100 : 0; // GH₵ 100 per day for professional driver
    const totalGhs = (baseRate + driverFeePerDay) * days;

    totalDisplay.textContent = `GH₵ ${totalGhs.toLocaleString()}`;

    // Update book button payload
    if (bookBtn) {
      bookBtn.onclick = () => {
        const carName = (liveRentals[carKey]?.name) || RENTAL_RATES[carKey]?.name || 'Vehicle';
        const driverText = withDriver ? 'With Professional Driver (+GH₵ 100/day)' : 'Self-Drive';
        const msg = `Hello Ophei Ansah Auto Imports!%0A%0AI want to book a car rental in Ghana:%0A%0A` +
          `🚙 *Vehicle:* ${carName}%0A` +
          `⏱️ *Duration:* ${days} Day(s)%0A` +
          `👤 *Option:* ${driverText}%0A` +
          `💰 *Estimated Total:* GH₵ ${totalGhs.toLocaleString()}%0A%0A` +
          `Please confirm availability and pickup location (Accra / Airport / Kumasi). Thank you!`;
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`, '_blank');
      };
    }
  }

  carSelect.addEventListener('change', updateRentalTotal);
  daysInput.addEventListener('input', updateRentalTotal);
  driverSelect.addEventListener('change', updateRentalTotal);

  updateRentalTotal();
}

// ============================================================================
// 4. GENUINE JAPAN & KOREA SPARE PARTS CATALOGUE
// ============================================================================
const SPARE_PARTS = [
  {
    id: 'part-1',
    name: 'Toyota 1NZ-FE 1.5L VVTi Complete Engine',
    category: 'engine',
    priceGhs: 8500,
    fits: 'Fits Toyota Corolla, Yaris, Vitz, Probox, Platz, Premio (Direct Japan)',
    image: 'assets/images/engine_japanese.jpg',
    origin: 'Japan (Grade A Low Mileage)'
  },
  {
    id: 'part-2',
    name: 'Toyota 2ZR-FE 1.8L Dual VVTi Engine',
    category: 'engine',
    priceGhs: 11000,
    fits: 'Fits Toyota Corolla 2014-2020, Allion, Auris, Matrix (JDM Pullout)',
    image: 'assets/images/engine_japanese.jpg',
    origin: 'Japan Tested Unit'
  },
  {
    id: 'part-3',
    name: 'Japanese Automatic & CVT Transmission Gearbox',
    category: 'transmission',
    priceGhs: 6800,
    fits: 'For Toyota Corolla, Camry, RAV4, Honda Civic & CR-V (Includes Converter)',
    image: 'assets/images/gearbox_transmission.jpg',
    origin: 'Japan Clean Shift Tested'
  },
  {
    id: 'part-4',
    name: 'Heavy Duty Front & Rear Shock Absorbers (Pair)',
    category: 'suspension',
    priceGhs: 2200,
    fits: 'Reinforced for Ghana roads. Fits Toyota RAV4, Corolla, Camry, Hyundai Elantra',
    image: 'assets/images/suspension_shocks.jpg',
    origin: 'OEM Japanese KYB Spec'
  },
  {
    id: 'part-5',
    name: 'Ventilated Brake Rotors & Ceramic Brake Pads Set',
    category: 'brakes',
    priceGhs: 1450,
    fits: 'High heat-resistance for Accra traffic. Fits Toyota, Honda, Hyundai, Kia',
    image: 'assets/images/brakes_rotors.jpg',
    origin: 'Brand New Import'
  },
  {
    id: 'part-6',
    name: 'OEM Projector LED Headlight Assembly Pair',
    category: 'electrical',
    priceGhs: 2800,
    fits: 'Ultra clear crystal lens. Fits Toyota Corolla 2017-2020, RAV4, Camry',
    image: 'assets/images/headlights_assembly.jpg',
    origin: 'Direct Japan Genuine'
  },
  {
    id: 'part-7',
    name: 'High-Output 12V Alternator & Heavy Duty Starter',
    category: 'electrical',
    priceGhs: 1650,
    fits: 'Denso Japanese OEM. Fits Toyota Corolla, Yaris, RAV4, Honda CR-V',
    image: 'assets/images/alternator_parts.jpg',
    origin: 'Factory Tested 12V 90A'
  },
  {
    id: 'part-8',
    name: 'Original 16" / 17" Japanese Alloy Wheel Rim Set (4)',
    category: 'wheels',
    priceGhs: 3900,
    fits: '5-Lug PCD 114.3 / 100. Pristine condition, fits Toyota, Honda, Hyundai',
    image: 'assets/images/alloy_wheels.jpg',
    origin: 'Yokohama Imported Rims'
  },
  {
    id: 'part-9',
    name: 'Heavy Duty Aluminum Engine Radiator & Electric Cooling Fan Assembly',
    category: 'cooling',
    priceGhs: 1850,
    fits: 'Direct fit for Toyota Corolla, RAV4, Camry, Honda CR-V (Direct Japan)',
    image: 'assets/images/radiator_part.jpg',
    origin: 'Denso OEM Tested'
  }
];

function initSpareParts() {
  const container = document.getElementById('partsGrid');
  const filterBtns = document.querySelectorAll('.part-filter-btn');

  if (!container) return;

  function renderParts(filter = 'all') {
    container.innerHTML = '';
    const activeParts = getLiveSpareParts();
    const filtered = filter === 'all' ? activeParts : activeParts.filter(p => p.category === filter);

    filtered.forEach(part => {
      const card = document.createElement('div');
      card.className = 'part-card';
      card.innerHTML = `
        <div class="part-image-box">
          <img src="${part.image}" alt="${part.name}" loading="lazy" onerror="this.src='logo.png'">
          <span class="part-origin-badge">${part.origin}</span>
        </div>
        <div class="part-body">
          <span class="part-category">${part.category.toUpperCase()}</span>
          <h4 class="part-title">${part.name}</h4>
          <p class="part-fits">${part.fits}</p>
          <div class="part-price-action">
            <span class="part-price">GH₵ ${part.priceGhs.toLocaleString()}</span>
            <a href="https://wa.me/${WHATSAPP_PHONE}?text=Hello%20Ophei%20Ansah%20Auto%20Imports!%20I%20want%20to%20order/inquire%20about%20the%20spare%20part:%20*${encodeURIComponent(part.name)}*%20(Price:%20GH₵%20${part.priceGhs.toLocaleString()}).%20Please%20confirm%20availability." target="_blank" class="btn-part-order">
              <span>💬</span> Order via WhatsApp
            </a>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderParts(btn.getAttribute('data-filter'));
    });
  });

  renderParts('all');
}

// ============================================================================
// 5. LIVE CONTAINER & SHIPMENT TRACKING SIMULATOR
// ============================================================================
const SAMPLE_SHIPMENTS = {
  'OA-7829-GH': {
    id: 'OA-7829-GH',
    vin: '2T3C1RFV2MC891044',
    vehicle: '2019 Toyota RAV4 XLE AWD (Magnetic Gray)',
    origin: 'Yokohama Port (Japan)',
    destination: 'Port of Tema (Ghana - MPS Terminal 3)',
    vessel: 'MSC AURELIA V.049W',
    container: 'MSCU-9910482-40HC',
    eta: 'September 24, 2026',
    stageIndex: 3, // 1: Booked, 2: Customs Japan, 3: Ocean Transit, 4: Port Tema Berthing, 5: ICUMS Cleared
    statusNote: 'Vessel in Ocean Transit (Mid-Atlantic Heading to Gulf of Guinea)',
    lastUpdate: 'Sep 09, 2026, 14:30 GMT - Cruising Speed 18.2 knots on schedule'
  },
  'OA-4412-JP': {
    id: 'OA-4412-JP',
    vin: '2T1BURHE8LC448102',
    vehicle: '2019 Toyota Corolla LE (Super White)',
    origin: 'Nagoya Port (Japan)',
    destination: 'Port of Tema (Golden Jubilee Terminal)',
    vessel: 'MAERSK TEMA EXPRESS',
    container: 'MRKU-7419023-40HC',
    eta: 'September 12, 2026',
    stageIndex: 4,
    statusNote: 'Arrived at Tema Port - Container Discharged, ICUMS Clearing Underway',
    lastUpdate: 'Sep 10, 2026, 09:15 GMT - Physical Joint Customs Inspection Scheduled'
  },
  'OA-9103-KR': {
    id: 'OA-9103-KR',
    vin: 'KMHL34JA5JU109823',
    vehicle: '2018 Hyundai Elantra SE (Sleek Silver)',
    origin: 'Busan Port (South Korea)',
    destination: 'Port of Tema (Ghana)',
    vessel: 'CMA CGM AFRICA ONE',
    container: 'CMAU-6523910-40HC',
    eta: 'October 02, 2026',
    stageIndex: 2,
    statusNote: 'Export Customs Cleared at Busan Port — Loaded Onboard Container Carrier',
    lastUpdate: 'Sep 06, 2026, 18:00 KST - Bill of Lading & JEVIC Radiation Inspection Passed'
  }
};

function initTrackingSimulator() {
  const input = document.getElementById('trackingInput');
  const btn = document.getElementById('btnTrackSubmit');
  const resultBox = document.getElementById('trackingResultBox');

  if (!input || !btn || !resultBox) return;

  function doTrack(code) {
    const cleaned = (code || input.value).trim().toUpperCase();
    if (!cleaned) return;

    const liveShipments = getLiveShipments();
    let data = liveShipments[cleaned] || SAMPLE_SHIPMENTS[cleaned];
    if (!data) {
      // Generate realistic active tracking for any entered VIN or custom code
      data = {
        id: cleaned,
        vin: cleaned.length >= 17 ? cleaned : 'JN1AZ4EH9KM' + Math.floor(100000 + Math.random() * 900000),
        vehicle: 'Client Vehicle Import (Japan / Korea Auction Certified)',
        origin: 'Yokohama Port (Japan)',
        destination: 'Port of Tema (Ghana)',
        vessel: 'HAPAG-LLOYD GHANA EXPRESS',
        container: 'HLXU-' + Math.floor(1000000 + Math.random() * 9000000) + '-40HC',
        eta: 'Within 18-24 Days',
        stageIndex: 3,
        statusNote: 'Vessel In Ocean Transit to Port of Tema — On Schedule',
        lastUpdate: 'Updated Today: Bill of Lading & Inspection Validated'
      };
    }

    renderTrackingResult(data);
  }

  function renderTrackingResult(d) {
    const stages = [
      { name: 'Yard & Inspection', sub: 'Japan/Korea' },
      { name: 'Export Customs', sub: 'Container Loaded' },
      { name: 'Ocean Transit', sub: 'En Route to Ghana' },
      { name: 'Tema Port Berth', sub: 'MPS Terminal' },
      { name: 'ICUMS Cleared', sub: 'Handover Ready' }
    ];

    let stagesHtml = '';
    stages.forEach((st, idx) => {
      const stepNum = idx + 1;
      let stateClass = '';
      if (stepNum < d.stageIndex) stateClass = 'completed';
      else if (stepNum === d.stageIndex) stateClass = 'active';

      stagesHtml += `
        <div class="stage-item ${stateClass}">
          <div class="stage-dot">${stepNum < d.stageIndex ? '✓' : stepNum}</div>
          <h5>${st.name}</h5>
          <span>${st.sub}</span>
        </div>
      `;
    });

    resultBox.innerHTML = `
      <div class="tracking-meta-header">
        <div>
          <h4>Tracking ID: <span style="color: var(--gold-light);">${d.id}</span></h4>
          <p style="color: #CBD5E1; font-size: 0.9rem; margin-top: 0.2rem;">${d.vehicle} | VIN: ${d.vin}</p>
        </div>
        <div>
          <span class="tracking-status-badge">● ${d.statusNote}</span>
        </div>
      </div>

      <div class="timeline-stages">
        ${stagesHtml}
      </div>

      <div style="background: rgba(0,0,0,0.25); border-radius: var(--radius-md); padding: 1.25rem; font-size: 0.85rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div><strong style="color: var(--gold-light);">Vessel:</strong> ${d.vessel}</div>
        <div><strong style="color: var(--gold-light);">Container #:</strong> ${d.container}</div>
        <div><strong style="color: var(--gold-light);">Origin:</strong> ${d.origin}</div>
        <div><strong style="color: var(--gold-light);">Destination:</strong> ${d.destination}</div>
        <div><strong style="color: var(--gold-light);">Estimated Arrival (ETA):</strong> ${d.eta}</div>
        <div><strong style="color: var(--gold-light);">Latest Position:</strong> ${d.lastUpdate}</div>
      </div>

      <div style="margin-top: 1.25rem; text-align: right;">
        <a href="https://wa.me/${WHATSAPP_PHONE}?text=Hello%20Ophei%20Ansah%20Auto%20Imports!%20I%20am%20tracking%20shipment%20*${d.id}*%20(${encodeURIComponent(d.vehicle)}).%20Please%20provide%20the%20latest%20clearing%20update." target="_blank" class="btn-primary-gold" style="font-size: 0.85rem; padding: 0.55rem 1.2rem;">
          <span>💬</span> WhatsApp Agent Regarding Shipment
        </a>
      </div>
    `;

    resultBox.style.display = 'block';
  }

  btn.addEventListener('click', () => doTrack());
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') doTrack();
  });

  // Sample track helper
  window.setSampleTrack = function(code) {
    input.value = code;
    doTrack(code);
  };
}

// ============================================================================
// 6. NAVIGATION & MOBILE MENU
// ============================================================================
function initNavigation() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

// ============================================================================
// 7. FLOATING WHATSAPP DRAWER
// ============================================================================
function initFloatingWhatsApp() {
  const trigger = document.getElementById('floatingWhatsappTrigger');
  const drawer = document.getElementById('whatsappDrawer');
  const closeBtn = document.getElementById('whatsappDrawerClose');

  if (trigger && drawer) {
    trigger.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        drawer.classList.remove('open');
      });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!drawer.contains(e.target) && !trigger.contains(e.target)) {
        drawer.classList.remove('open');
      }
    });
  }
}
