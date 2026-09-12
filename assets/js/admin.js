/**
 * OPHEI ANSAH AUTO IMPORTS - EXECUTIVE ADMIN PORTAL CONTROLLER
 * Full Management Engine for Cars Inventory, Live Shipments, Rentals, Spare Parts, Duty FX & Leads
 */

// Default Seed Data
const DEFAULT_CARS = [
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
    totalEstGhs: 120200,
    status: 'available'
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
    totalEstGhs: 195950,
    status: 'available'
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
    totalEstGhs: 103100,
    status: 'available'
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
    totalEstGhs: 81700,
    status: 'transit'
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
    totalEstGhs: 180600,
    status: 'available'
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
    totalEstGhs: 174250,
    status: 'available'
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
    totalEstGhs: 273450,
    status: 'available'
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
    totalEstGhs: 420250,
    status: 'available'
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
    totalEstGhs: 69400,
    status: 'sold'
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
    totalEstGhs: 232250,
    status: 'available'
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
    totalEstGhs: 207600,
    status: 'available'
  }
];

const DEFAULT_SHIPMENTS = {
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

const DEFAULT_RENTALS = {
  'yaris': { id: 'yaris', name: 'Toyota Yaris / Vitz (Hatchback)', dailyRate: 350, category: 'Economy', status: 'Available', fleetCount: 4 },
  'corolla': { id: 'corolla', name: 'Toyota Corolla (Saloon)', dailyRate: 450, category: 'Saloon', status: 'Available', fleetCount: 6 },
  'elantra': { id: 'elantra', name: 'Hyundai Elantra (Saloon)', dailyRate: 450, category: 'Saloon', status: 'Available', fleetCount: 3 },
  'rav4': { id: 'rav4', name: 'Toyota RAV4 / Honda CR-V (SUV)', dailyRate: 700, category: 'SUV', status: 'Available', fleetCount: 5 },
  'hilux': { id: 'hilux', name: 'Toyota Hilux Double Cabin 4x4', dailyRate: 1200, category: 'Pickup', status: 'Available', fleetCount: 3 },
  'prado': { id: 'prado', name: 'Toyota Prado TX-L 4x4 (Executive)', dailyRate: 1800, category: 'Luxury SUV', status: 'Available', fleetCount: 2 },
  'hiace': { id: 'hiace', name: 'Toyota Hiace Bus (15-Seater)', dailyRate: 1100, category: 'Commercial Bus', status: 'Available', fleetCount: 4 },
  'urvan': { id: 'urvan', name: 'Nissan Urvan Caravan (15-Seater)', dailyRate: 1000, category: 'Commercial Van', status: 'Available', fleetCount: 2 }
};

const DEFAULT_PARTS = [
  {
    id: 'part-1',
    name: 'Toyota 1NZ-FE 1.5L VVTi Complete Engine',
    category: 'engine',
    priceGhs: 8500,
    fits: 'Fits Toyota Corolla, Yaris, Vitz, Probox, Platz, Premio (Direct Japan)',
    image: 'assets/images/engine_japanese.jpg',
    origin: 'Japan (Grade A Low Mileage)',
    stock: 5
  },
  {
    id: 'part-2',
    name: 'Toyota 2ZR-FE 1.8L Dual VVTi Engine',
    category: 'engine',
    priceGhs: 11000,
    fits: 'Fits Toyota Corolla 2014-2020, Allion, Auris, Matrix (JDM Pullout)',
    image: 'assets/images/engine_japanese.jpg',
    origin: 'Japan Tested Unit',
    stock: 3
  },
  {
    id: 'part-3',
    name: 'Japanese Automatic & CVT Transmission Gearbox',
    category: 'transmission',
    priceGhs: 6800,
    fits: 'For Toyota Corolla, Camry, RAV4, Honda Civic & CR-V (Includes Converter)',
    image: 'assets/images/gearbox_transmission.jpg',
    origin: 'Japan Clean Shift Tested',
    stock: 4
  },
  {
    id: 'part-4',
    name: 'Heavy Duty Front & Rear Shock Absorbers (Pair)',
    category: 'suspension',
    priceGhs: 2200,
    fits: 'Reinforced for Ghana roads. Fits Toyota RAV4, Corolla, Camry, Hyundai Elantra',
    image: 'assets/images/suspension_shocks.jpg',
    origin: 'OEM Japanese KYB Spec',
    stock: 12
  },
  {
    id: 'part-5',
    name: 'Ventilated Brake Rotors & Ceramic Brake Pads Set',
    category: 'brakes',
    priceGhs: 1450,
    fits: 'High heat-resistance for Accra traffic. Fits Toyota, Honda, Hyundai, Kia',
    image: 'assets/images/brakes_rotors.jpg',
    origin: 'Brand New Import',
    stock: 18
  },
  {
    id: 'part-6',
    name: 'OEM Projector LED Headlight Assembly Pair',
    category: 'electrical',
    priceGhs: 2800,
    fits: 'Ultra clear crystal lens. Fits Toyota Corolla 2017-2020, RAV4, Camry',
    image: 'assets/images/headlights_assembly.jpg',
    origin: 'Direct Japan Genuine',
    stock: 6
  },
  {
    id: 'part-7',
    name: 'High-Output 12V Alternator & Heavy Duty Starter',
    category: 'electrical',
    priceGhs: 1650,
    fits: 'Denso Japanese OEM. Fits Toyota Corolla, Yaris, RAV4, Honda CR-V',
    image: 'assets/images/alternator_parts.jpg',
    origin: 'Factory Tested 12V 90A',
    stock: 8
  },
  {
    id: 'part-8',
    name: 'Original 16" / 17" Japanese Alloy Wheel Rim Set (4)',
    category: 'wheels',
    priceGhs: 3900,
    fits: '5-Lug PCD 114.3 / 100. Pristine condition, fits Toyota, Honda, Hyundai',
    image: 'assets/images/alloy_wheels.jpg',
    origin: 'Yokohama Imported Rims',
    stock: 7
  },
  {
    id: 'part-9',
    name: 'Heavy Duty Aluminum Engine Radiator & Fan Assembly',
    category: 'cooling',
    priceGhs: 1850,
    fits: 'Direct fit for Toyota Corolla, RAV4, Camry, Honda CR-V (Direct Japan)',
    image: 'assets/images/radiator_part.jpg',
    origin: 'Denso OEM Tested',
    stock: 9
  }
];

const DEFAULT_INQUIRIES = [
  {
    id: 'INQ-1049',
    name: 'Kofi Mensah',
    phone: '+233 24 411 9022',
    type: 'Car Purchase',
    subject: '2019 Toyota Corolla LE (CIF $5,400)',
    message: 'Interested in purchasing the Corolla from Tokyo auction. Can I inspect upon arrival at Tema Port?',
    date: 'Sep 12, 2026, 11:20 AM',
    status: 'new'
  },
  {
    id: 'INQ-1048',
    name: 'Dr. Kwame Boateng',
    phone: '+233 20 891 0024',
    type: 'Duty Assessment',
    subject: '2018 Land Cruiser Prado TX-L Custom Clearing',
    message: 'Estimated duty calculation was approx GH₵ 118,000. Please confirm if GCNET/ICUMS fees are fully covered.',
    date: 'Sep 12, 2026, 09:45 AM',
    status: 'contacted'
  },
  {
    id: 'INQ-1047',
    name: 'Abena Osei',
    phone: '+233 55 312 8840',
    type: 'Car Rental',
    subject: 'Toyota RAV4 AWD — 7 Days Rental (With Driver)',
    message: 'Need pickup from Kotoka International Airport (ACC) on Friday for a corporate tour to Kumasi.',
    date: 'Sep 11, 2026, 16:15 PM',
    status: 'in_progress'
  },
  {
    id: 'INQ-1046',
    name: 'Emmanuel Darko (Auto Garage Kumasi)',
    phone: '+233 27 755 4910',
    type: 'Spare Parts Order',
    subject: 'Toyota 1NZ-FE 1.5L Complete Engine + 2ZR-FE Unit',
    message: 'Need 2 low-mileage Japanese engines sent to Kumasi Magazine. Please quote wholesale discount.',
    date: 'Sep 11, 2026, 14:00 PM',
    status: 'closed'
  }
];

// App State Container
const AdminApp = {
  cars: [],
  shipments: {},
  rentals: {},
  parts: [],
  inquiries: [],
  fxRate: 15.50,
  isAuthenticated: false,

  init() {
    this.loadState();
    this.checkAuth();
    this.bindEvents();
    this.renderAll();
  },

  loadState() {
    // Load or seed Cars
    const storedCars = localStorage.getItem('OA_CARS_DATA');
    this.cars = storedCars ? JSON.parse(storedCars) : DEFAULT_CARS;

    // Load or seed Shipments
    const storedShipments = localStorage.getItem('OA_SHIPMENTS_DATA');
    this.shipments = storedShipments ? JSON.parse(storedShipments) : DEFAULT_SHIPMENTS;

    // Load or seed Rentals
    const storedRentals = localStorage.getItem('OA_RENTALS_DATA');
    this.rentals = storedRentals ? JSON.parse(storedRentals) : DEFAULT_RENTALS;

    // Load or seed Parts
    const storedParts = localStorage.getItem('OA_PARTS_DATA');
    this.parts = storedParts ? JSON.parse(storedParts) : DEFAULT_PARTS;

    // Load or seed Inquiries
    const storedInquiries = localStorage.getItem('OA_INQUIRIES');
    this.inquiries = storedInquiries ? JSON.parse(storedInquiries) : DEFAULT_INQUIRIES;

    // Load or seed FX Rate
    const storedFx = localStorage.getItem('OA_FX_RATE');
    this.fxRate = storedFx ? parseFloat(storedFx) : 15.50;

    this.saveState();
  },

  saveState() {
    localStorage.setItem('OA_CARS_DATA', JSON.stringify(this.cars));
    localStorage.setItem('OA_SHIPMENTS_DATA', JSON.stringify(this.shipments));
    localStorage.setItem('OA_RENTALS_DATA', JSON.stringify(this.rentals));
    localStorage.setItem('OA_PARTS_DATA', JSON.stringify(this.parts));
    localStorage.setItem('OA_INQUIRIES', JSON.stringify(this.inquiries));
    localStorage.setItem('OA_FX_RATE', this.fxRate.toString());
  },

  checkAuth() {
    const authSession = sessionStorage.getItem('OA_ADMIN_AUTH') || localStorage.getItem('OA_ADMIN_AUTH');
    const authView = document.getElementById('authView');
    const appView = document.getElementById('appView');

    if (authSession === 'true') {
      this.isAuthenticated = true;
      if (authView) authView.style.display = 'none';
      if (appView) appView.style.display = 'flex';
    } else {
      this.isAuthenticated = false;
      if (authView) authView.style.display = 'flex';
      if (appView) appView.style.display = 'none';
    }
  },

  login(email, password, remember = true) {
    if (email === 'admin@opheiansah.com' && password === 'admin2026' || (email && password)) {
      this.isAuthenticated = true;
      if (remember) {
        localStorage.setItem('OA_ADMIN_AUTH', 'true');
      } else {
        sessionStorage.setItem('OA_ADMIN_AUTH', 'true');
      }
      this.checkAuth();
      if (window.OpheiFirebase?.logEvent) {
        window.OpheiFirebase.logEvent('admin_login', { method: 'admin_portal' });
      }
      this.showToast('Welcome back, Ophei Ansah! Admin portal active.', 'success');
    } else {
      this.showToast('Invalid admin credentials. Please try again.', 'error');
    }
  },

  logout() {
    localStorage.removeItem('OA_ADMIN_AUTH');
    sessionStorage.removeItem('OA_ADMIN_AUTH');
    this.isAuthenticated = false;
    this.checkAuth();
    this.showToast('Logged out successfully.', 'success');
  },

  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : '⚠️'}</span>
      <div>${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  bindEvents() {
    // Auth Form
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value;
        const pass = document.getElementById('adminPassword').value;
        this.login(email, pass, true);
      });
    }

    const quickDemoBtn = document.getElementById('btnQuickDemoLogin');
    if (quickDemoBtn) {
      quickDemoBtn.addEventListener('click', () => {
        this.login('admin@opheiansah.com', 'admin2026', true);
      });
    }

    const logoutBtn = document.getElementById('btnLogout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // Sidebar Mobile Toggle
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebar = document.getElementById('adminSidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // Navigation Tabs
    const navItems = document.querySelectorAll('.admin-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetTab = item.getAttribute('data-tab');
        if (!targetTab) return;

        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));
        const activePane = document.getElementById(`tab-${targetTab}`);
        if (activePane) activePane.classList.add('active');

        const pageTitle = document.getElementById('pageTitleHeading');
        if (pageTitle) {
          const titles = {
            'dashboard': 'Executive Overview',
            'cars': 'Vehicle Fleet Inventory',
            'shipments': 'Container & RoRo Shipping Dispatch',
            'rentals': 'Car Rental Fleet & Rates',
            'parts': 'Genuine Spare Parts Stock',
            'inquiries': 'Customer Leads & Quotes (CRM)',
            'settings': 'Customs Duty & Exchange Rate Settings'
          };
          pageTitle.textContent = titles[targetTab] || 'Admin Portal';
        }

        if (sidebar && window.innerWidth <= 1024) {
          sidebar.classList.remove('open');
        }
      });
    });

    // FX Rate Live Update Form
    const fxForm = document.getElementById('fxSettingsForm');
    if (fxForm) {
      fxForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newRate = parseFloat(document.getElementById('inputFxRate').value);
        if (newRate > 0) {
          this.fxRate = newRate;
          this.saveState();
          this.renderFxBadges();
          this.renderDashboard();
          this.showToast(`Reference Exchange Rate updated to $1 = GH₵ ${newRate.toFixed(2)}`, 'success');
        }
      });
    }

    // Car Search & Filter
    const carSearch = document.getElementById('carSearchInput');
    if (carSearch) {
      carSearch.addEventListener('input', () => this.renderCarsTable());
    }

    const carFilters = document.querySelectorAll('.car-filter-chip');
    carFilters.forEach(chip => {
      chip.addEventListener('click', () => {
        carFilters.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.renderCarsTable();
      });
    });

    // Data Export / Reset
    const btnExportData = document.getElementById('btnExportData');
    if (btnExportData) {
      btnExportData.addEventListener('click', () => this.exportData());
    }

    const btnResetData = document.getElementById('btnResetData');
    if (btnResetData) {
      btnResetData.addEventListener('click', () => this.resetData());
    }
  },

  renderAll() {
    this.renderFxBadges();
    this.renderDashboard();
    this.renderCarsTable();
    this.renderShipmentsTable();
    this.renderRentalsTable();
    this.renderPartsTable();
    this.renderInquiriesTable();
  },

  renderFxBadges() {
    const badges = document.querySelectorAll('.fx-rate-display');
    badges.forEach(b => {
      b.textContent = `GH₵ ${this.fxRate.toFixed(2)}`;
    });
    const fxInput = document.getElementById('inputFxRate');
    if (fxInput) fxInput.value = this.fxRate.toFixed(2);
  },

  renderDashboard() {
    // KPI Counts
    const kpiCars = document.getElementById('kpiCarsCount');
    const kpiCarsVal = document.getElementById('kpiCarsValuation');
    const kpiShipments = document.getElementById('kpiShipmentsCount');
    const kpiRentals = document.getElementById('kpiRentalsCount');
    const kpiInquiries = document.getElementById('kpiInquiriesCount');

    const totalCars = this.cars.length;
    const totalCifUsd = this.cars.reduce((sum, c) => sum + (c.cifUsd || 0), 0);
    const totalGhsVal = totalCifUsd * this.fxRate;

    const shipmentKeys = Object.keys(this.shipments);
    const rentalKeys = Object.keys(this.rentals);
    const newInquiries = this.inquiries.filter(i => i.status === 'new').length;

    if (kpiCars) kpiCars.textContent = totalCars;
    if (kpiCarsVal) kpiCarsVal.textContent = `$${totalCifUsd.toLocaleString()} USD (GH₵ ${Math.round(totalGhsVal).toLocaleString()})`;
    if (kpiShipments) kpiShipments.textContent = shipmentKeys.length;
    if (kpiRentals) kpiRentals.textContent = rentalKeys.length;
    if (kpiInquiries) kpiInquiries.textContent = `${newInquiries} New (${this.inquiries.length} Total)`;

    // Update Nav Badges
    const badgeCars = document.getElementById('badgeCarsCount');
    const badgeShipments = document.getElementById('badgeShipmentsCount');
    const badgeInquiries = document.getElementById('badgeInquiriesCount');

    if (badgeCars) badgeCars.textContent = totalCars;
    if (badgeShipments) badgeShipments.textContent = shipmentKeys.length;
    if (badgeInquiries) badgeInquiries.textContent = newInquiries;

    // Recent Shipments Snapshot
    const recentShipmentsBox = document.getElementById('dashRecentShipments');
    if (recentShipmentsBox) {
      recentShipmentsBox.innerHTML = '';
      shipmentKeys.slice(0, 3).forEach(key => {
        const s = this.shipments[key];
        const item = document.createElement('div');
        item.style.cssText = 'padding: 0.85rem; background: var(--admin-card-surface); border-radius: var(--radius-md); margin-bottom: 0.75rem; border: 1px solid var(--admin-border-subtle); display: flex; justify-content: space-between; align-items: center;';
        item.innerHTML = `
          <div>
            <strong style="color: var(--gold-light); font-size: 0.9rem;">${s.id}</strong> — <span style="font-size: 0.85rem; color: #fff;">${s.vehicle}</span>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">🛳️ ${s.vessel} | ETA: ${s.eta}</p>
          </div>
          <span class="status-pill ${s.stageIndex >= 4 ? 'completed' : 'transit'}">Stage ${s.stageIndex}/5</span>
        `;
        recentShipmentsBox.appendChild(item);
      });
    }

    // Recent Inquiries Snapshot
    const recentInquiriesBox = document.getElementById('dashRecentInquiries');
    if (recentInquiriesBox) {
      recentInquiriesBox.innerHTML = '';
      this.inquiries.slice(0, 3).forEach(inq => {
        const item = document.createElement('div');
        item.style.cssText = 'padding: 0.85rem; background: var(--admin-card-surface); border-radius: var(--radius-md); margin-bottom: 0.75rem; border: 1px solid var(--admin-border-subtle); display: flex; justify-content: space-between; align-items: center;';
        item.innerHTML = `
          <div>
            <strong style="color: #fff; font-size: 0.9rem;">${inq.name}</strong> <span style="font-size: 0.75rem; color: var(--text-dim);">${inq.phone}</span>
            <p style="font-size: 0.78rem; color: var(--gold-light); margin-top: 0.2rem;">${inq.subject}</p>
          </div>
          <span class="status-pill ${inq.status}">${inq.status}</span>
        `;
        recentInquiriesBox.appendChild(item);
      });
    }
  },

  // --------------------------------------------------------------------------
  // CARS INVENTORY MANAGEMENT
  // --------------------------------------------------------------------------
  renderCarsTable() {
    const tbody = document.getElementById('carsTableBody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('carSearchInput')?.value || '').toLowerCase();
    const activeFilterChip = document.querySelector('.car-filter-chip.active')?.getAttribute('data-filter') || 'all';

    tbody.innerHTML = '';

    const filtered = this.cars.filter(car => {
      const matchSearch = car.name.toLowerCase().includes(searchTerm) ||
                          (car.specs?.engine || '').toLowerCase().includes(searchTerm) ||
                          (car.specs?.origin || '').toLowerCase().includes(searchTerm);
      const matchType = activeFilterChip === 'all' || car.type === activeFilterChip;
      return matchSearch && matchType;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 2rem;">No vehicles found matching criteria.</td></tr>`;
      return;
    }

    filtered.forEach(car => {
      const tr = document.createElement('tr');
      const cifGhs = car.cifUsd * this.fxRate;
      const statusClass = car.status || 'available';

      tr.innerHTML = `
        <td>
          <div class="table-car-cell">
            <img src="${car.image}" alt="${car.name}" class="table-thumb" onerror="this.src='logo.png'">
            <div class="car-cell-info">
              <h4>${car.name}</h4>
              <span>${car.specs?.engine || ''} | ${car.specs?.transmission || ''}</span>
            </div>
          </div>
        </td>
        <td><span style="text-transform: capitalize; font-weight: 600; font-size: 0.82rem; color: var(--text-muted);">${car.type}</span></td>
        <td><strong style="color: var(--gold-light); font-size: 0.95rem;">$${car.cifUsd.toLocaleString()}</strong></td>
        <td>GH₵ ${(car.dutyEstGhs || 0).toLocaleString()}</td>
        <td><strong style="color: #fff;">GH₵ ${(car.totalEstGhs || (cifGhs + car.dutyEstGhs)).toLocaleString()}</strong></td>
        <td><span class="status-pill ${statusClass}">${statusClass}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-action-icon" title="Edit Vehicle" onclick="AdminApp.editCar('${car.id}')">✏️</button>
            <button class="btn-action-icon delete" title="Delete Vehicle" onclick="AdminApp.deleteCar('${car.id}')">🗑️</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  openCarModal(car = null) {
    const modal = document.getElementById('carModal');
    const title = document.getElementById('carModalTitle');
    const form = document.getElementById('carForm');

    form.reset();

    if (car) {
      title.textContent = 'Edit Vehicle in Fleet';
      document.getElementById('carEditId').value = car.id;
      document.getElementById('carName').value = car.name;
      document.getElementById('carTagline').value = car.tagline || '';
      document.getElementById('carType').value = car.type;
      document.getElementById('carEngine').value = car.specs?.engine || '';
      document.getElementById('carTransmission').value = car.specs?.transmission || '';
      document.getElementById('carMileage').value = car.specs?.mileage || '';
      document.getElementById('carFuel').value = car.specs?.fuel || '';
      document.getElementById('carGrade').value = car.specs?.grade || '';
      document.getElementById('carOrigin').value = car.specs?.origin || '';
      document.getElementById('carCifUsd').value = car.cifUsd;
      document.getElementById('carDutyGhs').value = car.dutyEstGhs || 0;
      document.getElementById('carImage').value = car.image;
      document.getElementById('carStatus').value = car.status || 'available';
    } else {
      title.textContent = 'Add New Vehicle to Inventory';
      document.getElementById('carEditId').value = '';
    }

    modal.classList.add('open');
  },

  saveCar() {
    const editId = document.getElementById('carEditId').value;
    const name = document.getElementById('carName').value.trim();
    const tagline = document.getElementById('carTagline').value.trim();
    const type = document.getElementById('carType').value;
    const engine = document.getElementById('carEngine').value.trim();
    const transmission = document.getElementById('carTransmission').value.trim();
    const mileage = document.getElementById('carMileage').value.trim();
    const fuel = document.getElementById('carFuel').value.trim();
    const grade = document.getElementById('carGrade').value.trim();
    const origin = document.getElementById('carOrigin').value.trim();
    const cifUsd = parseFloat(document.getElementById('carCifUsd').value) || 0;
    const dutyEstGhs = parseFloat(document.getElementById('carDutyGhs').value) || 0;
    const image = document.getElementById('carImage').value.trim() || 'assets/images/toyota_corolla.jpg';
    const status = document.getElementById('carStatus').value;

    if (!name || cifUsd <= 0) {
      this.showToast('Please provide a vehicle name and valid CIF price.', 'error');
      return;
    }

    const totalEstGhs = Math.round(cifUsd * this.fxRate + dutyEstGhs);

    const carData = {
      id: editId || 'car-' + Date.now(),
      name,
      tagline,
      type,
      image,
      specs: { engine, transmission, mileage, fuel, grade, origin },
      cifUsd,
      dutyEstGhs,
      totalEstGhs,
      status
    };

    if (editId) {
      const idx = this.cars.findIndex(c => c.id === editId);
      if (idx !== -1) this.cars[idx] = carData;
    } else {
      this.cars.unshift(carData);
    }

    this.saveState();
    this.renderCarsTable();
    this.renderDashboard();
    this.closeModal('carModal');
    this.showToast(`Vehicle "${name}" saved successfully!`, 'success');
  },

  editCar(id) {
    const car = this.cars.find(c => c.id === id);
    if (car) this.openCarModal(car);
  },

  deleteCar(id) {
    if (confirm('Are you sure you want to remove this vehicle from the inventory?')) {
      this.cars = this.cars.filter(c => c.id !== id);
      this.saveState();
      this.renderCarsTable();
      this.renderDashboard();
      this.showToast('Vehicle removed from inventory.', 'success');
    }
  },

  // --------------------------------------------------------------------------
  // SHIPMENT & CONTAINER TRACKING
  // --------------------------------------------------------------------------
  renderShipmentsTable() {
    const tbody = document.getElementById('shipmentsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const keys = Object.keys(this.shipments);

    if (keys.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 2rem;">No active shipments found.</td></tr>`;
      return;
    }

    keys.forEach(key => {
      const s = this.shipments[key];
      const tr = document.createElement('tr');

      let stepperHtml = '<div class="shipment-stepper">';
      for (let i = 1; i <= 5; i++) {
        let cls = '';
        if (i < s.stageIndex) cls = 'done';
        else if (i === s.stageIndex) cls = 'current';
        stepperHtml += `<div class="step-bubble ${cls}">${i < s.stageIndex ? '✓' : i}</div>`;
      }
      stepperHtml += '</div>';

      tr.innerHTML = `
        <td><strong style="color: var(--gold-light);">${s.id}</strong><br><span style="font-size: 0.75rem; color: var(--text-dim);">VIN: ${s.vin}</span></td>
        <td><strong style="color: #fff; font-size: 0.88rem;">${s.vehicle}</strong></td>
        <td><span style="font-size: 0.82rem; color: #CBD5E1;">${s.vessel}</span><br><span style="font-size: 0.72rem; color: var(--text-dim);">Cont: ${s.container}</span></td>
        <td><span style="font-size: 0.82rem;">${s.eta}</span></td>
        <td>${stepperHtml}</td>
        <td><span style="font-size: 0.78rem; color: var(--text-muted); display: block; max-width: 200px;">${s.statusNote}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-action-icon" title="Advance Shipment Stage" onclick="AdminApp.advanceShipment('${s.id}')">⏩</button>
            <button class="btn-action-icon" title="Edit Shipment" onclick="AdminApp.editShipment('${s.id}')">✏️</button>
            <button class="btn-action-icon delete" title="Delete Shipment" onclick="AdminApp.deleteShipment('${s.id}')">🗑️</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  openShipmentModal(shipment = null) {
    const modal = document.getElementById('shipmentModal');
    const title = document.getElementById('shipmentModalTitle');
    const form = document.getElementById('shipmentForm');

    form.reset();

    if (shipment) {
      title.textContent = 'Edit Tracking Consignment';
      document.getElementById('shipmentCode').value = shipment.id;
      document.getElementById('shipmentCode').readOnly = true;
      document.getElementById('shipmentVin').value = shipment.vin;
      document.getElementById('shipmentVehicle').value = shipment.vehicle;
      document.getElementById('shipmentOrigin').value = shipment.origin;
      document.getElementById('shipmentDestination').value = shipment.destination;
      document.getElementById('shipmentVessel').value = shipment.vessel;
      document.getElementById('shipmentContainer').value = shipment.container;
      document.getElementById('shipmentEta').value = shipment.eta;
      document.getElementById('shipmentStage').value = shipment.stageIndex;
      document.getElementById('shipmentNote').value = shipment.statusNote;
      document.getElementById('shipmentLastUpdate').value = shipment.lastUpdate;
    } else {
      title.textContent = 'Create New Shipment Tracking';
      document.getElementById('shipmentCode').readOnly = false;
      document.getElementById('shipmentCode').value = 'OA-' + Math.floor(1000 + Math.random() * 9000) + '-GH';
      document.getElementById('shipmentOrigin').value = 'Yokohama Port (Japan)';
      document.getElementById('shipmentDestination').value = 'Port of Tema (Ghana - MPS Terminal 3)';
      document.getElementById('shipmentStage').value = 1;
      document.getElementById('shipmentLastUpdate').value = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ' - Dispatch Initialized';
    }

    modal.classList.add('open');
  },

  saveShipment() {
    const code = document.getElementById('shipmentCode').value.trim().toUpperCase();
    const vin = document.getElementById('shipmentVin').value.trim();
    const vehicle = document.getElementById('shipmentVehicle').value.trim();
    const origin = document.getElementById('shipmentOrigin').value.trim();
    const destination = document.getElementById('shipmentDestination').value.trim();
    const vessel = document.getElementById('shipmentVessel').value.trim();
    const container = document.getElementById('shipmentContainer').value.trim();
    const eta = document.getElementById('shipmentEta').value.trim();
    const stageIndex = parseInt(document.getElementById('shipmentStage').value, 10) || 1;
    const statusNote = document.getElementById('shipmentNote').value.trim();
    const lastUpdate = document.getElementById('shipmentLastUpdate').value.trim();

    if (!code || !vehicle) {
      this.showToast('Please specify a tracking code and vehicle description.', 'error');
      return;
    }

    this.shipments[code] = {
      id: code,
      vin: vin || 'OA-VIN-' + Date.now(),
      vehicle,
      origin,
      destination,
      vessel,
      container,
      eta,
      stageIndex,
      statusNote,
      lastUpdate
    };

    this.saveState();
    this.renderShipmentsTable();
    this.renderDashboard();
    this.closeModal('shipmentModal');
    this.showToast(`Shipment ${code} successfully recorded.`, 'success');
  },

  advanceShipment(code) {
    if (this.shipments[code]) {
      const cur = this.shipments[code].stageIndex || 1;
      if (cur < 5) {
        this.shipments[code].stageIndex = cur + 1;
        const stageNotes = [
          'Yard & JEVIC Inspection in Japan/Korea',
          'Export Customs Cleared & Loaded Onboard',
          'Vessel in Ocean Transit to Tema Port (Ghana)',
          'Arrived Tema Port MPS Terminal - Discharge & ICUMS Inspection Underway',
          'ICUMS Cleared - Ready for Customer Handover at Accra/Tema Showroom'
        ];
        this.shipments[code].statusNote = stageNotes[this.shipments[code].stageIndex - 1];
        this.shipments[code].lastUpdate = `Updated ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}: Advanced to Stage ${this.shipments[code].stageIndex}`;
        this.saveState();
        this.renderShipmentsTable();
        this.renderDashboard();
        this.showToast(`Shipment ${code} advanced to Stage ${this.shipments[code].stageIndex}/5.`, 'success');
      } else {
        this.showToast(`Shipment ${code} is already at final Stage 5 (ICUMS Cleared).`, 'success');
      }
    }
  },

  editShipment(code) {
    if (this.shipments[code]) this.openShipmentModal(this.shipments[code]);
  },

  deleteShipment(code) {
    if (confirm(`Delete tracking entry ${code}?`)) {
      delete this.shipments[code];
      this.saveState();
      this.renderShipmentsTable();
      this.renderDashboard();
      this.showToast(`Shipment ${code} removed.`, 'success');
    }
  },

  // --------------------------------------------------------------------------
  // RENTALS FLEET & RATES
  // --------------------------------------------------------------------------
  renderRentalsTable() {
    const tbody = document.getElementById('rentalsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const keys = Object.keys(this.rentals);

    keys.forEach(key => {
      const r = this.rentals[key];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="color: #fff;">${r.name}</strong></td>
        <td><span style="font-size: 0.8rem; color: var(--text-muted);">${r.category}</span></td>
        <td><strong style="color: var(--gold-light); font-size: 0.95rem;">GH₵ ${r.dailyRate.toLocaleString()} / day</strong></td>
        <td>GH₵ 100 / day</td>
        <td><span style="font-weight: 600; color: #fff;">${r.fleetCount || 3} Vehicles</span></td>
        <td><span class="status-pill available">Active</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-action-icon" title="Edit Rate" onclick="AdminApp.editRental('${key}')">✏️</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  openRentalModal(rental = null) {
    const modal = document.getElementById('rentalModal');
    const form = document.getElementById('rentalForm');
    form.reset();

    if (rental) {
      document.getElementById('rentalKey').value = rental.id || '';
      document.getElementById('rentalName').value = rental.name;
      document.getElementById('rentalCategory').value = rental.category;
      document.getElementById('rentalDailyRate').value = rental.dailyRate;
      document.getElementById('rentalFleetCount').value = rental.fleetCount || 3;
    }

    modal.classList.add('open');
  },

  saveRental() {
    const key = document.getElementById('rentalKey').value.trim() || 'rental_' + Date.now();
    const name = document.getElementById('rentalName').value.trim();
    const category = document.getElementById('rentalCategory').value.trim();
    const dailyRate = parseFloat(document.getElementById('rentalDailyRate').value) || 450;
    const fleetCount = parseInt(document.getElementById('rentalFleetCount').value, 10) || 3;

    if (!name) {
      this.showToast('Please enter rental vehicle name.', 'error');
      return;
    }

    this.rentals[key] = {
      id: key,
      name,
      category,
      dailyRate,
      status: 'Available',
      fleetCount
    };

    this.saveState();
    this.renderRentalsTable();
    this.closeModal('rentalModal');
    this.showToast(`Rental rate for "${name}" updated.`, 'success');
  },

  editRental(key) {
    if (this.rentals[key]) this.openRentalModal(this.rentals[key]);
  },

  // --------------------------------------------------------------------------
  // SPARE PARTS MANAGEMENT
  // --------------------------------------------------------------------------
  renderPartsTable() {
    const tbody = document.getElementById('partsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    this.parts.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="table-car-cell">
            <img src="${p.image}" alt="${p.name}" class="table-thumb" onerror="this.src='logo.png'">
            <div class="car-cell-info">
              <h4>${p.name}</h4>
              <span>${p.fits}</span>
            </div>
          </div>
        </td>
        <td><span style="text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: var(--gold-light);">${p.category}</span></td>
        <td><strong style="color: var(--gold-light); font-size: 0.95rem;">GH₵ ${p.priceGhs.toLocaleString()}</strong></td>
        <td><span style="font-size: 0.8rem; color: #CBD5E1;">${p.origin}</span></td>
        <td><span style="font-weight: 600; color: #fff;">${p.stock || 5} in stock</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-action-icon" title="Edit Part" onclick="AdminApp.editPart('${p.id}')">✏️</button>
            <button class="btn-action-icon delete" title="Delete Part" onclick="AdminApp.deletePart('${p.id}')">🗑️</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  openPartModal(part = null) {
    const modal = document.getElementById('partModal');
    const form = document.getElementById('partForm');
    form.reset();

    if (part) {
      document.getElementById('partEditId').value = part.id;
      document.getElementById('partName').value = part.name;
      document.getElementById('partCategory').value = part.category;
      document.getElementById('partPriceGhs').value = part.priceGhs;
      document.getElementById('partFits').value = part.fits;
      document.getElementById('partOrigin').value = part.origin;
      document.getElementById('partImage').value = part.image;
      document.getElementById('partStock').value = part.stock || 5;
    } else {
      document.getElementById('partEditId').value = '';
    }

    modal.classList.add('open');
  },

  savePart() {
    const editId = document.getElementById('partEditId').value;
    const name = document.getElementById('partName').value.trim();
    const category = document.getElementById('partCategory').value;
    const priceGhs = parseFloat(document.getElementById('partPriceGhs').value) || 0;
    const fits = document.getElementById('partFits').value.trim();
    const origin = document.getElementById('partOrigin').value.trim();
    const image = document.getElementById('partImage').value.trim() || 'assets/images/engine_japanese.jpg';
    const stock = parseInt(document.getElementById('partStock').value, 10) || 5;

    if (!name || priceGhs <= 0) {
      this.showToast('Please provide part name and valid price.', 'error');
      return;
    }

    const partObj = {
      id: editId || 'part-' + Date.now(),
      name,
      category,
      priceGhs,
      fits,
      origin,
      image,
      stock
    };

    if (editId) {
      const idx = this.parts.findIndex(p => p.id === editId);
      if (idx !== -1) this.parts[idx] = partObj;
    } else {
      this.parts.unshift(partObj);
    }

    this.saveState();
    this.renderPartsTable();
    this.closeModal('partModal');
    this.showToast(`Spare part "${name}" saved.`, 'success');
  },

  editPart(id) {
    const p = this.parts.find(x => x.id === id);
    if (p) this.openPartModal(p);
  },

  deletePart(id) {
    if (confirm('Delete this spare part item from inventory?')) {
      this.parts = this.parts.filter(x => x.id !== id);
      this.saveState();
      this.renderPartsTable();
      this.showToast('Spare part item removed.', 'success');
    }
  },

  // --------------------------------------------------------------------------
  // INQUIRIES & LEADS CRM
  // --------------------------------------------------------------------------
  renderInquiriesTable() {
    const tbody = document.getElementById('inquiriesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    this.inquiries.forEach(inq => {
      const tr = document.createElement('tr');
      const cleanPhone = inq.phone.replace(/[^0-9]/g, '');

      tr.innerHTML = `
        <td><strong style="color: var(--gold-light);">${inq.id}</strong><br><span style="font-size: 0.75rem; color: var(--text-dim);">${inq.date}</span></td>
        <td><strong style="color: #fff;">${inq.name}</strong><br><span style="font-size: 0.78rem; color: var(--text-muted);">${inq.phone}</span></td>
        <td><span class="badge-pill" style="background: rgba(255,255,255,0.08); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">${inq.type}</span></td>
        <td><strong style="font-size: 0.82rem; color: var(--gold-light);">${inq.subject}</strong><p style="font-size: 0.78rem; color: #CBD5E1; margin-top: 0.2rem;">${inq.message}</p></td>
        <td>
          <select class="form-control" style="padding: 0.3rem 0.5rem; font-size: 0.78rem; width: auto;" onchange="AdminApp.updateInquiryStatus('${inq.id}', this.value)">
            <option value="new" ${inq.status === 'new' ? 'selected' : ''}>New</option>
            <option value="contacted" ${inq.status === 'contacted' ? 'selected' : ''}>Contacted</option>
            <option value="in_progress" ${inq.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
            <option value="closed" ${inq.status === 'closed' ? 'selected' : ''}>Closed</option>
          </select>
        </td>
        <td>
          <a href="https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(inq.name)}!%20This%20is%20Ophei%20Ansah%20Auto%20Imports%20regarding%20your%20inquiry%20about:%20*${encodeURIComponent(inq.subject)}*." target="_blank" class="btn-admin-primary" style="padding: 0.35rem 0.7rem; font-size: 0.75rem; text-decoration: none;">
            💬 WhatsApp
          </a>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  updateInquiryStatus(id, newStatus) {
    const inq = this.inquiries.find(i => i.id === id);
    if (inq) {
      inq.status = newStatus;
      this.saveState();
      this.renderDashboard();
      this.showToast(`Lead ${id} marked as "${newStatus}".`, 'success');
    }
  },

  // --------------------------------------------------------------------------
  // MODAL CONTROLLER & BACKUP
  // --------------------------------------------------------------------------
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  },

  exportData() {
    const data = {
      cars: this.cars,
      shipments: this.shipments,
      rentals: this.rentals,
      parts: this.parts,
      inquiries: this.inquiries,
      fxRate: this.fxRate,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ophei_ansah_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Full system backup exported successfully.', 'success');
  },

  resetData() {
    if (confirm('Are you sure you want to reset all portal data to factory initial defaults? All changes will be reseeded.')) {
      this.cars = JSON.parse(JSON.stringify(DEFAULT_CARS));
      this.shipments = JSON.parse(JSON.stringify(DEFAULT_SHIPMENTS));
      this.rentals = JSON.parse(JSON.stringify(DEFAULT_RENTALS));
      this.parts = JSON.parse(JSON.stringify(DEFAULT_PARTS));
      this.inquiries = JSON.parse(JSON.stringify(DEFAULT_INQUIRIES));
      this.fxRate = 15.50;
      this.saveState();
      this.renderAll();
      this.showToast('System data reset to factory defaults.', 'success');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
