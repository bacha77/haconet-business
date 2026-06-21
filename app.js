/**
 * HACONET Web Platform Core Business Logic
 * Single Page Application Orchestrator with Supabase Database
 */

// Global diagnostic error logger
window.addEventListener('error', (event) => {
  console.error("HACONET JavaScript Uncaught Error:", event.error);
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const isDebug = urlParams.get('debug') === 'true';
    if (isDebug) {
      let errDiv = document.getElementById('mobile-debug-overlay');
      if (!errDiv) {
        errDiv = document.createElement('div');
        errDiv.id = 'mobile-debug-overlay';
        errDiv.style.position = 'fixed';
        errDiv.style.bottom = '10px';
        errDiv.style.left = '10px';
        errDiv.style.right = '10px';
        errDiv.style.background = 'rgba(231, 76, 60, 0.95)';
        errDiv.style.color = '#fff';
        errDiv.style.padding = '12px';
        errDiv.style.borderRadius = '8px';
        errDiv.style.fontSize = '12px';
        errDiv.style.fontFamily = 'monospace';
        errDiv.style.zIndex = '999999';
        errDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
        errDiv.style.maxHeight = '150px';
        errDiv.style.overflowY = 'auto';
        errDiv.innerHTML = '<strong>Mobile Debug Log:</strong><br>';
        document.body.appendChild(errDiv);
      }
      const errMsg = event.error ? (event.error.message || event.error.toString()) : event.message;
      errDiv.innerHTML += `• ${errMsg}<br>`;
    }
  } catch(e) {
    console.error("Error displaying mobile debug overlay:", e);
  }
});

// Safe LocalStorage Wrapper for private/sandboxed webviews
const memoryStorage = {};
function safeGetItem(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    console.warn(`localStorage.getItem failed for key "${key}":`, e);
    return memoryStorage[key] || null;
  }
}
function safeSetItem(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`localStorage.setItem failed for key "${key}":`, e);
    memoryStorage[key] = String(value);
  }
}
function safeRemoveItem(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    console.warn(`localStorage.removeItem failed for key "${key}":`, e);
    delete memoryStorage[key];
  }
}

// ==========================================================================
// 1. Initial Seed Data
// ==========================================================================
const SEED_BUSINESSES = [
  {
    id: "biz-1781580403894",
    name: "Island Bar Cuisine",
    owner: "Island Bar Management",
    title: "Operator",
    category: "Food & Beverage",
    phone: "614-263-2272",
    email: "info@islandbarcuisine.com",
    website: "https://www.facebook.com/islandbarcuisine/",
    address: "3496 Cleveland Ave, Columbus, OH 43224",
    established: 2019,
    description: "Authentic Haitian and Caribbean dishes, offering rich flavors of legumes, griot, tasso, and more in a welcoming bar and lounge environment.",
    interests: ["Build business relationships", "Find potential clients/customers", "Promote products/services"]
  },
  {
    id: "biz-1781580403895",
    name: "Bibi's Patties",
    owner: "Bibi Augustin",
    title: "Founder & Head Baker",
    category: "Food & Beverage",
    phone: "614-505-8321",
    email: "contact@bibispatties.com",
    website: "https://www.bibispatties.com",
    address: "6086 Huntley Rd, Columbus, OH 43229",
    established: 2021,
    description: "Authentic Haitian puff pastry patties filled with seasoned beef, chicken, fish, or vegetables. Freshly baked daily and serving Central Ohio's Haitian community.",
    interests: ["Promote products/services", "Find potential clients/customers", "Connect with other entrepreneurs"]
  },
  {
    id: "biz-1781580403896",
    name: "T-Co Islands Restaurant",
    owner: "T-Co Management",
    title: "General Manager",
    category: "Food & Beverage",
    phone: "614-846-1509",
    email: "order@tcoislandsrestaurant.com",
    website: "https://tcoislands.com",
    address: "4860 Karl Rd, Columbus, OH 43229",
    established: 2017,
    description: "Serving Columbus with authentic Haitian flavors including legume, black rice (diri djondjon), griot, and delicious bouillon.",
    interests: ["Build business relationships", "Find potential clients/customers"]
  },
  {
    id: "biz-1781580403897",
    name: "Caribbean Your Kitchen",
    owner: "Your Kitchen Culinary Team",
    title: "Owner",
    category: "Food & Beverage",
    phone: "614-392-1279",
    email: "yourkitchen@caribbeanyourkitchen.com",
    website: "https://caribbeanyourkitchen.com/",
    address: "5316 Cleveland Ave, Columbus, OH 43231",
    established: 2020,
    description: "Family-owned kitchen serving authentic Haitian dishes, griot, legume, fried plantains, and other Caribbean favorites.",
    interests: ["Find potential clients/customers", "Promote products/services"]
  },
  {
    id: "biz-1781580403898",
    name: "509 Restaurant & Grill",
    owner: "509 Dining Group LLC",
    title: "General Manager",
    category: "Food & Beverage",
    phone: "614-578-8311",
    email: "manager@509restaurant.com",
    website: "https://509restaurant.com",
    address: "3508 E Main St, Columbus, OH 43213",
    established: 2022,
    description: "Vibrant restaurant and grill offering a modern twist on Haitian culinary classics, from griot to flavorful stews.",
    interests: ["Build business relationships", "Explore partnerships", "Promote products/services"]
  },
  {
    id: "biz-1781655000001",
    name: "A Taste of Haiti",
    owner: "Taste of Haiti Team",
    title: "Owner",
    category: "Food & Beverage",
    phone: "614-330-8029",
    email: "atasteofhaiticolumbus@gmail.com",
    website: "https://www.facebook.com/atasteofhaiticolumbus/",
    address: "4734 Cleveland Ave, Columbus, OH 43231",
    established: 2018,
    description: "A popular family-owned Haitian food truck and catering service serving Central Ohio. Specializes in home-cooked Haitian delicacies, traditional griot, legume, plantains, and pastries.",
    interests: ["Find potential clients/customers", "Promote products/services"]
  },
  {
    id: "biz-1781655000002",
    name: "Renise Market Lakay",
    owner: "Renise Augustin",
    title: "Owner",
    category: "Food & Beverage",
    phone: "614-505-3906",
    email: "info@renisemarket.store",
    website: "https://renisemarket.store",
    address: "5169 Sinclair Road, Columbus, OH 43229",
    established: 2017,
    description: "The premier Haitian and Caribbean grocery store in Columbus, Ohio. Offering imported Haitian breads, spices, djondjon, and traditional ingredients.",
    interests: ["Promote products/services", "Find potential clients/customers", "Build business relationships"]
  },
  {
    id: "biz-1781655000003",
    name: "Michline Haitian Caribbean Store",
    owner: "Michline Cadet",
    title: "Owner",
    category: "Retail",
    phone: "614-895-3642",
    email: "support@michlinehcs.com",
    website: "https://michlinehcs.com",
    address: "Columbus, OH",
    established: 2021,
    description: "Online-based boutique and cultural storefront specializing in organic Haitian coffee, pilon (mortar & pestle) sets, Haitian lalo, pikliz, and traditional herbal remedies.",
    interests: ["Find potential clients/customers", "Promote products/services"]
  },
  {
    id: "biz-1781580403899",
    name: "Greater Haitian American Chamber of Commerce (GHACC)",
    owner: "Chamber Board",
    title: "Executive Committee",
    category: "Nonprofit",
    phone: "614-600-5530",
    email: "network@ghacc.org",
    website: "https://www.ghacc.org",
    address: "Columbus, OH",
    established: 2015,
    description: "Direct business network dedicated to supporting, connecting, and advocating for Haitian-American entrepreneurs and business professionals in Central Ohio.",
    interests: ["Build business relationships", "Meet community leaders", "Explore partnerships", "Learn about resources and funding opportunities"]
  },
  {
    id: "biz-1781655000004",
    name: "Haitian Community Network (HaCoNet)",
    owner: "Marc Fequiere",
    title: "Executive Director",
    category: "Nonprofit",
    phone: "614-600-5530",
    email: "info@haconet.org",
    website: "https://haconet.org",
    address: "2020 Brice Rd., Suite 185, Reynoldsburg, OH 43068",
    established: 2014,
    description: "Nonprofit organization dedicated to empowering the Haitian community in Ohio through education (ESL classes), resource navigation, translation services, civic advocacy, and integration assistance.",
    interests: ["Meet community leaders", "Explore partnerships", "Learn about resources and funding opportunities"]
  },
  {
    id: "biz-1781580403900",
    name: "Bond Enterprise Language Services",
    owner: "Bond Translation Services",
    title: "Director of Operations",
    category: "Professional Services",
    phone: "614-943-3490",
    email: "support@bondlanguages.com",
    website: "https://www.bondenterpriselanguageservices.com",
    address: "Columbus, OH",
    established: 2018,
    description: "Professional interpretation and translation services specializing in certified Haitian Creole and English document translation, business localization, and community interpretation.",
    interests: ["Build business relationships", "Find potential clients/customers", "Explore partnerships"]
  },
  {
    id: "biz-1781655000005",
    name: "Mala African & Caribbean Hair Braiding",
    owner: "Mala Diallo",
    title: "Owner & Lead Stylist",
    category: "Professional Services",
    phone: "614-868-8090",
    email: "info@malahairbraiding.com",
    website: "https://www.facebook.com/MalaHairBraiding/",
    address: "1918 S Hamilton Rd, Columbus, OH 43232",
    established: 2016,
    description: "Professional hair care and braiding salon specializing in traditional and modern African and Caribbean braiding styles for all hair types.",
    interests: ["Find potential clients/customers", "Promote products/services"]
  }
];

const SEED_REGISTRATIONS = [
  {
    regId: 'HAC-2026-0001',
    bizName: 'Island Bar Cuisine',
    ownerName: 'Islande Pierre',
    title: 'Owner',
    address: '3496 Cleveland Ave',
    city: 'Columbus',
    state: 'OH',
    zip: '43224',
    phone: '614-263-2272',
    email: 'info@islandbarcuisine.com',
    website: 'https://www.facebook.com/islandbarcuisine/',
    industry: 'Food & Beverage',
    established: '2019',
    description: 'Authentic Haitian cuisine and Caribbean dishes.',
    interests: ['Promote products/services', 'Find potential clients/customers'],
    exhibitor: 'Yes',
    electricity: 'Yes',
    directoryConsent: 'Yes',
    accommodations: '',
    signature: 'Islande Pierre',
    dateSigned: '2026-06-10',
    checkedIn: false,
    checkedInAt: null,
    tableNumber: 3
  },
  {
    regId: 'HAC-2026-0002',
    bizName: "Bibi's Patties",
    ownerName: 'Bibi Augustin',
    title: 'Founder & Head Baker',
    address: '6086 Huntley Rd',
    city: 'Columbus',
    state: 'OH',
    zip: '43229',
    phone: '614-505-8321',
    email: 'contact@bibispatties.com',
    website: 'https://www.bibispatties.com',
    industry: 'Food & Beverage',
    established: '2021',
    description: 'Authentic Haitian puff pastry patties — freshly baked daily.',
    interests: ['Promote products/services', 'Connect with other entrepreneurs'],
    exhibitor: 'Yes',
    electricity: 'No',
    directoryConsent: 'Yes',
    accommodations: '',
    signature: 'Bibi Augustin',
    dateSigned: '2026-06-11',
    checkedIn: false,
    checkedInAt: null,
    tableNumber: 7
  },
  {
    regId: 'HAC-2026-0003',
    bizName: 'HaCoNet - Haitian Community Network',
    ownerName: 'Marc Fequiere',
    title: 'Executive Director',
    address: '2020 Brice Rd., Suite 185',
    city: 'Reynoldsburg',
    state: 'OH',
    zip: '43068',
    phone: '614-600-5530',
    email: 'info@haconet.org',
    website: 'https://haconet.org',
    industry: 'Nonprofit',
    established: '2014',
    description: 'Empowering the Haitian community in Ohio through education and resource navigation.',
    interests: ['Meet community leaders', 'Explore partnerships'],
    exhibitor: 'No',
    electricity: 'No',
    directoryConsent: 'Yes',
    accommodations: '',
    signature: 'Marc Fequiere',
    dateSigned: '2026-06-12',
    checkedIn: true,
    checkedInAt: '5:15 PM',
    tableNumber: null
  }
];

// Supabase Configuration
const supabaseUrl = 'https://ntjbyhwnxlloytzsznio.supabase.co';
const supabaseKey = 'sb_publishable_Il4YPdgf9HIY37KIfhO32w_XDmUVdjm';
let supabaseClient = null;
let useSupabase = false;

// Global Data Arrays
let businesses = [];
let registrations = [];
let eventSettings = null;
let legalDocs = null;
let galleryPhotos = [];

try {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
  }
} catch (e) {
  console.warn("Supabase SDK failed to initialize. Falling back to local storage.", e);
}

// ==========================================================================
// 2. DOM Cache Elements
// ==========================================================================
// Scroll navigation
const header = document.getElementById('mainHeader');
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.getElementById('menuToggleBtn');
const navLinksList = document.getElementById('navLinksList');

// Countdown timer values
const daysVal = document.getElementById('daysVal');
const hoursVal = document.getElementById('hoursVal');
const minutesVal = document.getElementById('minutesVal');
const secondsVal = document.getElementById('secondsVal');

// Directory Elements
const directoryGrid = document.getElementById('directoryGrid');
const searchInput = document.getElementById('directorySearchInput');
const categoryPills = document.querySelectorAll('.category-pill');
const btnOpenAddBusiness = document.getElementById('btnOpenAddBusiness');

// Modal Elements
const businessProfileModal = document.getElementById('businessProfileModal');
const btnCloseProfileModal = document.getElementById('btnCloseProfileModal');

const addBusinessModal = document.getElementById('addBusinessModal');
const btnCloseAddBusiness = document.getElementById('btnCloseAddBusiness');
const addBusinessForm = document.getElementById('addBusinessForm');
const btnCancelAddBusiness = document.getElementById('btnCancelAddBusiness');

const ticketModal = document.getElementById('ticketModal');
const btnCloseTicketModal = document.getElementById('btnCloseTicketModal');
const btnDismissTicket = document.getElementById('btnDismissTicket');
const btnPrintTicket = document.getElementById('btnPrintTicket');
const btnGoogleCalendar = document.getElementById('btnGoogleCalendar');
const btnAppleCalendar = document.getElementById('btnAppleCalendar');

// Wizard Elements
const wizardCard = document.getElementById('registrationWizard');
const regForm = document.getElementById('eventRegistrationForm');
const formSteps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress-step');
const progressBarFill = document.getElementById('progressBarFill');

const btnPrevStep = document.getElementById('btnPrevStep');
const btnNextStep = document.getElementById('btnNextStep');
const btnSubmitForm = document.getElementById('btnSubmitForm');
const reviewSummaryContainer = document.getElementById('reviewSummaryContainer');
const regDateField = document.getElementById('regDate');

// Admin Elements
const adminDashboard = document.getElementById('adminDashboard');
const toggleAdminBtn = document.getElementById('toggleAdminBtn');
const adminTableBody = document.getElementById('adminAttendeeTableBody');
const btnExportCSV = document.getElementById('btnExportCSV');
const btnAdminLogout = document.getElementById('btnAdminLogout');

// Staff Login Modal Elements
const adminLoginModal = document.getElementById('adminLoginModal');
const btnCloseAdminLoginModal = document.getElementById('btnCloseAdminLoginModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminPasscodeField = document.getElementById('adminPasscodeField');
const adminLoginError = document.getElementById('adminLoginError');
const btnCancelAdminLogin = document.getElementById('btnCancelAdminLogin');

// Stats Counters
const statTotalRegistrations = document.getElementById('statTotalRegistrations');
const statTotalExhibitors = document.getElementById('statTotalExhibitors');
const statTotalElectricity = document.getElementById('statTotalElectricity');
const statTotalConsent = document.getElementById('statTotalConsent');
const statTotalCheckedIn = document.getElementById('statTotalCheckedIn');

// Check-in modal elements
const checkinAttendanceStatus = document.getElementById('checkinAttendanceStatus');
const btnConfirmCheckin = document.getElementById('btnConfirmCheckin');

// Navigation links inside directories
const sectorLinks = document.querySelectorAll('.footer-sector-link');

// Set active signature date automatically
const today = new Date();
if (regDateField) {
  regDateField.value = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
}

// Keep track of active filters
let currentCategory = 'all';
let searchQuery = '';

// Wizard Step Tracker
let currentStep = 1;

// Helper to map camelCase registration fields to lowercase database columns
function mapRegistrationToDb(reg) {
  return {
    regid: reg.regId,
    bizname: reg.bizName,
    ownername: reg.ownerName,
    title: reg.title,
    address: reg.address,
    city: reg.city,
    state: reg.state,
    zip: reg.zip,
    phone: reg.phone,
    email: reg.email,
    website: reg.website,
    industry: reg.industry,
    established: reg.established ? parseInt(reg.established) : null,
    description: reg.description,
    interests: typeof reg.interests === 'string' ? reg.interests : JSON.stringify(reg.interests || []),
    exhibitor: reg.exhibitor,
    electricity: reg.electricity,
    directoryconsent: reg.directoryConsent,
    accommodations: reg.accommodations,
    signature: reg.signature,
    datesigned: reg.dateSigned,
    checked_in: reg.checkedIn === true || reg.checkedIn === 'Yes',
    checked_in_at: reg.checkedInAt || null
  };
  
  if (reg.tableNumber !== undefined) {
    dbReg.table_number = reg.tableNumber;
  }
  
  if (reg.sponsorshipLevel !== undefined && reg.sponsorshipLevel !== 'None') {
    dbReg.sponsorship_level = reg.sponsorshipLevel;
  }
  
  return dbReg;
}

// Helper to map lowercase database columns to camelCase registration fields
function mapRegistrationFromDb(dbReg) {
  let interestsArray = [];
  if (dbReg.interests) {
    try {
      interestsArray = typeof dbReg.interests === 'string' ? JSON.parse(dbReg.interests) : dbReg.interests;
    } catch (e) {
      interestsArray = [];
    }
  }
  return {
    regId: dbReg.regid,
    bizName: dbReg.bizname,
    ownerName: dbReg.ownername,
    title: dbReg.title,
    address: dbReg.address,
    city: dbReg.city,
    state: dbReg.state,
    zip: dbReg.zip,
    phone: dbReg.phone,
    email: dbReg.email,
    website: dbReg.website,
    industry: dbReg.industry,
    established: dbReg.established,
    description: dbReg.description,
    interests: interestsArray,
    exhibitor: dbReg.exhibitor,
    electricity: dbReg.electricity,
    directoryConsent: dbReg.directoryconsent,
    accommodations: dbReg.accommodations,
    signature: dbReg.signature,
    dateSigned: dbReg.datesigned,
    checkedIn: dbReg.checked_in === true || dbReg.checked_in === 'Yes',
    checkedInAt: dbReg.checked_in_at || null,
    tableNumber: dbReg.table_number || null,
    sponsorshipLevel: dbReg.sponsorship_level || 'None'
  };
}

// ==========================================================================
// 3. Database Initialization & Seeding
// ==========================================================================
async function initDatabase() {
  console.log("Initializing HACONET database...");
  if (supabaseClient) {
    try {
      // 1. Fetch businesses
      let { data: bData, error: bError } = await supabaseClient.from('businesses').select('*');
      
      if (bError) {
        throw bError;
      }
      
      // Fetch Event Settings
      try {
        let { data: settsData, error: settsErr } = await supabaseClient.from('event_settings').select('*').limit(1);
        if (!settsErr && settsData && settsData.length > 0) {
          eventSettings = settsData[0];
          applyEventSettings(eventSettings);
        }
      } catch(e) { console.warn("Could not load event settings from DB", e); }

      // Fetch Legal Docs
      try {
        let { data: legData, error: legErr } = await supabaseClient.from('legal_docs').select('*').limit(1);
        if (!legErr && legData && legData.length > 0) {
          legalDocs = legData[0];
        }
      } catch(e) { console.warn("Could not load legal docs from DB", e); }

      // Fetch Gallery
      try {
        let { data: galData, error: galErr } = await supabaseClient.from('gallery').select('*').order('created_at', { ascending: false });
        if (!galErr && galData) {
          galleryPhotos = galData;
        }
      } catch(e) { console.warn("Could not load gallery from DB", e); }

      useSupabase = true;
      console.log("Connected to Supabase database successfully!");

      if (!bData || bData.length === 0) {
        // Table is empty, seed it
        console.log("Seeding businesses table...");
        const { error: seedError } = await supabaseClient.from('businesses').insert(SEED_BUSINESSES);
        if (seedError) console.error("Seeding businesses failed:", seedError);
        businesses = SEED_BUSINESSES;
      } else {
        // Filter out mock test listings
        const MOCK_BUSINESS_IDS = [
          'biz-1781579939672', // LDEXPRESS
          'biz-1781580234326', // STOREHOUSE FINANCE
          'biz-1781653915186', // LDEXPRESS 1
          'biz-1781654452628', // Haitian Business
          'biz-1781655336014'  // Test
        ];
        businesses = bData.filter(b => !MOCK_BUSINESS_IDS.includes(b.id));
      }

      // 2. Fetch registrations
      let { data: rData, error: rError } = await supabaseClient.from('registrations').select('*');
      if (!rError) {
        if (!rData || rData.length === 0) {
          console.log("Seeding registrations table...");
          const seededData = SEED_REGISTRATIONS.map(mapRegistrationToDb);
          const { error: seedError } = await supabaseClient.from('registrations').insert(seededData);
          if (seedError) console.error("Seeding registrations failed:", seedError);
          registrations = SEED_REGISTRATIONS;
        } else {
          registrations = rData.map(mapRegistrationFromDb);
        }
      } else {
        console.error("Fetching registrations failed:", rError);
        // Fallback list of registrations inside local storage if select failed
        try {
          const fallbackRegs = JSON.parse(safeGetItem('haconet_registrations'));
          registrations = Array.isArray(fallbackRegs) ? fallbackRegs : SEED_REGISTRATIONS;
        } catch (e) {
          registrations = SEED_REGISTRATIONS;
        }
      }
    } catch (err) {
      console.warn("Supabase connection succeeded but database operations failed (check table structures). Falling back to LocalStorage.", err);
      useSupabase = false;
      loadLocalStorageFallback();
    }
  } else {
    useSupabase = false;
    loadLocalStorageFallback();
  }
  
  // Render views after data loaded
  renderDirectory();
  renderExpoFloorPlan();
  if (adminDashboard && adminDashboard.style.display === 'block') {
    renderAdminAttendeeList();
  }
  
  // Check URL parameters for focus registration kiosk mode
  checkUrlParamsForFocusReg();

  // Check URL parameters for any ticket check-ins
  await checkUrlParamsForCheckin();
}

function loadLocalStorageFallback() {
  console.log("Using browser LocalStorage fallback.");
  
  // Safe parsing for businesses
  try {
    businesses = JSON.parse(safeGetItem('haconet_businesses'));
  } catch (e) {
    console.error("Corrupted businesses in localStorage, resetting...", e);
    businesses = null;
  }
  if (!businesses || !Array.isArray(businesses) || businesses.length === 0) {
    businesses = SEED_BUSINESSES;
    try {
      safeSetItem('haconet_businesses', JSON.stringify(businesses));
    } catch (e) {
      console.error("Failed to save businesses to localStorage:", e);
    }
  }

  // Safe parsing for registrations
  try {
    registrations = JSON.parse(safeGetItem('haconet_registrations'));
  } catch (e) {
    console.error("Corrupted registrations in localStorage, resetting...", e);
    registrations = null;
  }
  if (!registrations || !Array.isArray(registrations)) {
    registrations = SEED_REGISTRATIONS;
    try {
      safeSetItem('haconet_registrations', JSON.stringify(registrations));
    } catch (e) {
      console.error("Failed to save registrations to localStorage:", e);
    }
  }
}

// ==========================================================================
// 4. Navigation, Header Animations & SPA Hash Routing
// ==========================================================================
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// SPA Hash Routing handler
function navigateView(hash) {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Normalize hash (default to home if empty)
  let view = hash || '#home';
  if (view === '#') view = '#home';

  // If URL has ?register=true, force the view to be register
  if (urlParams.get('register') === 'true') {
    view = '#register';
    if (!document.body.classList.contains('focus-registration')) {
      document.body.classList.add('focus-registration');
    }
  }

  // Intercept registration hash to trigger focus registration mode
  if (view === '#register' && !document.body.classList.contains('focus-registration')) {
    setFocusRegistration(true);
    return;
  }

  // Ensure focus registration mode is exited if we go to another hash
  if (view !== '#register' && document.body.classList.contains('focus-registration')) {
    setFocusRegistration(false);
    return;
  }

  // Define main sections participating in routing
  const routedIds = ['home', 'about', 'sponsors', 'directory', 'event', 'testimonials-gallery', 'faq', 'inquiry', 'register'];

  // Add hidden-view to all routed sections
  routedIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden-view');
  });

  // Determine which sections to show based on the active view
  let activeIds = [];
  if (view === '#event') {
    // Meet & Greet view shows event details + photo gallery
    activeIds = ['event', 'testimonials-gallery'];
  } else if (view === '#register') {
    activeIds = ['register'];
  } else {
    // For other views, map the hash to the element ID
    const matchedId = view.substring(1);
    if (routedIds.includes(matchedId)) {
      activeIds = [matchedId];
    } else {
      // Fallback to home
      activeIds = ['home'];
      view = '#home';
    }
  }

  // Remove hidden-view from active sections
  activeIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden-view');
  });

  // Update navigation menu active states
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === view) {
      link.classList.add('active');
    }
  });

  // Reset page scroll position to top
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Bind routing listeners
window.addEventListener('hashchange', () => {
  navigateView(window.location.hash);
});

// Run SPA Routing immediately for the initial view to prevent layout flashing
navigateView(window.location.hash);

// Mobile menu toggle
if (menuToggle && navLinksList) {
  menuToggle.addEventListener('click', () => {
    navLinksList.classList.toggle('open');
    const icon = menuToggle.querySelector('i');
    if (navLinksList.classList.contains('open')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  // Close mobile menu on click nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksList.classList.remove('open');
      menuToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
  });
}

// Sector link filter click from footer
sectorLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    window.location.hash = '#directory';
    const cat = link.getAttribute('data-cat');
    const pill = Array.from(categoryPills).find(p => p.getAttribute('data-category') === cat);
    if (pill) {
      pill.click();
    }
  });
});

// ==========================================================================
// 5. Event Countdown Timer Clock
// ==========================================================================
// Set target event date: August 6th, 2026 at 5:00 PM EST (17:00:00)
let targetEventDate = new Date('August 6, 2026 17:00:00').getTime();

function updateCountdownClock() {
  if (!daysVal || !hoursVal || !minutesVal || !secondsVal) return;

  const now = new Date().getTime();
  const timeDifference = targetEventDate - now;

  if (timeDifference < 0) {
    daysVal.innerText = '00';
    hoursVal.innerText = '00';
    minutesVal.innerText = '00';
    secondsVal.innerText = '00';
    const clockTitle = document.getElementById('countdownCardTitle');
    if (clockTitle) clockTitle.innerText = "Event is underway!";
    return;
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const msPerHour = 1000 * 60 * 60;
  const msPerMinute = 1000 * 60;
  const msPerSecond = 1000;

  const days = Math.floor(timeDifference / msPerDay);
  const hours = Math.floor((timeDifference % msPerDay) / msPerHour);
  const minutes = Math.floor((timeDifference % msPerHour) / msPerMinute);
  const seconds = Math.floor((timeDifference % msPerMinute) / msPerSecond);

  daysVal.innerText = String(days).padStart(2, '0');
  hoursVal.innerText = String(hours).padStart(2, '0');
  minutesVal.innerText = String(minutes).padStart(2, '0');
  secondsVal.innerText = String(seconds).padStart(2, '0');
}

// Initialize clock and update every 1 second
if (daysVal) {
  updateCountdownClock();
  setInterval(updateCountdownClock, 1000);
}

// ==========================================================================
// 6. Business Directory Manager (Search, Filter, Rendering)
// ==========================================================================
function renderDirectory() {
  if (!directoryGrid) return;
  directoryGrid.innerHTML = '';
  
  const isSearchEmpty = searchQuery.toLowerCase().trim() === '';
  const isCategoryAll = currentCategory === 'all';
  
  if (isSearchEmpty && isCategoryAll) {
    directoryGrid.innerHTML = `
      <div class="directory-placeholder" id="directorySearchPlaceholder" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--text-secondary); max-width: 600px; margin: 0 auto;">
        <i class="fa-solid fa-magnifying-glass-location" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 1.5rem; display: block; opacity: 0.8;"></i>
        <h3 class="serif-font" style="font-size: 1.5rem; margin-bottom: 0.75rem; color: #fff;">Search HACONET Directory</h3>
        <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.5;">
          Type in the search bar above or select an industry category below to explore Haitian-owned businesses in the Greater Columbus area.
        </p>
      </div>
    `;
    return;
  }
  
  // Apply combined filters
  const filtered = businesses.filter(biz => {
    const matchesCategory = currentCategory === 'all' || biz.category === currentCategory;
    
    const term = searchQuery.toLowerCase().trim();
    
    // Null-safe values for matching
    const nameVal = (biz.name || '').toLowerCase();
    const ownerVal = (biz.owner || '').toLowerCase();
    const descVal = (biz.description || '').toLowerCase();
    const catVal = (biz.category || '').toLowerCase();
    const addrVal = (biz.address || '').toLowerCase();

    const matchesSearch = term === '' || 
      nameVal.includes(term) ||
      ownerVal.includes(term) ||
      descVal.includes(term) ||
      catVal.includes(term) ||
      addrVal.includes(term);
      
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    directoryGrid.innerHTML = `
      <div class="no-results" id="noResultsAlert">
        <i class="fa-solid fa-store-slash"></i>
        <h3>No Businesses Found</h3>
        <p>No businesses matched your filter criteria. Be the first to register or list yours!</p>
      </div>
    `;
    return;
  }

  filtered.forEach(biz => {
    const card = document.createElement('div');
    card.className = 'biz-card';
    card.id = `bizCard-${biz.id || (biz.name || '').replace(/\s+/g, '-').toLowerCase()}`;
    
    const webButton = biz.website 
      ? `<a href="${biz.website}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" id="btnWeb-${biz.id}"><i class="fa-solid fa-globe"></i> Website</a>`
      : '';

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
        <span class="biz-cat-tag">${biz.category || 'Other'}</span>
        ${biz.sponsorship_level && biz.sponsorship_level !== 'None' ? `<span class="sponsor-badge sponsor-${biz.sponsorship_level.toLowerCase()}"><i class="fa-solid fa-star"></i> ${biz.sponsorship_level}</span>` : ''}
      </div>
      <h3 class="biz-title serif-font">${biz.name || 'Untitled Business'}</h3>
      <div class="biz-owner"><i class="fa-solid fa-user-tie"></i> ${biz.owner || 'Representative'}</div>
      <p class="biz-desc">${biz.description || ''}</p>
      <div class="biz-contact-info">
        <div class="biz-contact-item"><i class="fa-solid fa-phone"></i> <span>${biz.phone || ''}</span></div>
        <div class="biz-contact-item"><i class="fa-solid fa-envelope"></i> <span>${biz.email || ''}</span></div>
        ${biz.address ? `<div class="biz-contact-item"><i class="fa-solid fa-location-dot"></i> <span>${biz.address}</span></div>` : ''}
      </div>
      <div class="biz-actions">
        <button class="btn btn-primary btn-sm btn-view-profile" data-id="${biz.id}" id="btnProfile-${biz.id}">
          <i class="fa-solid fa-circle-info"></i> Profile
        </button>
        ${webButton}
      </div>
    `;
    directoryGrid.appendChild(card);
  });

  // Attach event listeners to profile buttons
  const profileBtns = directoryGrid.querySelectorAll('.btn-view-profile');
  profileBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const biz = businesses.find(b => b.id === id);
      if (biz) openProfileModal(biz);
    });
  });
}

// Search input keypress
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderDirectory();
  });
}

// Category pills clicks
categoryPills.forEach(pill => {
  pill.addEventListener('click', () => {
    categoryPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentCategory = pill.getAttribute('data-category');
    renderDirectory();
  });
});

// ==========================================================================
// 7. Business Profile Details Modal
// ==========================================================================
function openProfileModal(biz) {
  if (!businessProfileModal) return;

  document.getElementById('pCategory').innerText = biz.category || 'Other';
  document.getElementById('pBusinessName').innerText = biz.name || 'Business Profile';
  document.getElementById('pOwner').innerText = biz.owner || 'N/A';
  document.getElementById('pOwnerTitle').innerText = biz.title ? `(${biz.title})` : '';
  document.getElementById('pYearEstablished').innerText = biz.established || 'N/A';
  document.getElementById('pDescription').innerText = biz.description || '';
  document.getElementById('pPhone').innerText = biz.phone || '';
  document.getElementById('pEmail').innerText = biz.email || '';
  
  const pWeb = document.getElementById('pWebsite');
  if (biz.website) {
    pWeb.href = biz.website;
    pWeb.innerText = biz.website;
    pWeb.parentElement.style.display = 'flex';
  } else {
    pWeb.parentElement.style.display = 'none';
  }

  document.getElementById('pAddress').innerText = biz.address || 'Columbus, OH';

  // Networking interests block
  const interestsBlock = document.getElementById('pInterestsBlock');
  const interestsList = document.getElementById('pInterestsList');
  if (interestsList) {
    interestsList.innerHTML = '';
    
    let interestArray = [];
    if (biz.interests) {
      try {
        interestArray = typeof biz.interests === 'string' ? JSON.parse(biz.interests) : biz.interests;
      } catch (e) {
        interestArray = [];
      }
    }
    
    if (interestArray && Array.isArray(interestArray) && interestArray.length > 0) {
      if (interestsBlock) interestsBlock.style.display = 'block';
      interestArray.forEach(interest => {
        const tag = document.createElement('span');
        tag.className = 'p-interest-tag';
        tag.innerText = interest;
        interestsList.appendChild(tag);
      });
    } else {
      if (interestsBlock) interestsBlock.style.display = 'none';
    }
  }

  // Set up vCard download click listener
  const btnDownloadVCard = document.getElementById('btnDownloadVCard');
  if (btnDownloadVCard) {
    const newBtn = btnDownloadVCard.cloneNode(true);
    btnDownloadVCard.parentNode.replaceChild(newBtn, btnDownloadVCard);
    newBtn.addEventListener('click', () => {
      downloadVCard(
        biz.name,
        biz.owner,
        biz.phone,
        biz.email,
        biz.website,
        biz.title,
        biz.category
      );
    });
  }

  businessProfileModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

if (btnCloseProfileModal) {
  btnCloseProfileModal.addEventListener('click', () => {
    businessProfileModal.classList.remove('open');
    document.body.style.overflow = '';
  });
}

if (businessProfileModal) {
  businessProfileModal.addEventListener('click', (e) => {
    if (e.target === businessProfileModal) {
      businessProfileModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ==========================================================================
// 8. Add Business intake form Modal
// ==========================================================================
if (btnOpenAddBusiness) {
  btnOpenAddBusiness.addEventListener('click', () => {
    if (addBusinessModal) {
      addBusinessModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
}

function closeAddBusinessModal() {
  if (!addBusinessModal) return;
  addBusinessModal.classList.remove('open');
  document.body.style.overflow = '';
  if (addBusinessForm) {
    addBusinessForm.reset();
    addBusinessForm.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
    addBusinessForm.querySelectorAll('.form-error-msg').forEach(el => el.style.display = 'none');
  }
}

if (btnCloseAddBusiness) btnCloseAddBusiness.addEventListener('click', closeAddBusinessModal);
if (btnCancelAddBusiness) btnCancelAddBusiness.addEventListener('click', closeAddBusinessModal);

if (addBusinessModal) {
  addBusinessModal.addEventListener('click', (e) => {
    if (e.target === addBusinessModal) closeAddBusinessModal();
  });
}

if (addBusinessForm) {
  addBusinessForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Validation checks
    const nameVal = document.getElementById('addBizName');
    const ownerVal = document.getElementById('addOwnerName');
    const industryVal = document.getElementById('addIndustry');
    const phoneVal = document.getElementById('addPhone');
    const emailVal = document.getElementById('addEmail');
    const descVal = document.getElementById('addDescription');
    
    if (!nameVal || nameVal.value.trim() === '') {
      if (nameVal) nameVal.classList.add('error');
      const err = document.getElementById('addErrBizName');
      if (err) err.style.display = 'block';
      isValid = false;
    } else {
      nameVal.classList.remove('error');
      const err = document.getElementById('addErrBizName');
      if (err) err.style.display = 'none';
    }

    if (!ownerVal || ownerVal.value.trim() === '') {
      if (ownerVal) ownerVal.classList.add('error');
      const err = document.getElementById('addErrOwnerName');
      if (err) err.style.display = 'block';
      isValid = false;
    } else {
      ownerVal.classList.remove('error');
      const err = document.getElementById('addErrOwnerName');
      if (err) err.style.display = 'none';
    }

    if (!industryVal || industryVal.value === '') {
      if (industryVal) industryVal.classList.add('error');
      const err = document.getElementById('addErrIndustry');
      if (err) err.style.display = 'block';
      isValid = false;
    } else {
      industryVal.classList.remove('error');
      const err = document.getElementById('addErrIndustry');
      if (err) err.style.display = 'none';
    }

    if (!phoneVal || phoneVal.value.trim() === '') {
      if (phoneVal) phoneVal.classList.add('error');
      const err = document.getElementById('addErrPhone');
      if (err) err.style.display = 'block';
      isValid = false;
    } else {
      phoneVal.classList.remove('error');
      const err = document.getElementById('addErrPhone');
      if (err) err.style.display = 'none';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailPattern.test(emailVal.value.trim())) {
      if (emailVal) emailVal.classList.add('error');
      const err = document.getElementById('addErrEmail');
      if (err) err.style.display = 'block';
      isValid = false;
    } else {
      emailVal.classList.remove('error');
      const err = document.getElementById('addErrEmail');
      if (err) err.style.display = 'none';
    }

    if (!descVal || descVal.value.trim() === '') {
      if (descVal) descVal.classList.add('error');
      const err = document.getElementById('addErrDesc');
      if (err) err.style.display = 'block';
      isValid = false;
    } else {
      descVal.classList.remove('error');
      const err = document.getElementById('addErrDesc');
      if (err) err.style.display = 'none';
    }

    if (!isValid) {
      const cardBox = document.getElementById('addBusinessModalBox');
      if (cardBox) {
        cardBox.classList.add('animate-shake');
        setTimeout(() => cardBox.classList.remove('animate-shake'), 400);
      }
      return;
    }

    // Construct new listing
    const newBiz = {
      id: `biz-${Date.now()}`,
      name: nameVal.value.trim(),
      owner: ownerVal.value.trim(),
      title: "Owner",
      category: industryVal.value,
      phone: phoneVal.value.trim(),
      email: emailVal.value.trim(),
      website: (document.getElementById('addWebsite') ? document.getElementById('addWebsite').value.trim() : "") || "",
      address: (document.getElementById('addAddress') ? document.getElementById('addAddress').value.trim() : "") || "",
      established: today.getFullYear(),
      description: descVal.value.trim(),
      interests: []
    };

    // Submit to Supabase if connected
    if (useSupabase) {
      const { error } = await supabaseClient.from('businesses').insert([newBiz]);
      if (error) {
        console.error("Supabase write failed:", error);
        alert("Failed to write to database: " + error.message);
        return;
      }
    }

    businesses.push(newBiz);
    if (!useSupabase) {
      safeSetItem('haconet_businesses', JSON.stringify(businesses));
    }
    
    closeAddBusinessModal();
    renderDirectory();
    alert("Success! Your business has been submitted to the HACONET directory.");
  });
}

// Add visual focus class changes to Custom radio/checkbox cards
document.querySelectorAll('.check-item input').forEach(input => {
  input.addEventListener('change', () => {
    const parent = input.closest('.check-item');
    if (input.type === 'radio') {
      const groupName = input.name;
      document.querySelectorAll(`input[name="${groupName}"]`).forEach(rad => {
        rad.closest('.check-item').classList.remove('selected');
      });
    }
    
    if (input.checked) {
      parent.classList.add('selected');
    } else {
      parent.classList.remove('selected');
    }
  });
});

// Ensure checkboxes load correctly if checked by default on page boot
document.querySelectorAll('.check-item input').forEach(input => {
  if (input.checked) {
    const parent = input.closest('.check-item');
    if (parent) parent.classList.add('selected');
  }
});

// ==========================================================================
// 9. Multi-step Wizard Event Registration Flow
// ==========================================================================
function updateWizardProgress() {
  if (!progressBarFill) return;

  // Update step visibility
  formSteps.forEach(step => {
    step.classList.remove('active');
    if (parseInt(step.getAttribute('data-step')) === currentStep) {
      step.classList.add('active');
    }
  });

  // Update progress steps
  progressSteps.forEach(step => {
    const stepNum = parseInt(step.getAttribute('data-step'));
    step.classList.remove('active', 'completed');
    
    if (stepNum < currentStep) {
      step.classList.add('completed');
    } else if (stepNum === currentStep) {
      step.classList.add('active');
    }
  });

  // Progress Bar Width
  const progressPercentage = ((currentStep - 1) / (progressSteps.length - 1)) * 100;
  progressBarFill.style.width = `${progressPercentage}%`;

  // Wizard Nav Button visibility
  if (btnPrevStep) {
    if (currentStep === 1) {
      btnPrevStep.style.visibility = 'hidden';
    } else {
      btnPrevStep.style.visibility = 'visible';
    }
  }

  if (btnNextStep && btnSubmitForm) {
    if (currentStep === progressSteps.length) {
      btnNextStep.style.display = 'none';
      btnSubmitForm.style.display = 'inline-flex';
      compileSummaryReview();
    } else {
      btnNextStep.style.display = 'inline-flex';
      btnSubmitForm.style.display = 'none';
    }
  }
}

// Validate fields of the active step
function validateWizardStep(step) {
  let stepValid = true;

  if (step === 1) {
    const bizName = document.getElementById('regBizName');
    const ownerName = document.getElementById('regOwnerName');
    const phone = document.getElementById('regPhone');
    const email = document.getElementById('regEmail');

    if (bizName && bizName.value.trim() === '') {
      bizName.classList.add('error');
      const err = document.getElementById('errBizName');
      if (err) err.style.display = 'block';
      stepValid = false;
    } else if (bizName) {
      bizName.classList.remove('error');
      const err = document.getElementById('errBizName');
      if (err) err.style.display = 'none';
    }

    if (ownerName && ownerName.value.trim() === '') {
      ownerName.classList.add('error');
      const err = document.getElementById('errOwnerName');
      if (err) err.style.display = 'block';
      stepValid = false;
    } else if (ownerName) {
      ownerName.classList.remove('error');
      const err = document.getElementById('errOwnerName');
      if (err) err.style.display = 'none';
    }

    if (phone && phone.value.trim() === '') {
      phone.classList.add('error');
      const err = document.getElementById('errPhone');
      if (err) err.style.display = 'block';
      stepValid = false;
    } else if (phone) {
      phone.classList.remove('error');
      const err = document.getElementById('errPhone');
      if (err) err.style.display = 'none';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email.value.trim())) {
      email.classList.add('error');
      const err = document.getElementById('errEmail');
      if (err) err.style.display = 'block';
      stepValid = false;
    } else if (email) {
      email.classList.remove('error');
      const err = document.getElementById('errEmail');
      if (err) err.style.display = 'none';
    }
  } 
  
  else if (step === 2) {
    const industry = document.getElementById('regIndustry');
    if (industry && industry.value === '') {
      industry.classList.add('error');
      const err = document.getElementById('errIndustry');
      if (err) err.style.display = 'block';
      stepValid = false;
    } else if (industry) {
      industry.classList.remove('error');
      const err = document.getElementById('errIndustry');
      if (err) err.style.display = 'none';
    }
  }

  else if (step === 4) {
    const signature = document.getElementById('regSignature');
    if (signature && signature.value.trim() === '') {
      signature.classList.add('error');
      const err = document.getElementById('errSignature');
      if (err) err.style.display = 'block';
      stepValid = false;
    } else if (signature) {
      signature.classList.remove('error');
      const err = document.getElementById('errSignature');
      if (err) err.style.display = 'none';
    }
  }

  return stepValid;
}

// Compile information to review page
function compileSummaryReview() {
  if (!reviewSummaryContainer) return;

  const bizName = document.getElementById('regBizName') ? document.getElementById('regBizName').value : '';
  const ownerName = document.getElementById('regOwnerName') ? document.getElementById('regOwnerName').value : '';
  const title = (document.getElementById('regTitle') && document.getElementById('regTitle').value) || 'Owner';
  const phone = document.getElementById('regPhone') ? document.getElementById('regPhone').value : '';
  const email = document.getElementById('regEmail') ? document.getElementById('regEmail').value : '';
  const industry = document.getElementById('regIndustry') ? document.getElementById('regIndustry').value : '';
  
  const interests = [];
  document.querySelectorAll('input[name="regInterests"]:checked').forEach(c => {
    interests.push(c.value);
  });
  const interestsText = interests.length > 0 ? interests.join(', ') : 'None selected';
  
  const exhibitorEl = document.querySelector('input[name="regExhibitor"]:checked');
  const exhibitor = exhibitorEl ? exhibitorEl.value : 'No';

  const electricityEl = document.querySelector('input[name="regElectricity"]:checked');
  const electricity = electricityEl ? electricityEl.value : 'No';

  const consentEl = document.getElementById('regDirectoryConsent');
  const directoryConsent = consentEl && consentEl.checked ? 'Yes' : 'No';

  const sponsorEl = document.getElementById('regSponsorship');
  const sponsorshipLevel = sponsorEl ? sponsorEl.value : 'None';

  reviewSummaryContainer.innerHTML = `
    <div class="summary-block" id="summaryBlockBiz">
      <h5 class="summary-title">Business Profile Summary</h5>
      <div class="summary-grid">
        <span class="summary-lbl">Business:</span>
        <span class="summary-val"><strong>${bizName}</strong> (${industry})</span>
        
        <span class="summary-lbl">Owner/Rep:</span>
        <span class="summary-val">${ownerName} (${title})</span>
        
        <span class="summary-lbl">Contact:</span>
        <span class="summary-val">${phone} &bull; ${email}</span>
      </div>
    </div>
    
    <div class="summary-block" id="summaryBlockExhibitor">
      <h5 class="summary-title">Event Operations Setup</h5>
      <div class="summary-grid">
        <span class="summary-lbl">Exhibitor:</span>
        <span class="summary-val">${exhibitor === 'Yes' ? 'Yes, requests display table' : 'No display table requested'}</span>
        
        <span class="summary-lbl">Electricity:</span>
        <span class="summary-val">${electricity === 'Yes' ? 'Required' : 'Not required'}</span>
        
        <span class="summary-lbl">Sponsor:</span>
        <span class="summary-val">${sponsorshipLevel !== 'None' ? sponsorshipLevel + ' Sponsor' : 'Standard Registration'}</span>
        
        <span class="summary-lbl">Consented:</span>
        <span class="summary-val">${directoryConsent === 'Yes' ? 'Yes, list business details in directory booklet' : 'No directory consent'}</span>
        
        <div class="summary-item-full">
          <strong>Networking Interests:</strong><br>
          <span style="font-size: 0.85rem; color: var(--text-secondary);">${interestsText}</span>
        </div>
      </div>
    </div>
  `;
}

// Next Step Click handler
if (btnNextStep) {
  btnNextStep.addEventListener('click', () => {
    console.log("Next button clicked. Current step:", currentStep);
    const isValid = validateWizardStep(currentStep);
    console.log("Validation result for step", currentStep, "is", isValid);

    if (isValid) {
      currentStep++;
      updateWizardProgress();
      console.log("Incremented to step", currentStep);
    } else {
      console.warn("Validation failed for step", currentStep);
      
      // Build feedback message for Step 1
      if (currentStep === 1) {
        let missingFields = [];
        const biz = document.getElementById('regBizName');
        const owner = document.getElementById('regOwnerName');
        const tel = document.getElementById('regPhone');
        const mail = document.getElementById('regEmail');

        if (biz && biz.value.trim() === '') missingFields.push("Business Name");
        if (owner && owner.value.trim() === '') missingFields.push("Business Owner/Representative");
        if (tel && tel.value.trim() === '') missingFields.push("Phone Number");
        
        if (mail) {
          const emailVal = mail.value.trim();
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailVal === '') {
            missingFields.push("Email Address");
          } else if (!emailPattern.test(emailVal)) {
            missingFields.push("Email Address (Invalid format - must contain @ and .com/etc)");
          }
        }
        
        if (missingFields.length > 0) {
          alert("Please check Step 1 fields:\n- " + missingFields.join("\n- "));
        }
      }
      
      if (wizardCard) {
        wizardCard.classList.add('animate-shake');
        setTimeout(() => wizardCard.classList.remove('animate-shake'), 400);
      }
    }
  });
}

// Previous Step Click handler
if (btnPrevStep) {
  btnPrevStep.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateWizardProgress();
    }
  });
}

// Registration Form Submission Handler
if (regForm) {
  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateWizardStep(4)) {
      if (wizardCard) {
        wizardCard.classList.add('animate-shake');
        setTimeout(() => wizardCard.classList.remove('animate-shake'), 400);
      }
      alert("Please provide your digital signature (Type Full Name) to submit the registration.");
      return;
    }

    // Construct registration object
    const bizName = document.getElementById('regBizName').value.trim();
    const ownerName = document.getElementById('regOwnerName').value.trim();
    const title = document.getElementById('regTitle') ? document.getElementById('regTitle').value.trim() : '';
    const address = document.getElementById('regAddress') ? document.getElementById('regAddress').value.trim() : '';
    const city = (document.getElementById('regCity') && document.getElementById('regCity').value.trim()) || "Columbus";
    const state = (document.getElementById('regState') && document.getElementById('regState').value.trim()) || "OH";
    const zip = document.getElementById('regZip') ? document.getElementById('regZip').value.trim() : '';
    const phone = document.getElementById('regPhone').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const website = document.getElementById('regWebsite') ? document.getElementById('regWebsite').value.trim() : '';
    const industry = document.getElementById('regIndustry').value;
    const established = (document.getElementById('regYearEst') && document.getElementById('regYearEst').value) || today.getFullYear();
    const description = (document.getElementById('regDescription') && document.getElementById('regDescription').value.trim()) || "No description provided.";
    
    const interests = [];
    document.querySelectorAll('input[name="regInterests"]:checked').forEach(c => {
      interests.push(c.value);
    });

    const exhibitorEl = document.querySelector('input[name="regExhibitor"]:checked');
    const exhibitor = exhibitorEl ? exhibitorEl.value : 'No';

    const electricityEl = document.querySelector('input[name="regElectricity"]:checked');
    const electricity = electricityEl ? electricityEl.value : 'No';

    const consentEl = document.getElementById('regDirectoryConsent');
    const directoryConsent = consentEl && consentEl.checked ? 'Yes' : 'No';

    const sponsorEl = document.getElementById('regSponsorship');
    const sponsorshipLevel = sponsorEl ? sponsorEl.value : 'None';

    const accommodations = document.getElementById('regAccommodations') ? document.getElementById('regAccommodations').value.trim() : '';
    const signature = document.getElementById('regSignature').value.trim();

    // Generate Unique Registration ID
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const regId = `HAC-2026-${randNum}`;

    const newRegistration = {
      regId,
      bizName,
      ownerName,
      title,
      address,
      city,
      state,
      zip,
      phone,
      email,
      website,
      industry,
      established,
      description,
      interests,
      exhibitor,
      electricity,
      directoryConsent,
      sponsorshipLevel,
      accommodations,
      signature,
      dateSigned: regDateField ? regDateField.value : '',
      checkedIn: false,
      checkedInAt: null
    };

    // 1. Add to Registrations Table in database
    if (useSupabase) {
      const dbRegistration = mapRegistrationToDb(newRegistration);
      const { error } = await supabaseClient.from('registrations').insert([dbRegistration]);
      if (error) {
        console.error("Supabase write failed:", error);
        alert("Failed to submit registration: " + error.message);
        return;
      }
    }

    registrations.push(newRegistration);
    if (!useSupabase) {
      safeSetItem('haconet_registrations', JSON.stringify(registrations));
    }

    // 2. Add to Public Directory if Consent given and doesn't already exist
    if (directoryConsent === 'Yes') {
      const exists = businesses.some(b => b.name && b.name.toLowerCase() === bizName.toLowerCase());
      if (!exists) {
        const newBizEntry = {
          id: `biz-${Date.now()}`,
          name: bizName,
          owner: ownerName,
          title: title || "Representative",
          category: industry,
          phone: phone,
          email: email,
          website: website,
          address: address ? `${address}, ${city}, ${state} ${zip}` : `${city}, ${state}`,
          established: parseInt(established),
          description: description,
          interests: interests,
          sponsorship_level: sponsorshipLevel
        };

        if (useSupabase) {
          const { error } = await supabaseClient.from('businesses').insert([newBizEntry]);
          if (error) {
            console.error("Directory sync write to Supabase failed:", error);
          }
        }

        businesses.push(newBizEntry);
        if (!useSupabase) {
          safeSetItem('haconet_businesses', JSON.stringify(businesses));
        }
        renderDirectory();
      }
    }

    // 3. Reset form states
    regForm.reset();
    currentStep = 1;
    updateWizardProgress();
    
    // Uncheck selects
    document.querySelectorAll('.check-item').forEach(c => c.classList.remove('selected'));
    // Set date field again
    if (regDateField) {
      regDateField.value = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
    }

    // 4. Open Ticket Modal
    renderTicketStub(newRegistration);
  });
}

// Render dynamic elements of the printable registration ticket badge
function renderTicketStub(reg) {
  if (!ticketModal) return;

  const tRegId = document.getElementById('tRegId');
  const tBizName = document.getElementById('tBizName');
  const tOwner = document.getElementById('tOwner');
  const tIndustry = document.getElementById('tIndustry');
  const tExhibitor = document.getElementById('tExhibitor');
  const tPower = document.getElementById('tPower');

  if (tRegId) tRegId.innerText = reg.regId;
  if (tBizName) tBizName.innerText = reg.bizName;
  if (tOwner) tOwner.innerText = reg.ownerName;
  if (tIndustry) tIndustry.innerText = reg.industry;
  if (tExhibitor) tExhibitor.innerText = reg.exhibitor === 'Yes' ? 'YES (Display Table)' : 'NO (General Entry)';
  if (tPower) {
    tPower.innerText = reg.exhibitor === 'Yes' 
      ? (reg.electricity === 'Yes' ? 'Electricity Required' : 'Electricity Not Needed')
      : 'Not Applicable';
  }

  const tQrCodeImg = document.getElementById('tQrCodeImg');
  const tQrCodeLink = document.getElementById('tQrCodeLink');
  if (tQrCodeImg) {
    const checkinUrl = `${window.location.origin}${window.location.pathname}?checkin=${encodeURIComponent(reg.regId)}`;
    tQrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(checkinUrl)}`;
    if (tQrCodeLink) {
      tQrCodeLink.href = checkinUrl;
    }
  }

  if (tExhibitor) {
    if (reg.exhibitor === 'Yes') {
      tExhibitor.className = 't-info-val highlight';
      tExhibitor.style.color = 'var(--accent-red)';
    } else {
      tExhibitor.className = 't-info-val';
      tExhibitor.style.color = '#030812';
    }
  }

  // Set up vCard download trigger inside Ticket Modal
  const btnTicketVCard = document.getElementById('btnTicketVCard');
  if (btnTicketVCard) {
    if (reg.bizName && reg.bizName.trim() !== '') {
      btnTicketVCard.style.display = 'block';
      const newBtn = btnTicketVCard.cloneNode(true);
      btnTicketVCard.parentNode.replaceChild(newBtn, btnTicketVCard);
      newBtn.addEventListener('click', () => {
        downloadVCard(
          reg.bizName,
          reg.ownerName,
          reg.phone,
          reg.email,
          reg.website,
          reg.title,
          reg.industry
        );
      });
    } else {
      btnTicketVCard.style.display = 'none';
    }
  }

  // Open the Modal
  ticketModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  ticketModal.scrollTop = 0;
  
  // Synchronize admin table if active
  if (adminDashboard && adminDashboard.style.display === 'block') {
    renderAdminAttendeeList();
  }
}

// Close Ticket modal buttons
if (btnDismissTicket) {
  btnDismissTicket.addEventListener('click', () => {
    ticketModal.classList.remove('open');
    document.body.style.overflow = '';
  });
}

if (btnCloseTicketModal) {
  btnCloseTicketModal.addEventListener('click', () => {
    ticketModal.classList.remove('open');
    document.body.style.overflow = '';
  });
}

// Print ticket handler
if (btnPrintTicket) {
  btnPrintTicket.addEventListener('click', () => {
    window.print();
  });
}

// Add to Calendar Handlers
const eventTitle = encodeURIComponent("HACONET Business Meet & Greet");
const eventDetails = encodeURIComponent("Annual Networking Event for Haitian-owned businesses. Present your ticket stub at the entrance.");
const eventLocation = encodeURIComponent("Gillie Community Center, 2100 Morse Rd, Columbus, OH 43229");

// Thursday, Aug 6, 2026, 5:00 PM - 9:00 PM EST is UTC 21:00 to 01:00 (+1 day)
const googleDates = "20260806T210000Z/20260807T010000Z";

if (btnGoogleCalendar) {
  btnGoogleCalendar.addEventListener('click', () => {
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}&location=${eventLocation}&dates=${googleDates}`;
    window.open(url, '_blank');
  });
}

if (btnAppleCalendar) {
  btnAppleCalendar.addEventListener('click', () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20260806T210000Z
DTEND:20260807T010000Z
SUMMARY:HACONET Business Meet & Greet
DESCRIPTION:Annual Networking Event for Haitian-owned businesses.
LOCATION:Gillie Community Center, 2100 Morse Rd, Columbus, OH 43229
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'haconet_expo_2026.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// ==========================================================================
// 10. Staff Administration Portal Logic
// ==========================================================================
function renderAdminAttendeeList() {
  if (!adminTableBody) return;
  adminTableBody.innerHTML = '';
  
  let totalEx = 0;
  let totalElec = 0;
  let totalDir = 0;
  let totalChecked = 0;

  if (registrations.length === 0) {
    adminTableBody.innerHTML = `
      <tr>
        <td colspan="12" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          No registrations recorded yet.
        </td>
      </tr>
    `;
    
    // Update stats counters
    if (statTotalRegistrations) statTotalRegistrations.innerText = '0';
    if (statTotalExhibitors) statTotalExhibitors.innerText = '0';
    if (statTotalElectricity) statTotalElectricity.innerText = '0';
    if (statTotalConsent) statTotalConsent.innerText = '0';
    if (statTotalCheckedIn) statTotalCheckedIn.innerText = '0';
    return;
  }

  registrations.forEach(reg => {
    // Stats calculation
    if (reg.exhibitor === 'Yes') totalEx++;
    if (reg.electricity === 'Yes') totalElec++;
    if (reg.directoryConsent === 'Yes') totalDir++;
    
    const isCheckedIn = reg.checkedIn === true || reg.checkedIn === 'Yes';
    if (isCheckedIn) totalChecked++;

    // Safe lowercasing
    const exhibitorClass = (reg.exhibitor || 'no').toLowerCase();
    const electricityClass = (reg.electricity || 'no').toLowerCase();
    const consentClass = (reg.directoryConsent || 'no').toLowerCase();
    
    const checkedInBadge = isCheckedIn
      ? `<span class="badge-status yes" title="Checked In at ${reg.checkedInAt || ''}"><i class="fa-solid fa-check"></i> Yes</span>`
      : `<span class="badge-status no">No</span>`;
      
    const checkinActionBtn = isCheckedIn
      ? `<button class="admin-action-btn btn-checkin-attendee disabled" style="opacity: 0.5; cursor: not-allowed;" title="Already Checked In"><i class="fa-solid fa-user-check"></i></button>`
      : `<button class="admin-action-btn btn-checkin-attendee" data-id="${reg.regId}" style="border-color: #2ecc71; color: #2ecc71;" title="Confirm Attendance"><i class="fa-solid fa-user-plus"></i></button>`;

    // Booth assignment selector dropdown
    let boothSelectHtml = `<span style="color: var(--text-muted);">N/A</span>`;
    if (reg.exhibitor === 'Yes') {
      boothSelectHtml = `<select class="admin-booth-select" data-id="${reg.regId}" style="background:var(--bg-input); border:1px solid var(--border-color); color:#fff; border-radius:4px; padding:2px 4px; font-size:0.85rem;">
        <option value="">None</option>
        ${Array.from({length: 20}, (_, i) => i + 1).map(num => `
          <option value="${num}" ${parseInt(reg.tableNumber) === num ? 'selected' : ''}>Table ${String(num).padStart(2, '0')}</option>
        `).join('')}
      </select>`;
    }

    const row = document.createElement('tr');
    row.id = `adminRow-${reg.regId}`;
    row.innerHTML = `
      <td><strong>${reg.regId}</strong></td>
      <td>${reg.bizName || ''}</td>
      <td>${reg.ownerName || ''}</td>
      <td>${reg.phone || ''}</td>
      <td>${reg.email || ''}</td>
      <td>${reg.industry || ''}</td>
      <td><span class="badge-status ${exhibitorClass}">${reg.exhibitor || 'No'}</span></td>
      <td>${boothSelectHtml}</td>
      <td><span class="badge-status ${electricityClass}">${reg.electricity || 'No'}</span></td>
      <td><span class="badge-status ${consentClass}">${reg.directoryConsent || 'No'}</span></td>
      <td>${checkedInBadge}</td>
      <td style="display: flex; gap: 0.4rem; align-items: center;">
        <button class="admin-action-btn btn-view-reg-ticket" data-id="${reg.regId}" title="View Ticket"><i class="fa-solid fa-ticket"></i></button>
        <button class="admin-action-btn btn-print-badge" data-id="${reg.regId}" title="Print Badge" style="border-color: var(--accent-gold); color: var(--accent-gold);"><i class="fa-solid fa-id-badge"></i></button>
        ${checkinActionBtn}
        <button class="admin-action-btn btn-delete-reg" data-id="${reg.regId}" title="Delete Registration"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    adminTableBody.appendChild(row);
  });

  // Attach button event listeners
  adminTableBody.querySelectorAll('.btn-view-reg-ticket').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const reg = registrations.find(r => r.regId === id);
      if (reg) renderTicketStub(reg);
    });
  });

  // Attach print badge triggers
  adminTableBody.querySelectorAll('.btn-print-badge').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const reg = registrations.find(r => r.regId === id);
      if (reg) openBadgeModal(reg);
    });
  });

  // Attach booth select change event listeners
  adminTableBody.querySelectorAll('.admin-booth-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      const id = select.getAttribute('data-id');
      const tableVal = e.target.value;
      const reg = registrations.find(r => r.regId === id);
      if (reg) {
        const prevTable = reg.tableNumber;
        reg.tableNumber = tableVal ? parseInt(tableVal) : null;
        
        // Save to Database or LocalStorage
        if (useSupabase && supabaseClient) {
          try {
            const { error } = await supabaseClient
              .from('registrations')
              .update({ table_number: reg.tableNumber })
              .eq('regid', id);
              
            if (error) throw error;
          } catch(err) {
            console.error("Failed to save booth assignment to Supabase:", err);
            // Revert on database save failure
            reg.tableNumber = prevTable;
            e.target.value = prevTable || "";
            alert("Database error: Could not save booth assignment.");
            return;
          }
        } else {
          safeSetItem('haconet_registrations', JSON.stringify(registrations));
        }

        // Re-render visual floor plan
        renderExpoFloorPlan();
      }
    });
  });

  adminTableBody.querySelectorAll('.btn-checkin-attendee:not(.disabled)').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const reg = registrations.find(r => r.regId === id);
      if (reg) {
        if (confirm(`Do you want to confirm attendance/check-in for ${reg.bizName || reg.ownerName}?`)) {
          const nowStr = new Date().toLocaleString();
          reg.checkedIn = true;
          reg.checkedInAt = nowStr;
          
          if (useSupabase) {
            try {
              const { error } = await supabaseClient
                .from('registrations')
                .update({ checked_in: true, checked_in_at: nowStr })
                .eq('regid', id);
              if (error) throw error;
            } catch (err) {
              console.error("Failed to check-in attendee on Supabase:", err);
              alert("Database error: " + err.message);
              return;
            }
          } else {
            safeSetItem('haconet_registrations', JSON.stringify(registrations));
          }
          
          renderAdminAttendeeList();
          alert(`Successfully checked in ${reg.bizName || reg.ownerName}!`);
        }
      }
    });
  });

  adminTableBody.querySelectorAll('.btn-delete-reg').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm(`Are you sure you want to delete registration ${id}?`)) {
        if (useSupabase) {
          const { error } = await supabaseClient.from('registrations').delete().eq('regid', id);
          if (error) {
            console.error("Supabase deletion failed:", error);
            alert("Failed to delete record: " + error.message);
            return;
          }
        }

        registrations = registrations.filter(r => r.regId !== id);
        if (!useSupabase) {
          safeSetItem('haconet_registrations', JSON.stringify(registrations));
        }
        renderAdminAttendeeList();
      }
    });
  });

  // Update stats UI
  if (statTotalRegistrations) statTotalRegistrations.innerText = registrations.length;
  if (statTotalExhibitors) statTotalExhibitors.innerText = totalEx;
  if (statTotalElectricity) statTotalElectricity.innerText = totalElec;
  if (statTotalConsent) statTotalConsent.innerText = totalDir;
  if (statTotalCheckedIn) statTotalCheckedIn.innerText = totalChecked;
  
  const countLabel = document.getElementById('adminTableCountLabel');
  if (countLabel) countLabel.innerText = `Displaying ${registrations.length} registration record(s)`;
}

// Toggle Administration Panel section via Staff login footer button
if (toggleAdminBtn) {
  toggleAdminBtn.addEventListener('click', () => {
    if (adminDashboard.style.display === 'block') {
      adminDashboard.style.display = 'none';
      toggleAdminBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Staff Login';
    } else {
      // Clear fields and warnings, then open custom Staff Login modal
      if (adminPasscodeField) adminPasscodeField.value = '';
      if (adminLoginError) adminLoginError.style.display = 'none';
      if (adminPasscodeField) adminPasscodeField.classList.remove('error');
      if (adminLoginModal) adminLoginModal.classList.add('open');
    }
  });
}

// Custom Staff Login Modal close/cancel handlers
function closeAdminLoginModal() {
  if (adminLoginModal) {
    adminLoginModal.classList.remove('open');
  }
}

if (btnCloseAdminLoginModal) {
  btnCloseAdminLoginModal.addEventListener('click', closeAdminLoginModal);
}
if (btnCancelAdminLogin) {
  btnCancelAdminLogin.addEventListener('click', closeAdminLoginModal);
}
if (adminLoginModal) {
  adminLoginModal.addEventListener('click', (e) => {
    if (e.target === adminLoginModal) {
      closeAdminLoginModal();
    }
  });
}

// Handle login form submission and passcode validation
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const passcode = adminPasscodeField ? adminPasscodeField.value : '';
    if (passcode.trim().toLowerCase() === 'haconet@2026') {
      closeAdminLoginModal();
      if (adminDashboard) adminDashboard.style.display = 'block';
      renderAdminAttendeeList();
      if (toggleAdminBtn) {
        toggleAdminBtn.innerHTML = '<i class="fa-solid fa-lock-open" style="color: var(--accent-gold);"></i> Close Admin Portal';
      }
      setTimeout(() => {
        if (adminDashboard) adminDashboard.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      if (adminLoginError) adminLoginError.style.display = 'block';
      if (adminPasscodeField) adminPasscodeField.classList.add('error');
    }
  });
}

// Admin Logout functionality
if (btnAdminLogout) {
  btnAdminLogout.addEventListener('click', () => {
    if (adminDashboard) {
      adminDashboard.style.display = 'none';
      if (toggleAdminBtn) {
        toggleAdminBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Staff Login';
      }
      alert("You have logged out of the HACONET Admin Portal.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// CSV Export functionality
if (btnExportCSV) {
  btnExportCSV.addEventListener('click', () => {
    if (registrations.length === 0) {
      alert("No registrations available to export.");
      return;
    }

    let csvContent = "Registration ID,Business Name,Representative,Title,Address,City,State,Zip,Phone,Email,Website,Industry,Year Established,Description,Exhibitor,Electricity Needed,Directory Consent,Special Accommodations,Signature,Date Signed\n";

    registrations.forEach(r => {
      let formattedInterests = r.interests;
      if (typeof formattedInterests !== 'string') {
        formattedInterests = Array.isArray(formattedInterests) ? formattedInterests.join(', ') : '';
      }

      const row = [
        r.regId,
        `"${(r.bizName || '').replace(/"/g, '""')}"`,
        `"${(r.ownerName || '').replace(/"/g, '""')}"`,
        `"${(r.title || '').replace(/"/g, '""')}"`,
        `"${(r.address || '').replace(/"/g, '""')}"`,
        `"${(r.city || '').replace(/"/g, '""')}"`,
        `"${(r.state || '').replace(/"/g, '""')}"`,
        `"${(r.zip || '').replace(/"/g, '""')}"`,
        `"${r.phone || ''}"`,
        `"${r.email || ''}"`,
        `"${(r.website || '').replace(/"/g, '""')}"`,
        `"${r.industry || ''}"`,
        r.established || '',
        `"${(r.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        r.exhibitor || 'No',
        r.electricity || 'No',
        r.directoryConsent || 'No',
        `"${(r.accommodations || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${(r.signature || '').replace(/"/g, '""')}"`,
        r.dateSigned || ''
      ];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "haconet_event_registrations_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

// ==========================================================================
// 11. Ticket Check-In Verification Logic
// ==========================================================================
async function checkUrlParamsForCheckin() {
  const urlParams = new URLSearchParams(window.location.search);
  const regIdToCheck = urlParams.get('checkin');
  
  if (!regIdToCheck) return;
  
  console.log("Found check-in parameter in URL:", regIdToCheck);
  
  const checkinModal = document.getElementById('checkinModal');
  if (!checkinModal) return;
  
  const checkinStatusIcon = document.getElementById('checkinStatusIcon');
  const checkinTitle = document.getElementById('checkinTitle');
  const checkinBizName = document.getElementById('checkinBizName');
  const checkinOwner = document.getElementById('checkinOwner');
  const checkinExhibitor = document.getElementById('checkinExhibitor');
  const checkinRegId = document.getElementById('checkinRegId');
  const checkinPower = document.getElementById('checkinPower');
  const btnDismissCheckin = document.getElementById('btnDismissCheckin');
  const btnCloseCheckinModal = document.getElementById('btnCloseCheckinModal');
  
  let reg = registrations.find(r => r.regId === regIdToCheck);
  
  if (!reg && useSupabase && supabaseClient) {
    try {
      console.log("Registration not found in memory. Querying Supabase directly...");
      const { data, error } = await supabaseClient
        .from('registrations')
        .select('*')
        .eq('regid', regIdToCheck);
        
      if (!error && data && data.length > 0) {
        reg = mapRegistrationFromDb(data[0]);
        registrations.push(reg);
        // Refresh admin dashboard list if active
        if (adminDashboard && adminDashboard.style.display === 'block') {
          renderAdminAttendeeList();
        }
      }
    } catch (e) {
      console.error("Failed to fetch registration for check-in from Supabase:", e);
    }
  }
  
  if (reg) {
    const isCheckedIn = reg.checkedIn === true || reg.checkedIn === 'Yes';
    
    if (isCheckedIn) {
      // Already Checked In
      if (checkinStatusIcon) {
        checkinStatusIcon.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="color: #e67e22;"></i>';
      }
      if (checkinTitle) {
        checkinTitle.innerText = "Already Verified!";
        checkinTitle.style.color = "#e67e22";
      }
      if (checkinAttendanceStatus) {
        checkinAttendanceStatus.innerText = `Checked In at ${reg.checkedInAt || 'N/A'}`;
        checkinAttendanceStatus.style.color = "#2ecc71";
      }
      if (btnConfirmCheckin) {
        btnConfirmCheckin.style.display = 'none';
      }
    } else {
      // Verified but not checked in yet
      if (checkinStatusIcon) {
        checkinStatusIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--accent-gold);"></i>';
      }
      if (checkinTitle) {
        checkinTitle.innerText = "Ticket Verified!";
        checkinTitle.style.color = "var(--accent-gold)";
      }
      if (checkinAttendanceStatus) {
        checkinAttendanceStatus.innerText = "Not Checked In";
        checkinAttendanceStatus.style.color = "#e74c3c";
      }
      if (btnConfirmCheckin) {
        btnConfirmCheckin.style.display = 'block';
        btnConfirmCheckin.disabled = false;
        btnConfirmCheckin.innerHTML = '<i class="fa-solid fa-user-check"></i> Confirm Attendance';
        
        btnConfirmCheckin.onclick = async () => {
          btnConfirmCheckin.disabled = true;
          btnConfirmCheckin.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Confirming...';
          
          const nowStr = new Date().toLocaleString();
          reg.checkedIn = true;
          reg.checkedInAt = nowStr;
          
          if (useSupabase) {
            try {
              const { error } = await supabaseClient
                .from('registrations')
                .update({ checked_in: true, checked_in_at: nowStr })
                .eq('regid', reg.regId);
              if (error) throw error;
            } catch (err) {
              console.error("Supabase check-in failed:", err);
              alert("Failed to confirm check-in: " + err.message);
              btnConfirmCheckin.disabled = false;
              btnConfirmCheckin.innerHTML = '<i class="fa-solid fa-user-check"></i> Confirm Attendance';
              return;
            }
          } else {
            safeSetItem('haconet_registrations', JSON.stringify(registrations));
          }
          
          // Update modal UI
          if (checkinTitle) {
            checkinTitle.innerText = "Check-in Confirmed!";
            checkinTitle.style.color = "#2ecc71";
          }
          if (checkinStatusIcon) {
            checkinStatusIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #2ecc71;"></i>';
          }
          if (checkinAttendanceStatus) {
            checkinAttendanceStatus.innerText = `Checked In at ${nowStr}`;
            checkinAttendanceStatus.style.color = "#2ecc71";
          }
          btnConfirmCheckin.style.display = 'none';
          
          // Refresh Admin Portal table
          renderAdminAttendeeList();
        };
      }
    }
    
    if (checkinBizName) {
      checkinBizName.innerText = reg.bizName || 'No Business Name';
      checkinBizName.style.display = 'block';
    }
    if (checkinOwner) {
      checkinOwner.innerText = reg.ownerName ? `${reg.ownerName}${reg.title ? ` (${reg.title})` : ''}` : 'No Owner Name';
      checkinOwner.style.display = 'block';
    }
    
    if (checkinExhibitor) {
      checkinExhibitor.style.display = 'inline-block';
      if (reg.exhibitor === 'Yes') {
        checkinExhibitor.innerText = "Exhibitor (Table Reserved)";
        checkinExhibitor.className = "badge-status yes";
      } else {
        checkinExhibitor.innerText = "General Attendee";
        checkinExhibitor.className = "badge-status no";
      }
    }
    
    if (checkinRegId) checkinRegId.innerText = reg.regId;
    
    if (checkinPower) {
      if (reg.exhibitor === 'Yes') {
        checkinPower.innerText = reg.electricity === 'Yes' ? 'Yes (Power Needed)' : 'No (Power Not Needed)';
      } else {
        checkinPower.innerText = 'Not Applicable';
      }
    }
  } else {
    // Invalid / Not Found
    if (checkinStatusIcon) {
      checkinStatusIcon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--accent-red);"></i>';
    }
    if (checkinTitle) {
      checkinTitle.innerText = "Invalid Ticket!";
      checkinTitle.style.color = "var(--accent-red)";
    }
    if (checkinBizName) {
      checkinBizName.innerText = "Ticket Not Found";
    }
    if (checkinOwner) {
      checkinOwner.innerText = "This Registration ID is not in our system. Please check with the registration desk.";
    }
    if (checkinExhibitor) {
      checkinExhibitor.style.display = 'none';
    }
    if (checkinAttendanceStatus) {
      checkinAttendanceStatus.innerText = "N/A";
    }
    if (btnConfirmCheckin) {
      btnConfirmCheckin.style.display = 'none';
    }
    if (checkinRegId) checkinRegId.innerText = regIdToCheck;
    if (checkinPower) checkinPower.innerText = 'N/A';
  }
  
  // Display Modal
  checkinModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  // Setup dismiss events
  const dismissCheckin = () => {
    checkinModal.classList.remove('open');
    document.body.style.overflow = '';
    
    // Clean URL parameter without reloading
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  };
  
  if (btnDismissCheckin) {
    btnDismissCheckin.addEventListener('click', dismissCheckin, { once: true });
  }
  if (btnCloseCheckinModal) {
    btnCloseCheckinModal.addEventListener('click', dismissCheckin, { once: true });
  }
  
  // Also dismiss if click on the overlay
  const overlayClick = (e) => {
    if (e.target === checkinModal) {
      dismissCheckin();
      checkinModal.removeEventListener('click', overlayClick);
    }
  };
  checkinModal.addEventListener('click', overlayClick);
}

// Check URL parameters for kiosk registration mode
function checkUrlParamsForFocusReg() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('register') === 'true') {
    document.body.classList.add('focus-registration');
  } else {
    document.body.classList.remove('focus-registration');
  }
}

// Function to dynamically toggle focused registration mode
function setFocusRegistration(active) {
  if (active) {
    document.body.classList.add('focus-registration');
    window.scrollTo({ top: 0, behavior: 'instant' });
    const newUrl = `${window.location.origin}${window.location.pathname}?register=true`;
    if (new URLSearchParams(window.location.search).get('register') !== 'true') {
      window.history.pushState({ register: true }, '', newUrl);
    }
    navigateView('#register');
  } else {
    document.body.classList.remove('focus-registration');
    const newUrl = `${window.location.origin}${window.location.pathname}`;
    if (new URLSearchParams(window.location.search).get('register') === 'true') {
      window.history.pushState({ register: false }, '', newUrl);
    }
    // Switch SPA routing view to home
    if (window.location.hash === '#register' || window.location.hash === '') {
      window.location.hash = '#home';
    } else {
      navigateView(window.location.hash);
    }
  }
}

// Handle window history navigation (back/forward buttons)
window.addEventListener('popstate', () => {
  checkUrlParamsForFocusReg();
  navigateView(window.location.hash);
});

// Attach event listeners for focused registration mode transition
document.addEventListener('DOMContentLoaded', () => {
  const regButtons = ['navCtaRegister', 'heroBtnRegister', 'eventCtaBtn'];
  regButtons.forEach(id => {
    document.getElementById(id)?.addEventListener('click', (e) => {
      e.preventDefault();
      setFocusRegistration(true);
    });
  });

  document.getElementById('btnExitFocusReg')?.addEventListener('click', (e) => {
    e.preventDefault();
    setFocusRegistration(false);
  });
});


// Render registration QR codes on load
const mobileRegQrImg = document.getElementById('mobileRegQrImg');
const heroRegQrImg = document.getElementById('heroRegQrImg');
const regUrl = `${window.location.origin}${window.location.pathname}?register=true`;

if (mobileRegQrImg) {
  mobileRegQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(regUrl)}`;
}
if (heroRegQrImg) {
  heroRegQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(regUrl)}`;
}

// FAQ Accordion Toggle Interaction
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.faq-body');
      
      if (!body) return;
      
      const isActive = item.classList.contains('active');
      
      // Close all other FAQ items for proper accordion effect
      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('active');
        const b = el.querySelector('.faq-body');
        if (b) b.style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

// Contact & Sponsorship Inquiry Submission Handler
function initInquiryForm() {
  const form = document.getElementById('inquiryContactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameEl = document.getElementById('inqName');
    const emailEl = document.getElementById('inqEmail');
    const bizEl = document.getElementById('inqBiz');
    const typeEl = document.getElementById('inqType');
    const messageEl = document.getElementById('inqMessage');

    let isValid = true;

    // Validation Name
    if (!nameEl || nameEl.value.trim() === '') {
      if (nameEl) nameEl.classList.add('error');
      const err = document.getElementById('errInqName');
      if (err) err.style.display = 'block';
      isValid = false;
    } else {
      if (nameEl) nameEl.classList.remove('error');
      const err = document.getElementById('errInqName');
      if (err) err.style.display = 'none';
    }

    // Validation Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailEl || !emailPattern.test(emailEl.value.trim())) {
      if (emailEl) emailEl.classList.add('error');
      const err = document.getElementById('errInqEmail');
      if (err) err.style.display = 'block';
      isValid = false;
    } else {
      if (emailEl) emailEl.classList.remove('error');
      const err = document.getElementById('errInqEmail');
      if (err) err.style.display = 'none';
    }

    // Validation Inquiry Type
    if (!typeEl || typeEl.value === '') {
      if (typeEl) typeEl.classList.add('error');
      const err = document.getElementById('errInqType');
      if (err) err.style.display = 'block';
      isValid = false;
    } else {
      if (typeEl) typeEl.classList.remove('error');
      const err = document.getElementById('errInqType');
      if (err) err.style.display = 'none';
    }

    // Validation Message
    if (!messageEl || messageEl.value.trim() === '') {
      if (messageEl) messageEl.classList.add('error');
      const err = document.getElementById('errInqMessage');
      if (err) err.style.display = 'block';
      isValid = false;
    } else {
      if (messageEl) messageEl.classList.remove('error');
      const err = document.getElementById('errInqMessage');
      if (err) err.style.display = 'none';
    }

    if (!isValid) return;

    // Create inquiry record
    const inquiryData = {
      id: `INQ-${Date.now()}`,
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      business: bizEl ? bizEl.value.trim() : '',
      type: typeEl.value,
      message: messageEl.value.trim(),
      dateSubmitted: new Date().toLocaleString()
    };

    // Save logic
    if (useSupabase && supabaseClient) {
      try {
        const { error } = await supabaseClient.from('inquiries').insert([{
          inqid: inquiryData.id,
          name: inquiryData.name,
          email: inquiryData.email,
          business: inquiryData.business,
          type: inquiryData.type,
          message: inquiryData.message,
          datesubmitted: inquiryData.dateSubmitted
        }]);
        if (error) throw error;
      } catch (err) {
        console.warn("Supabase inquiry save failed. Falling back to LocalStorage.", err);
        saveInquiryToLocalStorage(inquiryData);
      }
    } else {
      saveInquiryToLocalStorage(inquiryData);
    }

    // Reset and success feedback
    form.reset();
    const successBanner = document.getElementById('inquirySuccessBanner');
    if (successBanner) {
      successBanner.style.display = 'block';
      successBanner.style.opacity = '0';
      successBanner.style.transform = 'translateY(10px)';
      successBanner.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          successBanner.style.opacity = '1';
          successBanner.style.transform = 'translateY(0)';
        });
      });
      // Auto-hide after 8 seconds
      setTimeout(() => {
        successBanner.style.opacity = '0';
        successBanner.style.transform = 'translateY(10px)';
        setTimeout(() => { successBanner.style.display = 'none'; }, 400);
      }, 8000);
    }
  });
}

function saveInquiryToLocalStorage(inq) {
  let localInqs = [];
  try {
    localInqs = JSON.parse(safeGetItem('haconet_inquiries')) || [];
  } catch (e) {
    localInqs = [];
  }
  if (!Array.isArray(localInqs)) localInqs = [];
  localInqs.push(inq);
  safeSetItem('haconet_inquiries', JSON.stringify(localInqs));
}

// ==========================================================================
// CMS — Seed Data
// ==========================================================================
const SEED_SPONSORS = [
  { id: 'sp-1', name: 'Central Ohio Financial Group', tier: 'Platinum', desc: 'Providing capital and small business advisory services to minority entrepreneurs.', icon: 'fa-solid fa-building-columns', website: '' },
  { id: 'sp-2', name: 'Columbus Enterprise Alliance', tier: 'Gold', desc: 'Empowering local trade and strategic networking partnerships.', icon: 'fa-solid fa-shield-halved', website: '' },
  { id: 'sp-3', name: 'Greater Columbus Development Hub', tier: 'Gold', desc: 'Fostering urban economic development and micro-loan programs.', icon: 'fa-solid fa-chart-line', website: '' },
  { id: 'sp-4', name: 'Bond Enterprise LLC', tier: 'Community', desc: '', icon: 'fa-solid fa-briefcase', website: '' },
  { id: 'sp-5', name: 'Lakay Real Estate', tier: 'Community', desc: '', icon: 'fa-solid fa-house-chimney', website: '' },
  { id: 'sp-6', name: 'Ohio Hope Foundation', tier: 'Community', desc: '', icon: 'fa-solid fa-handshake-angle', website: '' },
  { id: 'sp-7', name: 'Cadet Legal Services', tier: 'Community', desc: '', icon: 'fa-solid fa-scale-balanced', website: '' }
];

const SEED_SPEAKERS = [
  { id: 'spk-1', name: 'Dr. Fabienne Jean-Baptiste', role: 'Keynote Speaker', company: 'Founder, JB Consulting & Healthcare Partners', bio: 'Dr. Jean-Baptiste has over 15 years of experience in healthcare leadership and startup advising in Ohio.', photo: '', linkedin: 'https://linkedin.com', website: '' },
  { id: 'spk-2', name: 'Marc-Antoine Fequiere', role: 'Moderator / Panelist', company: 'Executive Director, HACONET', bio: 'Marc is a tireless advocate for civic access, resource translation, and business mentorship for Columbus families.', photo: '', linkedin: 'https://linkedin.com', website: '' },
  { id: 'spk-3', name: 'Marie-Cecile Augustin', role: 'Panelist', company: 'CEO, Augustin Tax & Financial Advisory', bio: 'Marie-Cecile helps minority business owners unlock capital, secure tax grants, and plan sustainable business transitions.', photo: '', linkedin: 'https://linkedin.com', website: '' }
];

const SEED_FAQ = [
  { id: 'fq-1', question: 'Is the HACONET Business Meet & Greet free to attend?', answer: 'Yes, general attendance is free! However, registration is strictly required to secure your ticket and receive location coordinates and agenda updates. Business exhibitors requesting vendor booths have a separate table setup process.' },
  { id: 'fq-2', question: 'How do I reserve a vendor display/exhibitor table?', answer: 'You can request a display table during the online registration process. On Step 3 of the Registration Form, select "Yes" under the "Would you like a vendor/display table?" option and specify if you require electrical outlets. We will review your submission and email you confirmation with booth details.' },
  { id: 'fq-3', question: 'Where is the event located, and is parking available?', answer: 'The event is hosted at the Gillie Community Center, located at 2100 Morse Rd, Columbus, OH 43229. Free parking is available at the community center parking lot.' },
  { id: 'fq-4', question: 'Can I attend if my business is not yet established?', answer: 'Absolutely! The event is open to aspiring entrepreneurs, community members, professionals, and students. It is a perfect space to find mentorship, gather ideas, and meet strategic business partners.' },
  { id: 'fq-5', question: 'What is the dress code for the networking event?', answer: 'The dress code is business professional or smart casual. We encourage you to dress to impress as you will be networking directly with potential clients, investors, and local leaders.' }
];

// CMS live data arrays (loaded from localStorage or seed)
let sponsors = [];
let speakers = [];
let faqItems = [];

// ==========================================================================
// CMS — Load Content from localStorage
// ==========================================================================
async function loadCmsContent() {
  let loadedFromSupabase = false;
  if (useSupabase && supabaseClient) {
    try {
      const [resSp, resSk, resFq] = await Promise.all([
        supabaseClient.from('sponsors').select('*'),
        supabaseClient.from('speakers').select('*'),
        supabaseClient.from('faqs').select('*')
      ]);
      if (!resSp.error && !resSk.error && !resFq.error) {
        sponsors = resSp.data || [];
        speakers = resSk.data || [];
        faqItems = resFq.data || [];
        loadedFromSupabase = true;
        // Seed if empty on Supabase
        if (sponsors.length === 0) { sponsors = [...SEED_SPONSORS]; await supabaseClient.from('sponsors').insert(sponsors); }
        if (speakers.length === 0) { speakers = [...SEED_SPEAKERS]; await supabaseClient.from('speakers').insert(speakers); }
        if (faqItems.length === 0) { faqItems = [...SEED_FAQ]; await supabaseClient.from('faqs').insert(faqItems); }
      }
    } catch (e) {
      console.warn("Supabase CMS fetch failed (tables might not exist). Falling back to LocalStorage.");
    }
  }

  if (!loadedFromSupabase) {
    try { sponsors = JSON.parse(safeGetItem('haconet_sponsors')) || null; } catch(e) { sponsors = null; }
    if (!Array.isArray(sponsors) || sponsors.length === 0) {
      sponsors = [...SEED_SPONSORS];
      safeSetItem('haconet_sponsors', JSON.stringify(sponsors));
    }

    try { speakers = JSON.parse(safeGetItem('haconet_speakers')) || null; } catch(e) { speakers = null; }
    if (!Array.isArray(speakers) || speakers.length === 0) {
      speakers = [...SEED_SPEAKERS];
      safeSetItem('haconet_speakers', JSON.stringify(speakers));
    }

    try { faqItems = JSON.parse(safeGetItem('haconet_faq')) || null; } catch(e) { faqItems = null; }
    if (!Array.isArray(faqItems) || faqItems.length === 0) {
      faqItems = [...SEED_FAQ];
      safeSetItem('haconet_faq', JSON.stringify(faqItems));
    }
  }
}

async function saveCmsToLocalStorage() {
  safeSetItem('haconet_sponsors', JSON.stringify(sponsors));
  safeSetItem('haconet_speakers', JSON.stringify(speakers));
  safeSetItem('haconet_faq', JSON.stringify(faqItems));
  
  if (useSupabase && supabaseClient) {
    try {
      // Upsert data to Supabase (assuming tables exist). 
      // Using upsert requires knowing the state, or we just delete and re-insert for simplicity on small datasets
      await Promise.all([
        supabaseClient.from('sponsors').upsert(sponsors),
        supabaseClient.from('speakers').upsert(speakers),
        supabaseClient.from('faqs').upsert(faqItems)
      ]);
    } catch(e) {
      console.warn("Failed to sync CMS to Supabase.", e);
    }
  }
}

// ==========================================================================
// CMS — Public Section Renderers
// ==========================================================================
function renderSponsorsSection() {
  const container = document.getElementById('sponsorsContainer');
  if (!container) return;

  const tiers = [
    { key: 'Platinum', label: 'Platinum Sponsor', cssClass: 'platinum-card', titleClass: 'platinum', gridClass: 'sponsor-grid' },
    { key: 'Gold',     label: 'Gold Partners',     cssClass: 'gold-card',     titleClass: 'gold',     gridClass: 'sponsor-grid' },
    { key: 'Community',label: 'Community Supporters', cssClass: 'community-card', titleClass: 'silver', gridClass: 'sponsor-grid silver-grid' }
  ];

  let html = '<div class="sponsors-container">';
  tiers.forEach(tier => {
    const tierSponsors = sponsors.filter(s => s.tier === tier.key);
    if (tierSponsors.length === 0) return;
    html += `<div class="sponsor-tier ${tier.key}">
      <h4 class="tier-title ${tier.titleClass}">${tier.label}</h4>
      <div class="${tier.gridClass}">`;
    tierSponsors.forEach(s => {
      const nameLink = s.website
        ? `<a href="${s.website}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;">${s.name}</a>`
        : s.name;
      // Show real logo if available, otherwise icon placeholder
      const logoHtml = s.logoData
        ? `<img src="${s.logoData}" alt="${s.name} logo" class="sponsor-logo-img">`
        : `<div class="sponsor-logo-placeholder"><i class="${s.icon || 'fa-solid fa-star'}"></i> ${nameLink}</div>`;
      const nameBelow = s.logoData
        ? `<div style="font-weight:700;font-size:0.95rem;margin-bottom:0.25rem;">${nameLink}</div>`
        : '';
      html += `<div class="sponsor-card ${tier.cssClass}">
        ${logoHtml}
        ${nameBelow}
        ${s.desc ? `<p class="sponsor-desc">${s.desc}</p>` : ''}
      </div>`;
    });
    html += `</div></div>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

function renderSpeakersSection() {
  const grid = document.getElementById('speakersGrid');
  if (!grid) return;
  if (speakers.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem;">No speakers added yet.</p>';
    return;
  }
  grid.innerHTML = speakers.map(spk => {
    const imgHtml = spk.photo
      ? `<img src="${spk.photo}" alt="${spk.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
      : `<i class="fa-solid fa-user-tie"></i>`;
    const liHtml = spk.linkedin ? `<a href="${spk.linkedin}" target="_blank" rel="noopener"><i class="fa-brands fa-linkedin-in"></i></a>` : '';
    const webHtml = spk.website ? `<a href="${spk.website}" target="_blank" rel="noopener"><i class="fa-solid fa-globe"></i></a>` : '';
    const socialsHtml = (liHtml || webHtml) ? `<div class="speaker-socials">${liHtml}${webHtml}</div>` : '';
    return `<div class="speaker-card">
      <div class="speaker-img-container">
        <div class="speaker-img-placeholder">${imgHtml}</div>
        ${socialsHtml}
      </div>
      <div class="speaker-info">
        <h4>${spk.name}</h4>
        <span class="speaker-role">${spk.role}</span>
        ${spk.company ? `<p class="speaker-company">${spk.company}</p>` : ''}
        ${spk.bio ? `<p class="speaker-bio">${spk.bio}</p>` : ''}
      </div>
    </div>`;
  }).join('');
}

function renderFaqSection() {
  const container = document.getElementById('faqAccordion');
  if (!container) return;
  if (faqItems.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem;">No FAQ entries yet.</p>';
    return;
  }
  container.innerHTML = faqItems.map(fq => `
    <div class="faq-item">
      <button class="faq-header" aria-expanded="false">
        <span>${fq.question}</span>
        <i class="fa-solid fa-chevron-down"></i>
      </button>
      <div class="faq-body">
        <div class="faq-content"><p>${fq.answer}</p></div>
      </div>
    </div>`).join('');
  // Re-attach accordion listeners
  initFaqAccordion();
}

// ==========================================================================
// CMS — Admin Tab Switching
// ==========================================================================
function initAdminTabs() {
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const tabPanels = document.querySelectorAll('.admin-tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(`adminPanel${capitalize(target)}`);
      if (panel) panel.classList.add('active');

      // Stop camera scanner when switching away from the scanner tab
      if (target !== 'scanner') {
        stopCameraScanner();
      }

      // Render panel on first activation
      if (target === 'sponsors') renderAdminSponsors();
      else if (target === 'speakers') renderAdminSpeakers();
      else if (target === 'faq') renderAdminFaq();
      else if (target === 'inquiries') renderAdminInquiries();
      else if (target === 'directory') renderAdminDirectory();
      else if (target === 'settings') renderAdminSettings();
      else if (target === 'legal') renderAdminLegal();
      else if (target === 'gallery') renderAdminGallery();
      else if (target === 'scanner') initCameraScanner();
    });
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==========================================================================
// CMS — DIRECTORY Admin View & CRUD
// ==========================================================================
function renderAdminDirectory() {
  const tbody = document.getElementById('adminDirectoryTableBody');
  if (!tbody) return;
  if (!businesses || businesses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="cms-empty-state"><i class="fa-solid fa-address-book"></i><p>No businesses yet. Click "Add Business" to get started.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = businesses.map(b => `<tr>
    <td style="font-weight:600;">${b.name}</td>
    <td>${b.owner || '—'} <span style="font-size:0.8rem;color:var(--text-muted);display:block;">${b.title || ''}</span></td>
    <td><span class="biz-cat-tag">${b.category || 'Other'}</span></td>
    <td style="color:var(--text-secondary);font-size:0.85rem;">${b.phone || '—'}</td>
    <td><div class="cms-actions">
      <button class="btn-icon edit" title="Edit" onclick="openBusinessModal('${b.id}')"><i class="fa-solid fa-pen"></i></button>
      <button class="btn-icon delete" title="Delete" onclick="deleteBusiness('${b.id}')"><i class="fa-solid fa-trash"></i></button>
    </div></td>
  </tr>`).join('');
}

function openBusinessModal(id = null) {
  const modal = document.getElementById('businessEditorModal');
  const title = document.getElementById('businessModalTitle');
  const form = document.getElementById('businessEditorForm');
  form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.form-error-msg').forEach(el => el.style.display = 'none');

  if (id) {
    const biz = businesses.find(x => x.id === id);
    if (!biz) return;
    title.textContent = 'Edit Business';
    document.getElementById('businessEditId').value = biz.id;
    document.getElementById('businessName').value = biz.name || '';
    document.getElementById('businessOwner').value = biz.owner || '';
    document.getElementById('businessTitle').value = biz.title || '';
    document.getElementById('businessCategory').value = biz.category || 'Other';
    document.getElementById('businessPhone').value = biz.phone || '';
    document.getElementById('businessEmail').value = biz.email || '';
    document.getElementById('businessWebsite').value = biz.website || '';
    document.getElementById('businessAddress').value = biz.address || '';
    document.getElementById('businessEstablished').value = biz.established || '';
    document.getElementById('businessDescription').value = biz.description || '';
    
    let interestsStr = '';
    if (Array.isArray(biz.interests)) {
      interestsStr = biz.interests.join(', ');
    } else if (typeof biz.interests === 'string') {
      try {
        const arr = JSON.parse(biz.interests);
        if (Array.isArray(arr)) interestsStr = arr.join(', ');
      } catch(e) {
        interestsStr = biz.interests;
      }
    }
    document.getElementById('businessInterests').value = interestsStr;
  } else {
    title.textContent = 'Add Business';
    document.getElementById('businessEditId').value = '';
    form.reset();
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeBusinessModal() {
  document.getElementById('businessEditorModal').classList.remove('open');
  document.body.style.overflow = 'auto';
}

async function deleteBusiness(id) {
  if (!confirm('Are you sure you want to delete this business?')) return;
  const oldBusinesses = [...businesses];
  businesses = businesses.filter(x => x.id !== id);
  renderAdminDirectory();
  renderDirectory();
  
  if (useSupabase && supabaseClient) {
    try {
      const { error } = await supabaseClient.from('businesses').delete().eq('id', id);
      if (error) throw error;
    } catch(e) {
      console.warn("Supabase delete failed, restoring local state.", e);
      alert("Failed to delete business from cloud.");
      businesses = oldBusinesses;
      renderAdminDirectory();
      renderDirectory();
    }
  } else {
    safeSetItem('haconet_businesses', JSON.stringify(businesses));
  }
}

document.getElementById('businessEditorForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  let isValid = true;
  const nameInput = document.getElementById('businessName');
  if (!nameInput.value.trim()) { nameInput.classList.add('error'); nameInput.nextElementSibling.style.display = 'block'; isValid = false; }
  const ownerInput = document.getElementById('businessOwner');
  if (!ownerInput.value.trim()) { ownerInput.classList.add('error'); ownerInput.nextElementSibling.style.display = 'block'; isValid = false; }
  const categoryInput = document.getElementById('businessCategory');
  if (!categoryInput.value) { categoryInput.classList.add('error'); categoryInput.nextElementSibling.style.display = 'block'; isValid = false; }

  if (!isValid) return;

  const idInput = document.getElementById('businessEditId').value;
  const isNew = !idInput;
  const bizId = isNew ? 'biz-' + Date.now() : idInput;

  let interestsArr = [];
  const interestsVal = document.getElementById('businessInterests').value.trim();
  if (interestsVal) {
    interestsArr = interestsVal.split(',').map(s => s.trim()).filter(Boolean);
  }

  const bizObj = {
    id: bizId,
    name: nameInput.value.trim(),
    owner: ownerInput.value.trim(),
    title: document.getElementById('businessTitle').value.trim(),
    category: categoryInput.value,
    phone: document.getElementById('businessPhone').value.trim(),
    email: document.getElementById('businessEmail').value.trim(),
    website: document.getElementById('businessWebsite').value.trim(),
    address: document.getElementById('businessAddress').value.trim(),
    established: document.getElementById('businessEstablished').value.trim(),
    description: document.getElementById('businessDescription').value.trim(),
    interests: interestsArr
  };

  const btn = document.getElementById('btnSaveBusiness');
  const originalText = btn.textContent;
  btn.textContent = 'Saving...';
  btn.disabled = true;

  if (isNew) {
    businesses.push(bizObj);
  } else {
    const idx = businesses.findIndex(x => x.id === bizId);
    if (idx > -1) businesses[idx] = bizObj;
  }

  if (useSupabase && supabaseClient) {
    try {
      // the interests array in Supabase is stored as jsonb string or array depending on schema
      // businesses table currently receives array if mapped, but if the table expects jsonb:
      const dbObj = { ...bizObj, interests: JSON.stringify(bizObj.interests) };
      const { error } = await supabaseClient.from('businesses').upsert(dbObj);
      if (error) throw error;
    } catch(err) {
      console.warn("Failed to sync business to Supabase", err);
      // Revert if new
      if (isNew) businesses.pop();
      alert("Failed to save to cloud.");
      btn.textContent = originalText;
      btn.disabled = false;
      return;
    }
  } else {
    safeSetItem('haconet_businesses', JSON.stringify(businesses));
  }

  closeBusinessModal();
  renderAdminDirectory();
  renderDirectory();
  btn.textContent = originalText;
  btn.disabled = false;
});

document.getElementById('btnAddBusiness')?.addEventListener('click', () => openBusinessModal());
document.getElementById('btnCloseBusinessModal')?.addEventListener('click', closeBusinessModal);
document.getElementById('btnCancelBusinessModal')?.addEventListener('click', closeBusinessModal);
document.getElementById('businessEditorModal')?.addEventListener('click', (e) => { if (e.target === document.getElementById('businessEditorModal')) closeBusinessModal(); });

// ==========================================================================
// CMS — EVENT SETTINGS Admin View & Logic
// ==========================================================================

function applyEventSettings(settings) {
  if (!settings) return;
  const els = {
    topDate: document.getElementById('heroTopDate'),
    displayDate: document.getElementById('displayCDetailDate'),
    displayTime: document.getElementById('displayCDetailTime'),
    displayLoc: document.getElementById('displayCDetailLoc'),
    badgeNum: document.getElementById('aboutYearsBadgeNum')
  };
  
  if (els.topDate && settings.topDate) els.topDate.innerHTML = settings.topDate;
  if (els.displayDate && settings.displayDate) els.displayDate.innerHTML = settings.displayDate;
  if (els.displayTime && settings.displayTime) els.displayTime.innerHTML = settings.displayTime;
  if (els.displayLoc && settings.displayLoc) els.displayLoc.innerHTML = settings.displayLoc;
  if (els.badgeNum && settings.eventName) els.badgeNum.innerHTML = settings.eventName;

  if (settings.countdownTarget) {
    targetEventDate = new Date(settings.countdownTarget).getTime();
    updateCountdownClock(); // Refresh timer immediately
  }
}

function renderAdminSettings() {
  if (!eventSettings) {
    // defaults if empty
    document.getElementById('settingEventName').value = '2026';
    document.getElementById('settingTopDate').value = 'Annual Networking Event &bull; Aug 6, 2026';
    document.getElementById('settingDisplayDate').value = 'Thursday, August 6, 2026';
    document.getElementById('settingDisplayTime').value = '5:00 PM - 9:00 PM EST';
    document.getElementById('settingDisplayLoc').value = 'Gillie Community Center, 2100 Morse Rd, Columbus, OH 43229';
    document.getElementById('settingCountdownTarget').value = '2026-08-06T17:00';
    return;
  }
  
  document.getElementById('settingEventName').value = eventSettings.eventName || '';
  document.getElementById('settingTopDate').value = eventSettings.topDate || '';
  document.getElementById('settingDisplayDate').value = eventSettings.displayDate || '';
  document.getElementById('settingDisplayTime').value = eventSettings.displayTime || '';
  document.getElementById('settingDisplayLoc').value = eventSettings.displayLoc || '';
  document.getElementById('settingCountdownTarget').value = eventSettings.countdownTarget || '';
}

document.getElementById('adminSettingsForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('btnSaveSettings');
  const originalText = btn.textContent;
  btn.textContent = 'Saving...';
  btn.disabled = true;

  const newSettings = {
    id: 'global', // single row identifier
    eventName: document.getElementById('settingEventName').value.trim(),
    topDate: document.getElementById('settingTopDate').value.trim(),
    displayDate: document.getElementById('settingDisplayDate').value.trim(),
    displayTime: document.getElementById('settingDisplayTime').value.trim(),
    displayLoc: document.getElementById('settingDisplayLoc').value.trim(),
    countdownTarget: document.getElementById('settingCountdownTarget').value.trim(),
  };

  if (useSupabase && supabaseClient) {
    try {
      const { error } = await supabaseClient.from('event_settings').upsert([newSettings]);
      if (error) throw error;
      eventSettings = newSettings;
      applyEventSettings(eventSettings);
      alert("Settings saved to database successfully!");
    } catch(err) {
      console.warn("Failed to sync settings to Supabase", err);
      alert("Failed to save settings. Make sure the event_settings table exists in Supabase.");
    }
  } else {
    eventSettings = newSettings;
    safeSetItem('haconet_event_settings', JSON.stringify(newSettings));
    applyEventSettings(eventSettings);
    alert("Settings saved locally!");
  }

  btn.textContent = originalText;
  btn.disabled = false;
});

// ==========================================================================
// CMS — LEGAL DOCS Admin View & Logic
// ==========================================================================

function renderAdminLegal() {
  if (!legalDocs) {
    document.getElementById('legalPrivacyText').value = '';
    document.getElementById('legalTermsText').value = '';
  } else {
    document.getElementById('legalPrivacyText').value = legalDocs.privacyText || '';
    document.getElementById('legalTermsText').value = legalDocs.termsText || '';
  }
}

document.getElementById('adminLegalForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('btnSaveLegalDocs');
  const originalText = btn.textContent;
  btn.textContent = 'Saving...';
  btn.disabled = true;

  const newDocs = {
    id: 'global',
    privacyText: document.getElementById('legalPrivacyText').value.trim(),
    termsText: document.getElementById('legalTermsText').value.trim()
  };

  if (useSupabase && supabaseClient) {
    try {
      const { error } = await supabaseClient.from('legal_docs').upsert([newDocs]);
      if (error) throw error;
      legalDocs = newDocs;
      alert("Legal documents saved to database successfully!");
    } catch(err) {
      console.warn("Failed to sync legal docs to Supabase", err);
      alert("Failed to save. Make sure the legal_docs table exists in Supabase.");
    }
  } else {
    legalDocs = newDocs;
    safeSetItem('haconet_legal_docs', JSON.stringify(newDocs));
    alert("Legal documents saved locally!");
  }

  btn.textContent = originalText;
  btn.disabled = false;
});

// PUBLIC LEGAL MODAL LOGIC
function openLegalModal(title, content) {
  const modal = document.getElementById('legalModal');
  document.getElementById('legalModalTitle').innerText = title;
  document.getElementById('legalModalContent').innerHTML = content || '<p>Content not available.</p>';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLegalModal() {
  document.getElementById('legalModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('btnCloseLegalModal')?.addEventListener('click', closeLegalModal);
document.getElementById('legalModal')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('legalModal')) closeLegalModal();
});

document.getElementById('linkPrivacy')?.addEventListener('click', (e) => {
  e.preventDefault();
  const content = legalDocs?.privacyText || '<p>Privacy Policy has not been set yet.</p>';
  openLegalModal('Privacy Policy', content);
});

document.getElementById('linkTerms')?.addEventListener('click', (e) => {
  e.preventDefault();
  const content = legalDocs?.termsText || '<p>Terms of Service have not been set yet.</p>';
  openLegalModal('Terms of Service', content);
});

// ==========================================================================
// CMS — GALLERY Admin View & Public Carousel
// ==========================================================================

let carouselInterval = null;
let currentCarouselIndex = 0;

function renderAdminGallery() {
  const tbody = document.getElementById('adminGalleryTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (galleryPhotos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-muted); padding:2rem;">No photos uploaded yet.</td></tr>`;
    return;
  }

  galleryPhotos.forEach(photo => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${photo.photoData}" alt="Gallery Photo" class="admin-gallery-thumb"></td>
      <td>${photo.caption || '<em>No caption</em>'}</td>
      <td style="text-align:right;">
        <button class="btn btn-sm btn-danger" onclick="deleteGalleryPhoto('${photo.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('adminUploadGalleryForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('btnUploadGalleryPhoto');
  const fileInput = document.getElementById('galleryImageInput');
  const captionInput = document.getElementById('galleryCaptionInput');
  const file = fileInput.files[0];
  if (!file) return;

  btn.disabled = true;
  btn.textContent = 'Uploading...';

  const reader = new FileReader();
  reader.onload = async (ev) => {
    const base64Data = ev.target.result;
    const newPhoto = {
      id: 'gal-' + Date.now(),
      photoData: base64Data,
      caption: captionInput.value.trim(),
      created_at: new Date().toISOString()
    };

    if (useSupabase && supabaseClient) {
      try {
        const { error } = await supabaseClient.from('gallery').insert([newPhoto]);
        if (error) throw error;
        galleryPhotos.unshift(newPhoto);
        alert('Photo uploaded!');
      } catch (err) {
        console.warn(err);
        alert('Failed to upload photo to database.');
      }
    } else {
      galleryPhotos.unshift(newPhoto);
      safeSetItem('haconet_gallery', JSON.stringify(galleryPhotos));
      alert('Photo saved locally!');
    }

    fileInput.value = '';
    captionInput.value = '';
    btn.disabled = false;
    btn.textContent = 'Upload Photo';
    renderAdminGallery();
    renderPublicGallery();
  };
  reader.readAsDataURL(file);
});

window.deleteGalleryPhoto = async (id) => {
  if(!confirm("Are you sure you want to delete this photo?")) return;
  
  if (useSupabase && supabaseClient) {
    try {
      const { error } = await supabaseClient.from('gallery').delete().eq('id', id);
      if (error) throw error;
      galleryPhotos = galleryPhotos.filter(p => p.id !== id);
    } catch (err) {
      console.warn(err);
      alert('Failed to delete photo from database.');
      return;
    }
  } else {
    galleryPhotos = galleryPhotos.filter(p => p.id !== id);
    safeSetItem('haconet_gallery', JSON.stringify(galleryPhotos));
  }
  renderAdminGallery();
  renderPublicGallery();
};

function renderPublicGallery() {
  const track = document.getElementById('galleryCarouselTrack');
  if (!track) return;
  
  if (galleryPhotos.length === 0) {
    track.innerHTML = `<div class="gallery-carousel-item"><div class="gallery-placeholder"><i class="fa-solid fa-images"></i> <span>No photos available yet</span></div></div>`;
    return;
  }

  track.innerHTML = '';
  galleryPhotos.forEach((photo) => {
    const item = document.createElement('div');
    item.className = 'gallery-carousel-item';
    let captionHtml = photo.caption ? `<div class="gallery-carousel-caption">${photo.caption}</div>` : '';
    item.innerHTML = `
      <img src="${photo.photoData}" alt="Event Highlight">
      ${captionHtml}
    `;
    track.appendChild(item);
  });

  currentCarouselIndex = 0;
  updateCarouselPosition();
  startCarousel();
}

function updateCarouselPosition() {
  const track = document.getElementById('galleryCarouselTrack');
  if (!track || galleryPhotos.length === 0) return;
  track.style.transform = `translateX(-${currentCarouselIndex * 100}%)`;
}

function startCarousel() {
  if (carouselInterval) clearInterval(carouselInterval);
  if (galleryPhotos.length <= 1) return;
  carouselInterval = setInterval(() => {
    currentCarouselIndex = (currentCarouselIndex + 1) % galleryPhotos.length;
    updateCarouselPosition();
  }, 4000);
}

document.getElementById('btnGalleryPrev')?.addEventListener('click', () => {
  if (galleryPhotos.length <= 1) return;
  if (carouselInterval) clearInterval(carouselInterval);
  currentCarouselIndex = (currentCarouselIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
  updateCarouselPosition();
  startCarousel(); // restart timer
});

document.getElementById('btnGalleryNext')?.addEventListener('click', () => {
  if (galleryPhotos.length <= 1) return;
  if (carouselInterval) clearInterval(carouselInterval);
  currentCarouselIndex = (currentCarouselIndex + 1) % galleryPhotos.length;
  updateCarouselPosition();
  startCarousel(); // restart timer
});

document.addEventListener('DOMContentLoaded', () => {
  // Try to load local gallery fallback if supabase fails before initDatabase completes
  try {
    const loc = JSON.parse(safeGetItem('haconet_gallery'));
    if (loc) galleryPhotos = loc;
  } catch(e) {}
  
  // Render initial (will be overwritten if supabase fetches)
  setTimeout(() => renderPublicGallery(), 1000);
});

// ==========================================================================
// CMS — SPONSORS Admin View & CRUD
// ==========================================================================
function renderAdminSponsors() {
  const tbody = document.getElementById('adminSponsorsTableBody');
  if (!tbody) return;
  if (sponsors.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="cms-empty-state"><i class="fa-solid fa-trophy"></i><p>No sponsors yet. Click "Add Sponsor" to get started.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = sponsors.map(s => {
    const tierClass = s.tier === 'Platinum' ? 'platinum' : s.tier === 'Gold' ? 'gold' : 'community';
    const webLink = s.website ? `<a href="${s.website}" target="_blank" rel="noopener" style="color:var(--accent-gold);font-size:0.85rem;">${s.website}</a>` : '<span style="color:var(--text-muted);">—</span>';
    const thumbHtml = s.logoData
      ? `<img src="${s.logoData}" alt="logo" class="sponsor-thumb">`
      : `<div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:6px;border:1px solid var(--border-color);background:rgba(255,255,255,0.04);"><i class="${s.icon || 'fa-solid fa-star'}" style="color:var(--accent-gold);"></i></div>`;
    return `<tr>
      <td>${thumbHtml}</td>
      <td style="font-weight:600;">${s.name}</td>
      <td><span class="tier-badge ${tierClass}">${s.tier}</span></td>
      <td style="color:var(--text-secondary);font-size:0.85rem;max-width:180px;">${s.desc || '—'}</td>
      <td>${webLink}</td>
      <td><div class="cms-actions">
        <button class="btn-icon edit" title="Edit" onclick="openSponsorModal('${s.id}')"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-icon delete" title="Delete" onclick="deleteSponsor('${s.id}')"><i class="fa-solid fa-trash"></i></button>
      </div></td>
    </tr>`;
  }).join('');
}

function _setLogoPreview(dataUrl) {
  const previewBox = document.getElementById('logoPreviewBox');
  const previewImg = document.getElementById('logoPreviewImg');
  const uploadLabel = document.getElementById('logoUploadLabel');
  const logoDataInput = document.getElementById('sponsorLogoData');
  if (!previewBox || !previewImg) return;
  if (dataUrl) {
    previewImg.src = dataUrl;
    previewBox.style.display = 'block';
    if (uploadLabel) { uploadLabel.querySelector('span') && (uploadLabel.querySelector('span').textContent = 'Change Logo'); }
    if (logoDataInput) logoDataInput.value = dataUrl;
  } else {
    previewImg.src = '';
    previewBox.style.display = 'none';
    if (uploadLabel) { uploadLabel.querySelector('span') && (uploadLabel.querySelector('span').textContent = 'Upload Logo from Device'); }
    if (logoDataInput) logoDataInput.value = '';
    const fileInput = document.getElementById('sponsorLogoFile');
    if (fileInput) fileInput.value = '';
    const urlInput = document.getElementById('sponsorLogoUrl');
    if (urlInput) urlInput.value = '';
  }
}

function openSponsorModal(id = null) {
  const modal = document.getElementById('sponsorEditorModal');
  const title = document.getElementById('sponsorModalTitle');
  const form = document.getElementById('sponsorEditorForm');
  form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.form-error-msg').forEach(el => el.style.display = 'none');

  if (id) {
    const s = sponsors.find(x => x.id === id);
    if (!s) return;
    title.textContent = 'Edit Sponsor';
    document.getElementById('sponsorEditId').value = s.id;
    document.getElementById('sponsorName').value = s.name;
    document.getElementById('sponsorTier').value = s.tier;
    document.getElementById('sponsorDesc').value = s.desc || '';
    document.getElementById('sponsorIcon').value = s.icon || '';
    document.getElementById('sponsorWebsite').value = s.website || '';
    // Restore logo preview
    _setLogoPreview(s.logoData || '');
    const urlInput = document.getElementById('sponsorLogoUrl');
    if (urlInput && s.logoData && s.logoData.startsWith('http')) urlInput.value = s.logoData;
  } else {
    title.textContent = 'Add Sponsor';
    document.getElementById('sponsorEditId').value = '';
    form.reset();
    _setLogoPreview('');
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSponsorModal() {
  document.getElementById('sponsorEditorModal').classList.remove('open');
  document.body.style.overflow = '';
}

function deleteSponsor(id) {
  if (!confirm('Are you sure you want to remove this sponsor?')) return;
  sponsors = sponsors.filter(s => s.id !== id);
  saveCmsToLocalStorage();
  renderAdminSponsors();
  renderSponsorsSection();
}

// Sponsor form submit
(function() {
  const form = document.getElementById('sponsorEditorForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameEl = document.getElementById('sponsorName');
    const tierEl = document.getElementById('sponsorTier');
    let valid = true;
    if (!nameEl.value.trim()) { nameEl.classList.add('error'); document.getElementById('errSponsorName').style.display = 'block'; valid = false; } else { nameEl.classList.remove('error'); document.getElementById('errSponsorName').style.display = 'none'; }
    if (!tierEl.value) { tierEl.classList.add('error'); document.getElementById('errSponsorTier').style.display = 'block'; valid = false; } else { tierEl.classList.remove('error'); document.getElementById('errSponsorTier').style.display = 'none'; }
    if (!valid) return;

    // Resolve final logo: hidden field first (base64 from file), then URL input
    const logoDataInput = document.getElementById('sponsorLogoData');
    const logoUrlInput = document.getElementById('sponsorLogoUrl');
    const logoData = (logoDataInput && logoDataInput.value) || (logoUrlInput && logoUrlInput.value.trim()) || '';

    const editId = document.getElementById('sponsorEditId').value;
    const data = {
      id: editId || `sp-${Date.now()}`,
      name: nameEl.value.trim(),
      tier: tierEl.value,
      desc: document.getElementById('sponsorDesc').value.trim(),
      icon: document.getElementById('sponsorIcon').value.trim() || 'fa-solid fa-star',
      website: document.getElementById('sponsorWebsite').value.trim(),
      logoData: logoData
    };
    if (editId) {
      const idx = sponsors.findIndex(s => s.id === editId);
      if (idx !== -1) sponsors[idx] = data;
    } else {
      sponsors.push(data);
    }
    saveCmsToLocalStorage();
    closeSponsorModal();
    renderAdminSponsors();
    renderSponsorsSection();
  });
})();

// Logo file input handler
(function() {
  const fileInput = document.getElementById('sponsorLogoFile');
  if (!fileInput) return;
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file is too large. Please use an image under 2MB.');
      fileInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      _setLogoPreview(ev.target.result);
      // Clear URL input if file was uploaded
      const urlInput = document.getElementById('sponsorLogoUrl');
      if (urlInput) urlInput.value = '';
    };
    reader.readAsDataURL(file);
  });

  // URL input handler
  const urlInput = document.getElementById('sponsorLogoUrl');
  if (urlInput) {
    urlInput.addEventListener('blur', () => {
      const val = urlInput.value.trim();
      if (val && val.startsWith('http')) {
        _setLogoPreview(val);
        // Clear file input
        if (fileInput) fileInput.value = '';
      }
    });
  }

  // Remove logo button
  const btnRemove = document.getElementById('btnRemoveLogo');
  if (btnRemove) {
    btnRemove.addEventListener('click', () => {
      _setLogoPreview('');
    });
  }

  // Drag & drop onto upload area
  const uploadArea = document.getElementById('logoUploadArea');
  if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      if (file.size > 2 * 1024 * 1024) { alert('Logo file is too large. Please use an image under 2MB.'); return; }
      const reader = new FileReader();
      reader.onload = (ev) => { _setLogoPreview(ev.target.result); };
      reader.readAsDataURL(file);
    });
  }
})();

document.getElementById('btnAddSponsor')?.addEventListener('click', () => openSponsorModal());
document.getElementById('btnCloseSponsorModal')?.addEventListener('click', closeSponsorModal);
document.getElementById('btnCancelSponsorModal')?.addEventListener('click', closeSponsorModal);
document.getElementById('sponsorEditorModal')?.addEventListener('click', (e) => { if (e.target === document.getElementById('sponsorEditorModal')) closeSponsorModal(); });

// ==========================================================================
// CMS — SPEAKERS Admin View & CRUD
// ==========================================================================
function renderAdminSpeakers() {
  const tbody = document.getElementById('adminSpeakersTableBody');
  if (!tbody) return;
  if (speakers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="cms-empty-state"><i class="fa-solid fa-microphone"></i><p>No speakers yet. Click "Add Speaker" to get started.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = speakers.map(spk => `<tr>
    <td style="font-weight:600;">${spk.name}</td>
    <td><span style="color:var(--accent-gold);font-size:0.85rem;font-weight:600;">${spk.role}</span></td>
    <td style="color:var(--text-secondary);font-size:0.85rem;">${spk.company || '—'}</td>
    <td style="color:var(--text-muted);font-size:0.82rem;max-width:220px;">${spk.bio ? spk.bio.substring(0, 80) + (spk.bio.length > 80 ? '…' : '') : '—'}</td>
    <td><div class="cms-actions">
      <button class="btn-icon edit" title="Edit" onclick="openSpeakerModal('${spk.id}')"><i class="fa-solid fa-pen"></i></button>
      <button class="btn-icon delete" title="Delete" onclick="deleteSpeaker('${spk.id}')"><i class="fa-solid fa-trash"></i></button>
    </div></td>
  </tr>`).join('');
}


function _setSpeakerPhotoPreview(dataUrl) {
  const previewBox = document.getElementById('speakerPhotoPreviewBox');
  const previewImg = document.getElementById('speakerPhotoPreviewImg');
  const uploadLabel = document.getElementById('speakerPhotoUploadLabel');
  const photoDataInput = document.getElementById('speakerPhotoData');
  if (!previewBox || !previewImg) return;
  if (dataUrl) {
    previewImg.src = dataUrl;
    previewBox.style.display = 'block';
    if (uploadLabel) { uploadLabel.querySelector('span') && (uploadLabel.querySelector('span').textContent = 'Change Photo'); }
    if (photoDataInput) photoDataInput.value = dataUrl;
  } else {
    previewImg.src = '';
    previewBox.style.display = 'none';
    if (uploadLabel) { uploadLabel.querySelector('span') && (uploadLabel.querySelector('span').textContent = 'Upload Photo from Device'); }
    if (photoDataInput) photoDataInput.value = '';
    const fileInput = document.getElementById('speakerPhotoFile');
    if (fileInput) fileInput.value = '';
    const urlInput = document.getElementById('speakerPhotoUrl');
    if (urlInput) urlInput.value = '';
  }
}

function openSpeakerModal(id = null) {
  const modal = document.getElementById('speakerEditorModal');
  const title = document.getElementById('speakerModalTitle');
  const form = document.getElementById('speakerEditorForm');
  form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.form-error-msg').forEach(el => el.style.display = 'none');

  if (id) {
    const spk = speakers.find(x => x.id === id);
    if (!spk) return;
    title.textContent = 'Edit Speaker';
    document.getElementById('speakerEditId').value = spk.id;
    document.getElementById('speakerName').value = spk.name;
    document.getElementById('speakerRole').value = spk.role;
    document.getElementById('speakerCompany').value = spk.company || '';
    document.getElementById('speakerBio').value = spk.bio || '';
    document.getElementById('speakerLinkedin').value = spk.linkedin || '';
    document.getElementById('speakerWebsite').value = spk.website || '';
    // Restore photo preview
    _setSpeakerPhotoPreview(spk.photoData || spk.photo || '');
    const urlInput = document.getElementById('speakerPhotoUrl');
    if (urlInput && (spk.photoData || spk.photo) && (spk.photoData || spk.photo).startsWith('http')) {
      urlInput.value = spk.photoData || spk.photo;
    }
  } else {
    title.textContent = 'Add Speaker';
    document.getElementById('speakerEditId').value = '';
    form.reset();
    _setSpeakerPhotoPreview('');
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}


function closeSpeakerModal() {
  document.getElementById('speakerEditorModal').classList.remove('open');
  document.body.style.overflow = '';
}

function deleteSpeaker(id) {
  if (!confirm('Are you sure you want to remove this speaker?')) return;
  speakers = speakers.filter(s => s.id !== id);
  saveCmsToLocalStorage();
  renderAdminSpeakers();
  renderSpeakersSection();
}

(function() {
  const form = document.getElementById('speakerEditorForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameEl = document.getElementById('speakerName');
    const roleEl = document.getElementById('speakerRole');
    let valid = true;
    if (!nameEl.value.trim()) { nameEl.classList.add('error'); document.getElementById('errSpeakerName').style.display = 'block'; valid = false; } else { nameEl.classList.remove('error'); document.getElementById('errSpeakerName').style.display = 'none'; }
    if (!roleEl.value) { roleEl.classList.add('error'); document.getElementById('errSpeakerRole').style.display = 'block'; valid = false; } else { roleEl.classList.remove('error'); document.getElementById('errSpeakerRole').style.display = 'none'; }
    if (!valid) return;

    // Resolve final photo
    const photoDataInput = document.getElementById('speakerPhotoData');
    const photoUrlInput = document.getElementById('speakerPhotoUrl');
    const photoData = (photoDataInput && photoDataInput.value) || (photoUrlInput && photoUrlInput.value.trim()) || '';

    const editId = document.getElementById('speakerEditId').value;
    const data = {
      id: editId || `spk-${Date.now()}`,
      name: nameEl.value.trim(),
      role: roleEl.value,
      company: document.getElementById('speakerCompany').value.trim(),
      bio: document.getElementById('speakerBio').value.trim(),
      photo: photoData,
      photoData: photoData, // Keep it in photoData too for consistency with sponsor
      linkedin: document.getElementById('speakerLinkedin').value.trim(),
      website: document.getElementById('speakerWebsite').value.trim()
    };
    if (editId) {
      const idx = speakers.findIndex(s => s.id === editId);
      if (idx !== -1) speakers[idx] = data;
    } else {
      speakers.push(data);
    }
    saveCmsToLocalStorage();
    closeSpeakerModal();
    renderAdminSpeakers();
    renderSpeakersSection();
  });
})();

// Speaker photo file input handler
(function() {
  const fileInput = document.getElementById('speakerPhotoFile');
  if (!fileInput) return;
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo file is too large. Please use an image under 2MB.');
      fileInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      _setSpeakerPhotoPreview(ev.target.result);
      const urlInput = document.getElementById('speakerPhotoUrl');
      if (urlInput) urlInput.value = '';
    };
    reader.readAsDataURL(file);
  });

  // URL input handler
  const urlInput = document.getElementById('speakerPhotoUrl');
  if (urlInput) {
    urlInput.addEventListener('blur', () => {
      const val = urlInput.value.trim();
      if (val && val.startsWith('http')) {
        _setSpeakerPhotoPreview(val);
        if (fileInput) fileInput.value = '';
      }
    });
  }

  // Remove photo button
  const btnRemove = document.getElementById('btnRemoveSpeakerPhoto');
  if (btnRemove) {
    btnRemove.addEventListener('click', () => {
      _setSpeakerPhotoPreview('');
    });
  }

  // Drag & drop onto upload area
  const uploadArea = document.getElementById('speakerPhotoUploadArea');
  if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      if (file.size > 2 * 1024 * 1024) { alert('Photo file is too large. Please use an image under 2MB.'); return; }
      const reader = new FileReader();
      reader.onload = (ev) => { _setSpeakerPhotoPreview(ev.target.result); };
      reader.readAsDataURL(file);
    });
  }
})();


document.getElementById('btnAddSpeaker')?.addEventListener('click', () => openSpeakerModal());
document.getElementById('btnCloseSpeakerModal')?.addEventListener('click', closeSpeakerModal);
document.getElementById('btnCancelSpeakerModal')?.addEventListener('click', closeSpeakerModal);
document.getElementById('speakerEditorModal')?.addEventListener('click', (e) => { if (e.target === document.getElementById('speakerEditorModal')) closeSpeakerModal(); });

// ==========================================================================
// CMS — FAQ Admin View & CRUD
// ==========================================================================
function renderAdminFaq() {
  const list = document.getElementById('adminFaqList');
  if (!list) return;
  if (faqItems.length === 0) {
    list.innerHTML = `<div class="cms-empty-state"><i class="fa-solid fa-circle-question"></i><p>No FAQ entries yet. Click "Add FAQ" to get started.</p></div>`;
    return;
  }
  list.innerHTML = faqItems.map((fq, idx) => `
    <div class="admin-faq-row" id="adminFaqRow-${fq.id}">
      <div class="admin-faq-row-text">
        <div class="admin-faq-row-question">${fq.question}</div>
        <div class="admin-faq-row-answer">${fq.answer}</div>
      </div>
      <div class="admin-faq-row-actions">
        <button class="btn-icon move" title="Move Up" onclick="moveFaq('${fq.id}', -1)" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''}><i class="fa-solid fa-chevron-up"></i></button>
        <button class="btn-icon move" title="Move Down" onclick="moveFaq('${fq.id}', 1)" ${idx === faqItems.length-1 ? 'disabled style="opacity:0.3;"' : ''}><i class="fa-solid fa-chevron-down"></i></button>
        <button class="btn-icon edit" title="Edit" onclick="openFaqModal('${fq.id}')"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-icon delete" title="Delete" onclick="deleteFaq('${fq.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`).join('');
}

function moveFaq(id, direction) {
  const idx = faqItems.findIndex(f => f.id === id);
  if (idx === -1) return;
  const newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= faqItems.length) return;
  [faqItems[idx], faqItems[newIdx]] = [faqItems[newIdx], faqItems[idx]];
  saveCmsToLocalStorage();
  renderAdminFaq();
  renderFaqSection();
}

function openFaqModal(id = null) {
  const modal = document.getElementById('faqEditorModal');
  const title = document.getElementById('faqModalTitle');
  const form = document.getElementById('faqEditorForm');
  form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.form-error-msg').forEach(el => el.style.display = 'none');

  if (id) {
    const fq = faqItems.find(x => x.id === id);
    if (!fq) return;
    title.textContent = 'Edit FAQ Entry';
    document.getElementById('faqEditId').value = fq.id;
    document.getElementById('faqQuestion').value = fq.question;
    document.getElementById('faqAnswer').value = fq.answer;
  } else {
    title.textContent = 'Add FAQ Entry';
    document.getElementById('faqEditId').value = '';
    form.reset();
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeFaqModal() {
  document.getElementById('faqEditorModal').classList.remove('open');
  document.body.style.overflow = '';
}

function deleteFaq(id) {
  if (!confirm('Are you sure you want to delete this FAQ entry?')) return;
  faqItems = faqItems.filter(f => f.id !== id);
  saveCmsToLocalStorage();
  renderAdminFaq();
  renderFaqSection();
}

(function() {
  const form = document.getElementById('faqEditorForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const qEl = document.getElementById('faqQuestion');
    const aEl = document.getElementById('faqAnswer');
    let valid = true;
    if (!qEl.value.trim()) { qEl.classList.add('error'); document.getElementById('errFaqQuestion').style.display = 'block'; valid = false; } else { qEl.classList.remove('error'); document.getElementById('errFaqQuestion').style.display = 'none'; }
    if (!aEl.value.trim()) { aEl.classList.add('error'); document.getElementById('errFaqAnswer').style.display = 'block'; valid = false; } else { aEl.classList.remove('error'); document.getElementById('errFaqAnswer').style.display = 'none'; }
    if (!valid) return;

    const editId = document.getElementById('faqEditId').value;
    const data = { id: editId || `fq-${Date.now()}`, question: qEl.value.trim(), answer: aEl.value.trim() };
    if (editId) {
      const idx = faqItems.findIndex(f => f.id === editId);
      if (idx !== -1) faqItems[idx] = data;
    } else {
      faqItems.push(data);
    }
    saveCmsToLocalStorage();
    closeFaqModal();
    renderAdminFaq();
    renderFaqSection();
  });
})();

document.getElementById('btnAddFaq')?.addEventListener('click', () => openFaqModal());
document.getElementById('btnCloseFaqModal')?.addEventListener('click', closeFaqModal);
document.getElementById('btnCancelFaqModal')?.addEventListener('click', closeFaqModal);
document.getElementById('faqEditorModal')?.addEventListener('click', (e) => { if (e.target === document.getElementById('faqEditorModal')) closeFaqModal(); });

// ==========================================================================
// CMS — INQUIRIES Admin View
// ==========================================================================
function renderAdminInquiries() {
  const tbody = document.getElementById('adminInquiriesTableBody');
  if (!tbody) return;
  let localInqs = [];
  try { localInqs = JSON.parse(safeGetItem('haconet_inquiries')) || []; } catch(e) { localInqs = []; }
  if (!Array.isArray(localInqs) || localInqs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="cms-empty-state"><i class="fa-solid fa-envelope-open-text"></i><p>No inquiries received yet.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = [...localInqs].reverse().map(inq => `<tr>
    <td style="font-size:0.82rem;color:var(--text-muted);white-space:nowrap;">${inq.dateSubmitted || '—'}</td>
    <td style="font-weight:600;">${inq.name || '—'}</td>
    <td style="font-size:0.85rem;"><a href="mailto:${inq.email}" style="color:var(--accent-gold);">${inq.email || '—'}</a></td>
    <td style="font-size:0.85rem;color:var(--text-secondary);">${inq.business || '—'}</td>
    <td><span class="biz-cat-tag" style="font-size:0.75rem;">${inq.type || '—'}</span></td>
    <td><div class="inq-message-cell" title="Click to expand" onclick="this.classList.toggle('expanded')">${inq.message || '—'}</div></td>
  </tr>`).join('');
}

// Clear inquiries button
document.getElementById('btnClearInquiries')?.addEventListener('click', () => {
  if (!confirm('Are you sure you want to clear all inquiries? This cannot be undone.')) return;
  safeRemoveItem('haconet_inquiries');
  renderAdminInquiries();
});

// ==========================================================================
// B2B Lead Retrieval: Export Contact to vCard (.vcf)
// ==========================================================================
function downloadVCard(bizName, ownerName, phone, email, website, title, category) {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${ownerName || 'Representative'};;;`,
    `FN:${ownerName || 'Representative'}`,
    `ORG:${bizName || 'Business'}`,
    `TITLE:${title || ''}`,
    `TEL;TYPE=CELL:${phone || ''}`,
    `EMAIL;TYPE=PREF,INTERNET:${email || ''}`,
    `URL:${website || ''}`,
    `NOTE:Category: ${category || 'Other'} - Met at HACONET Business Expo`,
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(bizName || ownerName || 'contact').replace(/\s+/g, '_')}_contact.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==========================================================================
// Expo Floor Plan & Booth Mapping
// ==========================================================================
function renderExpoFloorPlan() {
  const boothsGrid = document.getElementById('boothsGrid');
  if (!boothsGrid) return;
  boothsGrid.innerHTML = '';

  let assignedCount = 0;

  for (let i = 1; i <= 20; i++) {
    const booth = document.createElement('div');
    booth.className = 'booth-node';
    booth.id = `boothNode-${i}`;
    
    // Find exhibitor with this table number
    const exhibitor = registrations.find(r => r.exhibitor === 'Yes' && parseInt(r.tableNumber) === i);
    
    booth.innerHTML = `
      <span class="booth-num">${String(i).padStart(2, '0')}</span>
      <span class="booth-label">${exhibitor ? 'Assigned' : 'Available'}</span>
    `;

    if (exhibitor) {
      booth.classList.add('assigned');
      assignedCount++;

      booth.addEventListener('click', () => {
        document.querySelectorAll('.booth-node').forEach(b => b.classList.remove('highlighted'));
        booth.classList.add('highlighted');

        const detailBox = document.getElementById('boothDetailContent');
        if (detailBox) {
          const websiteBtn = exhibitor.website 
            ? `<a href="${exhibitor.website}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" style="width: 100%; margin-top: 0.5rem; text-align: center;"><i class="fa-solid fa-globe"></i> Website</a>`
            : '';
          
          detailBox.innerHTML = `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem;">
              <span class="biz-cat-tag" style="font-size:0.75rem; background:rgba(241,196,15,0.1); color:var(--accent-gold); padding:2px 8px; border-radius:50px; text-transform:uppercase; font-weight:600;">${exhibitor.industry || 'Other'}</span>
              <h4 class="serif-font" style="font-size: 1.35rem; color: #fff; margin: 0.5rem 0 0.25rem 0;">${exhibitor.bizName || 'Untitled Business'}</h4>
              <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;"><i class="fa-solid fa-user-tie" style="color:var(--accent-gold); margin-right:6px;"></i> ${exhibitor.ownerName || 'Representative'}</p>
              
              <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.85rem; border-top:1px dashed var(--border-color); padding-top:0.75rem; margin-bottom: 1rem;">
                <div><i class="fa-solid fa-phone" style="width:16px; margin-right:6px; color:var(--text-muted);"></i> ${exhibitor.phone || '—'}</div>
                <div><i class="fa-solid fa-envelope" style="width:16px; margin-right:6px; color:var(--text-muted);"></i> ${exhibitor.email || '—'}</div>
                ${exhibitor.address ? `<div><i class="fa-solid fa-location-dot" style="width:16px; margin-right:6px; color:var(--text-muted);"></i> ${exhibitor.address}</div>` : ''}
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <button class="btn btn-gold btn-sm" id="btnMapVCard-${exhibitor.regId}" style="width: 100%;"><i class="fa-solid fa-id-card"></i> Save Contact</button>
                ${websiteBtn}
              </div>
            </div>
          `;

          document.getElementById(`btnMapVCard-${exhibitor.regId}`)?.addEventListener('click', () => {
            downloadVCard(exhibitor.bizName, exhibitor.ownerName, exhibitor.phone, exhibitor.email, exhibitor.website, exhibitor.title, exhibitor.industry);
          });
        }
      });
    } else {
      booth.addEventListener('click', () => {
        document.querySelectorAll('.booth-node').forEach(b => b.classList.remove('highlighted'));
        booth.classList.add('highlighted');

        const detailBox = document.getElementById('boothDetailContent');
        if (detailBox) {
          detailBox.innerHTML = `
            <div style="background: rgba(255,255,255,0.02); border: 1px dashed var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; text-align: center;">
              <i class="fa-solid fa-store" style="font-size: 2.25rem; color: var(--accent-gold); opacity:0.8; margin-bottom: 0.75rem; display:block;"></i>
              <h4 style="font-size: 1.15rem; color: #fff; margin-bottom: 0.25rem;">Table ${String(i).padStart(2, '0')} Available</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 1.25rem;">
                Are you an exhibitor? Register today to reserve this table space for your business.
              </p>
              <a href="#register" class="btn btn-gold btn-sm" style="width: 100%;"><i class="fa-solid fa-pen-to-square"></i> Register & Book Table</a>
            </div>
          `;
        }
      });
    }

    boothsGrid.appendChild(booth);
  }

  const statAssigned = document.getElementById('mapStatAssigned');
  const statAvailable = document.getElementById('mapStatAvailable');
  if (statAssigned) statAssigned.innerText = assignedCount;
  if (statAvailable) statAvailable.innerText = 20 - assignedCount;
}

// Bind Map Search Locator Event
document.getElementById('btnSearchMap')?.addEventListener('click', () => {
  const query = document.getElementById('mapSearchInput')?.value.trim().toLowerCase();
  if (!query) return;

  const matched = registrations.find(r => 
    r.exhibitor === 'Yes' && 
    r.tableNumber && 
    (
      r.tableNumber.toString() === query ||
      (r.bizName || '').toLowerCase().includes(query) ||
      (r.ownerName || '').toLowerCase().includes(query)
    )
  );

  if (matched && matched.tableNumber) {
    const node = document.getElementById(`boothNode-${matched.tableNumber}`);
    if (node) {
      node.click();
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  } else {
    alert("No assigned exhibitor table matches that query.");
  }
});

// ==========================================================================
// Staff Check-in Live Camera QR Scanner
// ==========================================================================
let html5QrScanner = null;

function initCameraScanner() {
  const scannerSelect = document.getElementById('scannerCameraSelect');
  if (!scannerSelect) return;

  Html5Qrcode.getCameras().then(devices => {
    scannerSelect.innerHTML = '';
    if (devices && devices.length > 0) {
      devices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.id;
        option.text = device.label || `Camera ${scannerSelect.length + 1}`;
        scannerSelect.appendChild(option);
      });
    } else {
      scannerSelect.innerHTML = '<option value="">No cameras detected</option>';
    }
  }).catch(err => {
    console.error("Error retrieving cameras:", err);
    scannerSelect.innerHTML = '<option value="">Camera access denied</option>';
  });

  const btnStart = document.getElementById('btnStartScanner');
  const btnStop = document.getElementById('btnStopScanner');

  btnStart?.addEventListener('click', startCameraScanner);
  btnStop?.addEventListener('click', stopCameraScanner);
}

function startCameraScanner() {
  const cameraSelect = document.getElementById('scannerCameraSelect');
  const cameraId = cameraSelect?.value;
  if (!cameraId) {
    alert("Please select a camera source first.");
    return;
  }

  const logs = document.getElementById('scannerLogs');
  if (logs) logs.innerHTML = `<div style="color:var(--accent-gold);">Starting camera scanner...</div>`;

  if (html5QrScanner) {
    html5QrScanner.stop().catch(() => {}).then(() => {
      launchScanner(cameraId);
    });
  } else {
    launchScanner(cameraId);
  }
}

function launchScanner(cameraId) {
  html5QrScanner = new Html5Qrcode("scannerReader");
  html5QrScanner.start(
    cameraId, 
    {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    },
    (decodedText) => {
      processScanResult(decodedText);
    },
    (errorMessage) => {
      // Ignore scan noise
    }
  ).then(() => {
    document.getElementById('btnStartScanner').style.display = 'none';
    document.getElementById('btnStopScanner').style.display = 'inline-block';
    const logs = document.getElementById('scannerLogs');
    if (logs) logs.innerHTML = `<div style="color:#2ecc71;">Scanner running. Position QR code inside the frame.</div>`;
  }).catch(err => {
    console.error("Error starting camera scanner:", err);
    alert("Failed to access camera stream.");
  });
}

function stopCameraScanner() {
  if (html5QrScanner) {
    html5QrScanner.stop().then(() => {
      document.getElementById('btnStartScanner').style.display = 'inline-block';
      document.getElementById('btnStopScanner').style.display = 'none';
      const logs = document.getElementById('scannerLogs');
      if (logs) logs.innerHTML = `<div style="color:var(--text-muted);">Scanner stopped.</div>`;
    }).catch(err => {
      console.error("Error stopping scanner:", err);
    });
  }
}

async function processScanResult(decodedText) {
  const logs = document.getElementById('scannerLogs');
  if (!logs) return;

  console.log("Ticket scanned:", decodedText);

  let regId = decodedText;
  if (decodedText.includes('checkin=')) {
    try {
      const url = new URL(decodedText);
      regId = url.searchParams.get('checkin');
    } catch(e) {
      console.warn("Invalid scanned URL format, assuming raw ID:", decodedText);
    }
  }

  logs.innerHTML = `<div>Scanned Ticket Ref: <strong>${regId}</strong></div>`;

  let reg = registrations.find(r => r.regId === regId);
  if (!reg && useSupabase && supabaseClient) {
    logs.innerHTML += `<div>Record not found in memory. Querying database...</div>`;
    const { data, error } = await supabaseClient.from('registrations').select('*').eq('regid', regId);
    if (!error && data && data.length > 0) {
      reg = mapRegistrationFromDb(data[0]);
      registrations.push(reg);
    }
  }

  if (reg) {
    const isAlreadyChecked = reg.checkedIn === true || reg.checkedIn === 'Yes';
    if (isAlreadyChecked) {
      logs.innerHTML += `<div style="color:#e67e22; font-weight:700; margin-top:0.5rem;"><i class="fa-solid fa-circle-exclamation"></i> Already Checked In: ${reg.bizName || reg.ownerName}</div>`;
    } else {
      logs.innerHTML += `<div>Checking in: <strong>${reg.bizName || reg.ownerName}</strong>...</div>`;
      
      const checkinTime = new Date().toLocaleTimeString();
      reg.checkedIn = true;
      reg.checkedInAt = checkinTime;
      
      if (useSupabase && supabaseClient) {
        await supabaseClient.from('registrations').update({
          checked_in: true,
          checked_in_at: checkinTime
        }).eq('regid', regId);
      } else {
        safeSetItem('haconet_registrations', JSON.stringify(registrations));
      }

      logs.innerHTML += `<div style="color:#2ecc71; font-weight:700; margin-top:0.5rem;"><i class="fa-solid fa-circle-check"></i> Check-in Confirmed: ${reg.bizName || reg.ownerName} at ${checkinTime}</div>`;
      renderAdminAttendeeList();
    }
  } else {
    logs.innerHTML += `<div style="color:var(--border-error); font-weight:700; margin-top:0.5rem;"><i class="fa-solid fa-circle-xmark"></i> Invalid Ticket Reference!</div>`;
  }
}

// ==========================================================================
// Exhibitor Name Badge Generator & Modal
// ==========================================================================
const badgeModal = document.getElementById('badgeModal');
const btnCloseBadgeModal = document.getElementById('btnCloseBadgeModal');
const btnCancelBadge = document.getElementById('btnCancelBadge');
const btnPrintBadgeAction = document.getElementById('btnPrintBadgeAction');

function openBadgeModal(reg) {
  if (!badgeModal) return;

  const bName = document.getElementById('badgeAttendeeName');
  const bBiz = document.getElementById('badgeBusinessName');
  const bRole = document.getElementById('badgeAttendeeRole');
  const bBooth = document.getElementById('badgeBoothNumber');
  const bQr = document.getElementById('badgeQrCodeImg');

  if (bName) bName.innerText = reg.ownerName || 'Attendee';
  if (bBiz) bBiz.innerText = reg.bizName || 'General Admission';
  if (bRole) bRole.innerText = reg.title || 'Participant';
  if (bBooth) {
    bBooth.innerText = reg.tableNumber ? `TABLE ${String(reg.tableNumber).padStart(2, '0')}` : 'GENERAL';
  }
  if (bQr) {
    const checkinUrl = `${window.location.origin}${window.location.pathname}?checkin=${encodeURIComponent(reg.regId)}`;
    bQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(checkinUrl)}`;
  }

  badgeModal.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (btnPrintBadgeAction) {
    const newBtn = btnPrintBadgeAction.cloneNode(true);
    btnPrintBadgeAction.parentNode.replaceChild(newBtn, btnPrintBadgeAction);
    newBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

function closeBadgeModal() {
  if (badgeModal) {
    badgeModal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

if (btnCloseBadgeModal) btnCloseBadgeModal.addEventListener('click', closeBadgeModal);
if (btnCancelBadge) btnCancelBadge.addEventListener('click', closeBadgeModal);
if (badgeModal) {
  badgeModal.addEventListener('click', (e) => {
    if (e.target === badgeModal) closeBadgeModal();
  });
}

// ==========================================================================
// Initialize everything
// ==========================================================================
// ==========================================================================
// Initialize everything
// ==========================================================================

// Init FAQ accordion listeners and inquiry form
initFaqAccordion();
initInquiryForm();

// Init admin tabs (only active once admin is shown)
initAdminTabs();

// Start database fetch and initialization
(async function() {
  await initDatabase(); // Connects to Supabase and loads businesses/registrations
  await loadCmsContent(); // Now fetch CMS from Supabase if connected, or fallback
  
  // Render public sections from data
  renderSponsorsSection();
  renderSpeakersSection();
  renderFaqSection();

  // Run SPA Routing for the initial view
  navigateView(window.location.hash);
})();

