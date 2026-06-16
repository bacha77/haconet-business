/**
 * HACONET Web Platform Core Business Logic
 * Single Page Application Orchestrator with Supabase Database
 */

// Global diagnostic error logger
window.addEventListener('error', (event) => {
  console.error("HACONET JavaScript Uncaught Error:", event.error);
});

// ==========================================================================
// 1. Initial Seed Data
// ==========================================================================
const SEED_BUSINESSES = [
  {
    id: "seed-1",
    name: "La Goute Creole Restaurant",
    owner: "Marie-Claire Valbrun",
    title: "Owner & Head Chef",
    category: "Food & Beverage",
    phone: "614-555-0192",
    email: "info@lagoutecreole.com",
    website: "https://www.lagoutecreole.com",
    address: "1420 Cleveland Ave, Columbus, OH 43211",
    established: 2015,
    description: "Authentic Haitian and Caribbean gastronomy serving the Greater Columbus area. Specialized in Griot (fried pork), Tazso, Legume, and traditional rice dishes. We offer full-service catering for corporate events, weddings, and family gatherings.",
    interests: ["Build business relationships", "Find potential clients/customers", "Promote products/services"]
  },
  {
    id: "seed-2",
    name: "L'Union Logistics & Multi-Services",
    owner: "Ronald Pierre",
    title: "Founder & President",
    category: "Professional Services",
    phone: "614-555-0144",
    email: "contact@lunionlogistics.com",
    website: "https://www.lunionlogistics.com",
    address: "5623 Karl Rd, Columbus, OH 43229",
    established: 2018,
    description: "Professional cargo forwarding, shipping, tax preparation, translation, and notary public services. We specialize in air and ocean cargo shipment to Haiti and other Caribbean nations, providing reliable, secure, and fast logistics solutions.",
    interests: ["Build business relationships", "Explore partnerships", "Connect with other entrepreneurs"]
  },
  {
    id: "seed-3",
    name: "Ayiti Care Home Health Services",
    owner: "Dr. Florence Celestin",
    title: "Clinical Director",
    category: "Healthcare",
    phone: "614-555-0188",
    email: "info@ayiticare.com",
    website: "https://www.ayiticare.com",
    address: "620 E Broad St, Columbus, OH 43215",
    established: 2020,
    description: "High-quality, compassionate home healthcare and personal support services. Dedicated to serving our community with culturally competent caregivers, skilled nursing, physical therapy, and elder care support.",
    interests: ["Meet community leaders", "Learn about resources and funding opportunities", "Recruitment and hiring"]
  },
  {
    id: "seed-4",
    name: "Horizon Tech Solutions",
    owner: "Samuel Jean-Baptiste",
    title: "CEO & Principal Consultant",
    category: "Technology",
    phone: "614-555-0122",
    email: "contact@horizontech.io",
    website: "https://www.horizontech.io",
    address: "100 E Broad St, Columbus, OH 43215",
    established: 2021,
    description: "Custom software engineering, mobile application development, IT support, and cybersecurity consulting. We partner with small businesses to modernize their technology stack, improve search engine visibility, and secure digital operations.",
    interests: ["Find potential clients/customers", "Explore partnerships", "Connect with other entrepreneurs"]
  },
  {
    id: "seed-5",
    name: "Lakay Construction & Remodeling",
    owner: "Stevenson Alexis",
    title: "General Contractor",
    category: "Construction",
    phone: "614-555-0177",
    email: "salexis@lakayconstruction.com",
    website: "https://www.lakayconstruction.com",
    address: "3824 Morse Rd, Columbus, OH 43219",
    established: 2016,
    description: "Premium commercial and residential construction, kitchen and bathroom renovations, roofing, and structural repairs. Licensed, bonded, and committed to high quality construction craftsmanship.",
    interests: ["Build business relationships", "Find potential clients/customers", "Explore partnerships"]
  },
  {
    id: "seed-6",
    name: "Alliance Financial & Tax Services",
    owner: "Fabienne Guerrier",
    title: "Managing Partner",
    category: "Financial Services",
    phone: "614-555-0133",
    email: "fguerrier@alliancecolumbus.com",
    website: "https://www.alliancecolumbus.com",
    address: "4889 E Main St, Columbus, OH 43213",
    established: 2019,
    description: "Comprehensive accounting, tax advisory, bookkeeping, and business incorporation consultation. Helping immigrant and local founders structure their enterprises, optimize tax liability, and secure business credits.",
    interests: ["Build business relationships", "Meet community leaders", "Explore partnerships"]
  },
  {
    id: "seed-7",
    name: "Bel Kreyòl Beauty Salon & Spa",
    owner: "Nadine Chery",
    title: "Founder & Lead Stylist",
    category: "Retail",
    phone: "614-555-0155",
    email: "nadine@belkreyolbeauty.com",
    website: "https://www.belkreyolbeauty.com",
    address: "2900 N High St, Columbus, OH 43202",
    established: 2017,
    description: "Full-service beauty salon specializing in custom hair styling, extensions, braids, skincare treatments, and traditional Caribbean beauty products. We celebrate natural hair textures and promote organic beauty routines.",
    interests: ["Find potential clients/customers", "Promote products/services", "Connect with other entrepreneurs"]
  },
  {
    id: "seed-8",
    name: "Haitian-American Community Foundation",
    owner: "Jean-Claude Louis-Jeune",
    title: "Executive Director",
    category: "Nonprofit",
    phone: "614-555-0166",
    email: "contact@hacfcolumbus.org",
    website: "https://www.hacfcolumbus.org",
    address: "83 S High St, Columbus, OH 43215",
    established: 2012,
    description: "Civic and charitable advocacy program dedicated to fostering cultural pride, language assistance (Haitian Creole/French), youth tutoring, housing aid, and economic empowerment initiatives in Ohio.",
    interests: ["Build business relationships", "Meet community leaders", "Explore partnerships", "Learn about resources and funding opportunities"]
  }
];

const SEED_REGISTRATIONS = [
  {
    regId: "HAC-2026-4192",
    bizName: "La Goute Creole Restaurant",
    ownerName: "Marie-Claire Valbrun",
    title: "Owner & Head Chef",
    address: "1420 Cleveland Ave",
    city: "Columbus",
    state: "OH",
    zip: "43211",
    phone: "614-555-0192",
    email: "info@lagoutecreole.com",
    website: "https://www.lagoutecreole.com",
    industry: "Food & Beverage",
    established: 2015,
    description: "Authentic Haitian and Caribbean gastronomy serving Columbus.",
    interests: ["Build business relationships", "Find potential clients/customers", "Promote products/services"],
    exhibitor: "Yes",
    electricity: "Yes",
    directoryConsent: "Yes",
    accommodations: "Need table setup near wall socket.",
    signature: "Marie-Claire Valbrun",
    dateSigned: "06/15/2026"
  },
  {
    regId: "HAC-2026-7781",
    bizName: "L'Union Logistics & Multi-Services",
    ownerName: "Ronald Pierre",
    title: "Founder & President",
    address: "5623 Karl Rd",
    city: "Columbus",
    state: "OH",
    zip: "43229",
    phone: "614-555-0144",
    email: "contact@lunionlogistics.com",
    website: "https://www.lunionlogistics.com",
    industry: "Professional Services",
    established: 2018,
    description: "Cargo forwarding, tax prep, translation services.",
    interests: ["Build business relationships", "Explore partnerships", "Connect with other entrepreneurs"],
    exhibitor: "No",
    electricity: "No",
    directoryConsent: "Yes",
    accommodations: "",
    signature: "Ronald Pierre",
    dateSigned: "06/15/2026"
  }
];

// Supabase Configuration
const supabaseUrl = 'https://ntjbyhwnxlloytzsznio.supabase.co';
const supabaseKey = 'sb_publishable_Il4YPdgf9HIY37KIfhO32w_XDmUVdjm';
let supabase = null;
let useSupabase = false;

// Global Data Arrays
let businesses = [];
let registrations = [];

try {
  if (window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
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

// Stats Counters
const statTotalRegistrations = document.getElementById('statTotalRegistrations');
const statTotalExhibitors = document.getElementById('statTotalExhibitors');
const statTotalElectricity = document.getElementById('statTotalElectricity');
const statTotalConsent = document.getElementById('statTotalConsent');

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

// ==========================================================================
// 3. Database Initialization & Seeding
// ==========================================================================
async function initDatabase() {
  console.log("Initializing HACONET database...");
  if (supabase) {
    try {
      // 1. Fetch businesses
      let { data: bData, error: bError } = await supabase.from('businesses').select('*');
      
      if (bError) {
        throw bError;
      }
      
      useSupabase = true;
      console.log("Connected to Supabase database successfully!");

      if (!bData || bData.length === 0) {
        // Table is empty, seed it
        console.log("Seeding businesses table...");
        const { error: seedError } = await supabase.from('businesses').insert(SEED_BUSINESSES);
        if (seedError) console.error("Seeding businesses failed:", seedError);
        businesses = SEED_BUSINESSES;
      } else {
        businesses = bData;
      }

      // 2. Fetch registrations
      let { data: rData, error: rError } = await supabase.from('registrations').select('*');
      if (!rError) {
        if (!rData || rData.length === 0) {
          console.log("Seeding registrations table...");
          const { error: seedError } = await supabase.from('registrations').insert(SEED_REGISTRATIONS);
          if (seedError) console.error("Seeding registrations failed:", seedError);
          registrations = SEED_REGISTRATIONS;
        } else {
          registrations = rData;
        }
      } else {
        console.error("Fetching registrations failed:", rError);
        // Fallback list of registrations inside local storage if select failed
        try {
          const fallbackRegs = JSON.parse(localStorage.getItem('haconet_registrations'));
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
  if (adminDashboard && adminDashboard.style.display === 'block') {
    renderAdminAttendeeList();
  }
}

function loadLocalStorageFallback() {
  console.log("Using browser LocalStorage fallback.");
  
  // Safe parsing for businesses
  try {
    businesses = JSON.parse(localStorage.getItem('haconet_businesses'));
  } catch (e) {
    console.error("Corrupted businesses in localStorage, resetting...", e);
    businesses = null;
  }
  if (!businesses || !Array.isArray(businesses) || businesses.length === 0) {
    businesses = SEED_BUSINESSES;
    try {
      localStorage.setItem('haconet_businesses', JSON.stringify(businesses));
    } catch (e) {
      console.error("Failed to save businesses to localStorage:", e);
    }
  }

  // Safe parsing for registrations
  try {
    registrations = JSON.parse(localStorage.getItem('haconet_registrations'));
  } catch (e) {
    console.error("Corrupted registrations in localStorage, resetting...", e);
    registrations = null;
  }
  if (!registrations || !Array.isArray(registrations)) {
    registrations = SEED_REGISTRATIONS;
    try {
      localStorage.setItem('haconet_registrations', JSON.stringify(registrations));
    } catch (e) {
      console.error("Failed to save registrations to localStorage:", e);
    }
  }
}

// ==========================================================================
// 4. Navigation & Header Animations
// ==========================================================================
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Update nav link highlighting based on section scroll
    let currentSection = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 120)) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

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
const targetEventDate = new Date('August 6, 2026 17:00:00').getTime();

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
      <span class="biz-cat-tag">${biz.category || 'Other'}</span>
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
      const { error } = await supabase.from('businesses').insert([newBiz]);
      if (error) {
        console.error("Supabase write failed:", error);
        alert("Failed to write to database: " + error.message);
        return;
      }
    }

    businesses.push(newBiz);
    if (!useSupabase) {
      localStorage.setItem('haconet_businesses', JSON.stringify(businesses));
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
      accommodations,
      signature,
      dateSigned: regDateField ? regDateField.value : ''
    };

    // 1. Add to Registrations Table in database
    if (useSupabase) {
      const { error } = await supabase.from('registrations').insert([newRegistration]);
      if (error) {
        console.error("Supabase write failed:", error);
        alert("Failed to submit registration: " + error.message);
        return;
      }
    }

    registrations.push(newRegistration);
    if (!useSupabase) {
      localStorage.setItem('haconet_registrations', JSON.stringify(registrations));
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
          interests: interests
        };

        if (useSupabase) {
          const { error } = await supabase.from('businesses').insert([newBizEntry]);
          if (error) {
            console.error("Directory sync write to Supabase failed:", error);
          }
        }

        businesses.push(newBizEntry);
        if (!useSupabase) {
          localStorage.setItem('haconet_businesses', JSON.stringify(businesses));
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

  if (tExhibitor) {
    if (reg.exhibitor === 'Yes') {
      tExhibitor.className = 't-info-val highlight';
      tExhibitor.style.color = 'var(--accent-red)';
    } else {
      tExhibitor.className = 't-info-val';
      tExhibitor.style.color = '#030812';
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

// ==========================================================================
// 10. Staff Administration Portal Logic
// ==========================================================================
function renderAdminAttendeeList() {
  if (!adminTableBody) return;
  adminTableBody.innerHTML = '';
  
  let totalEx = 0;
  let totalElec = 0;
  let totalDir = 0;

  if (registrations.length === 0) {
    adminTableBody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          No registrations recorded yet.
        </td>
      </tr>
    `;
    
    // Update stats counters
    if (statTotalRegistrations) statTotalRegistrations.innerText = '0';
    if (statTotalExhibitors) statTotalExhibitors.innerText = '0';
    if (statTotalElectricity) statTotalElectricity.innerText = '0';
    if (statTotalConsent) statTotalConsent.innerText = '0';
    return;
  }

  registrations.forEach(reg => {
    // Stats calculation
    if (reg.exhibitor === 'Yes') totalEx++;
    if (reg.electricity === 'Yes') totalElec++;
    if (reg.directoryConsent === 'Yes') totalDir++;

    // Safe lowercasing
    const exhibitorClass = (reg.exhibitor || 'no').toLowerCase();
    const electricityClass = (reg.electricity || 'no').toLowerCase();
    const consentClass = (reg.directoryConsent || 'no').toLowerCase();

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
      <td><span class="badge-status ${electricityClass}">${reg.electricity || 'No'}</span></td>
      <td><span class="badge-status ${consentClass}">${reg.directoryConsent || 'No'}</span></td>
      <td style="display: flex; gap: 0.5rem;">
        <button class="admin-action-btn btn-view-reg-ticket" data-id="${reg.regId}" title="View Ticket"><i class="fa-solid fa-ticket"></i></button>
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

  adminTableBody.querySelectorAll('.btn-delete-reg').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm(`Are you sure you want to delete registration ${id}?`)) {
        if (useSupabase) {
          const { error } = await supabase.from('registrations').delete().eq('regId', id);
          if (error) {
            console.error("Supabase deletion failed:", error);
            alert("Failed to delete record: " + error.message);
            return;
          }
        }

        registrations = registrations.filter(r => r.regId !== id);
        if (!useSupabase) {
          localStorage.setItem('haconet_registrations', JSON.stringify(registrations));
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
      adminDashboard.style.display = 'block';
      renderAdminAttendeeList();
      toggleAdminBtn.innerHTML = '<i class="fa-solid fa-lock-open" style="color: var(--accent-gold);"></i> Close Admin Portal';
      
      setTimeout(() => {
        adminDashboard.scrollIntoView({ behavior: 'smooth' });
      }, 100);
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

// Start database fetch and initialization
initDatabase();
