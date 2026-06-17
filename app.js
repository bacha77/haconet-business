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
const SEED_BUSINESSES = [];

const SEED_REGISTRATIONS = [];

// Supabase Configuration
const supabaseUrl = 'https://ntjbyhwnxlloytzsznio.supabase.co';
const supabaseKey = 'sb_publishable_Il4YPdgf9HIY37KIfhO32w_XDmUVdjm';
let supabaseClient = null;
let useSupabase = false;

// Global Data Arrays
let businesses = [];
let registrations = [];

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
    checkedInAt: dbReg.checked_in_at || null
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
      
      useSupabase = true;
      console.log("Connected to Supabase database successfully!");

      if (!bData || bData.length === 0) {
        // Table is empty, seed it
        console.log("Seeding businesses table...");
        const { error: seedError } = await supabaseClient.from('businesses').insert(SEED_BUSINESSES);
        if (seedError) console.error("Seeding businesses failed:", seedError);
        businesses = SEED_BUSINESSES;
      } else {
        businesses = bData;
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
  
  // Check URL parameters for focus registration kiosk mode
  checkUrlParamsForFocusReg();

  // Check URL parameters for any ticket check-ins
  await checkUrlParamsForCheckin();
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
      const { error } = await supabaseClient.from('businesses').insert([newBiz]);
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
          const { error } = await supabaseClient.from('businesses').insert([newBizEntry]);
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

  const tQrCodeImg = document.getElementById('tQrCodeImg');
  if (tQrCodeImg) {
    const checkinUrl = `${window.location.origin}${window.location.pathname}?checkin=${encodeURIComponent(reg.regId)}`;
    tQrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(checkinUrl)}`;
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
  let totalChecked = 0;

  if (registrations.length === 0) {
    adminTableBody.innerHTML = `
      <tr>
        <td colspan="11" style="text-align: center; padding: 2rem; color: var(--text-muted);">
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
      <td>${checkedInBadge}</td>
      <td style="display: flex; gap: 0.5rem;">
        <button class="admin-action-btn btn-view-reg-ticket" data-id="${reg.regId}" title="View Ticket"><i class="fa-solid fa-ticket"></i></button>
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
            localStorage.setItem('haconet_registrations', JSON.stringify(registrations));
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
      const passcode = prompt("Enter HACONET Staff Passcode:");
      if (passcode === null) return; // cancelled
      
      if (passcode.trim().toLowerCase() === 'haconet@2026') {
        adminDashboard.style.display = 'block';
        renderAdminAttendeeList();
        toggleAdminBtn.innerHTML = '<i class="fa-solid fa-lock-open" style="color: var(--accent-gold);"></i> Close Admin Portal';
        
        setTimeout(() => {
          adminDashboard.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        alert("Incorrect passcode. Access denied.");
      }
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
            localStorage.setItem('haconet_registrations', JSON.stringify(registrations));
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
  }
}

// Render registration QR codes on load
const mobileRegQrImg = document.getElementById('mobileRegQrImg');
const heroRegQrImg = document.getElementById('heroRegQrImg');
const regUrl = `${window.location.origin}${window.location.pathname}?register=true`;

if (mobileRegQrImg) {
  mobileRegQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(regUrl)}`;
}
if (heroRegQrImg) {
  heroRegQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(regUrl)}`;
}

// Start database fetch and initialization
initDatabase();
