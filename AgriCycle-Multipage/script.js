/**
 * AgriCycle - Core Frontend Engine & State Store
 * Developed for AgriCycle Multipage & Dashboard Experience
 */

// ==========================================================================
// 1. Initial Mock & Persistent Data
// ==========================================================================
const DEFAULT_LISTINGS = [
  {
    id: "lst_001",
    name: "Paddy Straw",
    cropCategory: "Paddy Straw",
    quantity: 1200,
    availableQuantity: 1200,
    location: "Mandya",
    state: "Karnataka",
    lat: 12.5242,
    lng: 76.8958,
    type: "Sell",
    price: 1.5,
    farmerName: "Mandya Organic Farm",
    farmerContact: "+91 98765 43210",
    emoji: "🌾",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80",
    verified: true,
    qualityGrade: "Grade A (High)",
    moisture: 12,
    dateAdded: "2026-11-01"
  },
  {
    id: "lst_002",
    name: "Coconut Husk",
    cropCategory: "Coconut Husk",
    quantity: 800,
    availableQuantity: 750,
    location: "Udupi",
    state: "Karnataka",
    lat: 13.3409,
    lng: 74.7421,
    type: "Exchange",
    price: 0,
    farmerName: "Suresh Shetty",
    farmerContact: "+91 91234 56789",
    emoji: "🥥",
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=700&q=80",
    verified: true,
    qualityGrade: "Grade A (High)",
    moisture: 14,
    dateAdded: "2026-11-02"
  },
  {
    id: "lst_003",
    name: "Sugarcane Bagasse",
    cropCategory: "Sugarcane Bagasse",
    quantity: 3500,
    availableQuantity: 3500,
    location: "Belagavi",
    state: "Karnataka",
    lat: 15.8497,
    lng: 74.4977,
    type: "Sell",
    price: 2.0,
    farmerName: "Anand Patil",
    farmerContact: "+91 94481 23456",
    emoji: "🎋",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=700&q=80",
    verified: false,
    qualityGrade: "Grade B (Medium)",
    moisture: 22,
    dateAdded: "2026-11-03"
  },
  {
    id: "lst_004",
    name: "Areca Leaf Sheaths",
    cropCategory: "Areca Leaf",
    quantity: 650,
    availableQuantity: 650,
    location: "Sirsi",
    state: "Karnataka",
    lat: 14.6195,
    lng: 74.8354,
    type: "Sell",
    price: 3.5,
    farmerName: "Narayana Bhat",
    farmerContact: "+91 94480 11223",
    emoji: "🍃",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=80",
    verified: true,
    qualityGrade: "Grade A (High)",
    moisture: 10,
    dateAdded: "2026-11-04"
  },
  {
    id: "lst_005",
    name: "Cotton Stalk Biomass",
    cropCategory: "Cotton Stalk",
    quantity: 1800,
    availableQuantity: 1800,
    location: "Dharwad",
    state: "Karnataka",
    lat: 15.4589,
    lng: 75.0078,
    type: "Free",
    price: 0,
    farmerName: "Basavaraj K",
    farmerContact: "+91 98801 33445",
    emoji: "🌱",
    image: "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&w=700&q=80",
    verified: false,
    qualityGrade: "Grade B (Medium)",
    moisture: 18,
    dateAdded: "2026-11-05"
  },
  {
    id: "lst_006",
    name: "Banana Stem Residue",
    cropCategory: "Other",
    quantity: 900,
    availableQuantity: 900,
    location: "Kumta",
    state: "Karnataka",
    lat: 14.4259,
    lng: 74.4172,
    type: "Exchange",
    price: 0,
    farmerName: "Ganapati Naik",
    farmerContact: "+91 97412 88990",
    emoji: "🍌",
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=700&q=80",
    verified: true,
    qualityGrade: "Grade A (High)",
    moisture: 30,
    dateAdded: "2026-11-06"
  }
];

const DEFAULT_REQUESTS = [
  {
    id: "REQ-001",
    listingId: "lst_001",
    material: "Paddy Straw",
    quantity: 300,
    unitPrice: 1.5,
    totalAmount: 450,
    generator: "Mandya Farm Co-op (Farmer)",
    utilizer: "BioCompost Agro Unit (Customer)",
    status: "pending",
    proposedDate: "2026-11-15",
    deliveryMethod: "self_pickup",
    location: "Mandya",
    notes: "Need for mushroom substrate bed preparation."
  },
  {
    id: "REQ-002",
    listingId: "lst_002",
    material: "Coconut Husk",
    quantity: 250,
    unitPrice: 0,
    totalAmount: 0,
    generator: "Suresh Shetty (Farmer)",
    utilizer: "Coastal Nursery Supplies",
    status: "accepted",
    proposedDate: "2026-11-18",
    deliveryMethod: "farmer_delivery",
    location: "Udupi",
    notes: "Exchange against 2 bags of organic compost fertilizer."
  },
  {
    id: "REQ-003",
    listingId: "lst_004",
    material: "Areca Leaf Sheaths",
    quantity: 500,
    unitPrice: 3.5,
    totalAmount: 1750,
    generator: "Narayana Bhat (Farmer)",
    utilizer: "EcoPlate Biodegradables",
    status: "in_transit",
    proposedDate: "2026-11-10",
    deliveryMethod: "third_party_transport",
    location: "Sirsi",
    notes: "Transport truck arranged for eco-plate manufacturing unit."
  },
  {
    id: "REQ-004",
    listingId: "lst_003",
    material: "Sugarcane Bagasse",
    quantity: 1000,
    unitPrice: 2.0,
    totalAmount: 2000,
    generator: "Anand Patil (Farmer)",
    utilizer: "Belagavi Paper Mills",
    status: "completed",
    proposedDate: "2026-11-04",
    deliveryMethod: "self_pickup",
    location: "Belagavi",
    notes: "Delivered and verified. Payment settled in cash."
  }
];

const DEFAULT_ANALYSES = [
  {
    id: "ana_001",
    wasteCategory: "Rice Straw",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80",
    visualObservations: {
      colour: "Light golden",
      visibleCondition: "Good",
      visibleDamage: "Low",
      visibleContamination: "Low",
      visibleDeterioration: "Not detected",
      fungalGrowth: "Not visibly detected"
    },
    visualQuality: {
      preliminaryGrade: "A",
      description: "Dry, uniform golden straw with low foreign matter.",
      confidence: 0.94
    },
    farmerInputs: {
      quantityKg: 1200,
      moisturePercentage: 14.0,
      moistureUnknown: false,
      storageCondition: "Covered storage",
      harvestDate: "2026-11-10",
      location: "Mandya, Karnataka",
      notes: "Baled tightly in rectangular 25kg bundles; sun-dried for 4 days after harvest.",
      isDried: true
    },
    qualityGrade: "A",
    qualityScore: 88,
    completenessPercentage: 100,
    scoreBreakdown: {
      visualScore: 30,
      damageScore: 25,
      contaminationScore: 25,
      moistureScore: 20
    },
    valuation: {
      estimatedPricePerKg: 2.50,
      estimatedTotalPrice: 3000.00,
      valuationBasis: "Base benchmark: ₹2.50/kg for Grade A (High Quality) with +₹0.10/kg bulk incentive",
      confidenceLevel: "High"
    },
    recommendations: [
      {
        application: "Mushroom Cultivation Substrate",
        priority: "High",
        description: "Optimal substrate for oyster and paddy straw mushroom mycelium growth.",
        suitable: true
      },
      {
        application: "Livestock Fodder & Bedding",
        priority: "High",
        description: "Clean dry golden straw suitable for cattle feeding and comfortable dry bedding.",
        suitable: true
      },
      {
        application: "Biomass Briquetting & Pelleting",
        priority: "Medium",
        description: "High calorific value when compressed into industrial heating briquettes.",
        suitable: true
      }
    ],
    rulesVersion: "1.0.0-provisional",
    createdAt: "2026-11-15T10:30:00.000Z",
    publishedListingId: "lst_001"
  },
  {
    id: "ana_002",
    wasteCategory: "Sugarcane Bagasse",
    imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=700&q=80",
    visualObservations: {
      colour: "Pale brownish-yellow",
      visibleCondition: "Fair",
      visibleDamage: "Medium",
      visibleContamination: "Low",
      visibleDeterioration: "Slight weathering",
      fungalGrowth: "Not visibly detected"
    },
    visualQuality: {
      preliminaryGrade: "B",
      description: "Fibrous crushed sugarcane residue with moderate moisture retention.",
      confidence: 0.90
    },
    farmerInputs: {
      quantityKg: 3500,
      moisturePercentage: 22.0,
      moistureUnknown: false,
      storageCondition: "Covered storage",
      harvestDate: "2026-11-08",
      location: "Belagavi, Karnataka",
      notes: "Post-crush mill residue.",
      isDried: false
    },
    qualityGrade: "B",
    qualityScore: 71,
    completenessPercentage: 100,
    scoreBreakdown: {
      visualScore: 20,
      damageScore: 15,
      contaminationScore: 25,
      moistureScore: 14
    },
    valuation: {
      estimatedPricePerKg: 1.80,
      estimatedTotalPrice: 6300.00,
      valuationBasis: "Base benchmark: ₹1.80/kg for Grade B (Medium Quality) with +₹0.20/kg bulk volume incentive",
      confidenceLevel: "Medium"
    },
    recommendations: [
      {
        application: "Biofuel Boiler Feedstock",
        priority: "High",
        description: "Excellent renewable co-firing fuel for sugar mill and textile factory boilers.",
        suitable: true
      },
      {
        application: "Paper & Pulp Board Manufacturing",
        priority: "High",
        description: "Lignocellulosic fiber matrix well-suited for paper and packaging board.",
        suitable: true
      },
      {
        application: "Enriched Organic Compost",
        priority: "Medium",
        description: "Slow decomposing high-carbon organic amendment for depleted soils.",
        suitable: true
      }
    ],
    rulesVersion: "1.0.0-provisional",
    createdAt: "2026-11-18T14:15:00.000Z",
    publishedListingId: "lst_003"
  }
];

// Load from LocalStorage or initialize with defaults
function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Could not load ${key}:`, err);
    return fallback;
  }
}

function saveData(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn(`Could not save ${key}:`, err);
  }
}

let listings = loadData("agricycle_listings", DEFAULT_LISTINGS);
let requests = loadData("agricycle_requests", DEFAULT_REQUESTS);
let analyses = loadData("agricycle_analyses", DEFAULT_ANALYSES);

// Default User Context (Dynamically configured on Sign In)
const USERS = {
  farmer: {
    id: "usr_farmer_default",
    name: "Farmer",
    role: "generator",
    label: "🌾 Farmer",
    location: "Mandya, Karnataka",
    lat: 12.5242,
    lng: 76.8958,
    phone: "+91 98765 43210"
  },
  utilizer: {
    id: "usr_utilizer_default",
    name: "Customer",
    role: "utilizer",
    label: "🛒 Customer",
    location: "Mysore, Karnataka",
    lat: 12.2958,
    lng: 76.6394,
    phone: "+91 98450 12345"
  }
};

let currentUser = loadData("agricycle_active_user", USERS.farmer);

// Maintain role integrity for active user
if (currentUser) {
  const isFarmer = currentUser.role === "generator";
  const roleIcon = isFarmer ? "🌾" : "🛒";
  const roleTitle = isFarmer ? "Farmer" : "Customer";
  const displayName = currentUser.name && currentUser.name !== "Farmer" && currentUser.name !== "Customer"
    ? ` (${currentUser.name})`
    : "";
  if (!currentUser.label || (isFarmer && !currentUser.label.includes("Farmer")) || (!isFarmer && !currentUser.label.includes("Customer"))) {
    currentUser.label = `${roleIcon} ${roleTitle}${displayName}`;
  }
}

// ==========================================================================
// 2. Haversine Formula for Distance Calculation (Matching Backend)
// ==========================================================================
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 15; // default fallback
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Compute distance from current user
listings.forEach(item => {
  item.distanceKm = calculateDistanceKm(currentUser.lat, currentUser.lng, item.lat, item.lng);
});

// ==========================================================================
// 3. UI Helper Utilities (Toast, Nav, Role Toggle)
// ==========================================================================
const toastEl = document.getElementById("toast");
function showToast(message, type = "info") {
  if (!toastEl) return;
  const icon = type === "success" ? "✓" : type === "error" ? "⚠" : "ℹ";
  toastEl.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toastEl.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toastEl.classList.remove("show"), 3200);
}

// Setup Mobile Navigation Toggle
const menuToggle = document.getElementById("menuToggle");
const navEl = document.getElementById("nav");
if (menuToggle && navEl) {
  menuToggle.addEventListener("click", () => navEl.classList.toggle("open"));
}

// Setup User Identity Badge in Topbar (locked to authenticated role with running name ticker)
function setupRoleSwitcher() {
  const roleBadge = document.getElementById("roleSwitcherBtn");
  if (!roleBadge) return;

  function updateRoleDisplay() {
    const isFarmer = currentUser.role === "generator";
    const roleIcon = isFarmer ? "🌾" : "🛒";
    const roleTitle = isFarmer ? "Farmer" : "Customer";
    const rawName = currentUser.name && currentUser.name !== "Farmer" && currentUser.name !== "Customer" 
      ? currentUser.name 
      : "";

    if (rawName) {
      roleBadge.innerHTML = `
        <span class="role-dot"></span>
        <span class="role-type-tag">${roleIcon} ${roleTitle}</span>
        <span class="role-divider">|</span>
        <span class="role-marquee-container" title="Active Account: ${rawName}">
          <span class="role-marquee-track">
            <span class="role-marquee-item">${rawName}</span>
            <span class="role-marquee-spacer">•</span>
            <span class="role-marquee-item">${rawName}</span>
            <span class="role-marquee-spacer">•</span>
          </span>
        </span>
      `;
    } else {
      roleBadge.innerHTML = `<span class="role-dot"></span><span class="role-type-tag">${roleIcon} ${roleTitle}</span>`;
    }
    roleBadge.setAttribute("title", `Logged in as ${currentUser.name || roleTitle} (${roleTitle})`);
  }
  updateRoleDisplay();

  // Role identity is permanent and locked to authentication
  // Clicking badge displays user profile info rather than switching roles
  roleBadge.addEventListener("click", () => {
    const isFarmer = currentUser.role === "generator";
    const roleTitle = isFarmer ? "Farmer" : "Customer";
    const nameStr = currentUser.name ? `${currentUser.name} (${roleTitle})` : roleTitle;
    showToast(`Active User: ${nameStr}`, "info");
  });
}
setupRoleSwitcher();

// Global Sign Out handler
function handleSignOut(event) {
  if (event) event.preventDefault();
  localStorage.removeItem("agricycle_token");
  localStorage.removeItem("agricycle_active_user");
  if (typeof showToast === "function") {
    showToast("Signed out successfully. Returning to sign-in...", "info");
  }
  setTimeout(() => {
    window.location.href = "index.html";
  }, 350);
}
window.handleSignOut = handleSignOut;

// Setup Auth Button in Topbar (Always ensure Sign Out on interior pages)
function setupAuthButton() {
  const authBtns = document.querySelectorAll(".topbar-actions a, #authNavBtn");
  authBtns.forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();
    if (text === "sign in" || text === "sign out" || btn.id === "authNavBtn") {
      btn.id = "authNavBtn";
      btn.textContent = "Sign Out";
      btn.href = "index.html";
      btn.classList.add("btn-signout");
      btn.title = "Click to Sign Out of AgriCycle";
      btn.onclick = handleSignOut;
    }
  });
}
setupAuthButton();


// ==========================================================================
// 4. Browse Waste Page & Leaflet Map Integration
// ==========================================================================
let leafletMap = null;
let mapMarkers = [];

function initBrowsePage() {
  const grid = document.getElementById("listingGrid");
  if (!grid) return;

  const searchInput = document.getElementById("searchInput");
  const locationInput = document.getElementById("locationInput");
  const sortSelect = document.getElementById("sortSelect");
  const searchBtn = document.getElementById("searchBtn");
  const typeBoxes = document.querySelectorAll('input[name="type"]');
  const verifiedOnly = document.getElementById("verifiedOnly");
  const maxDistanceSlider = document.getElementById("maxDistanceSlider");
  const distanceValueLabel = document.getElementById("distanceValueLabel");
  const resultsCount = document.getElementById("resultsCount");
  const emptyState = document.getElementById("emptyState");

  // View mode switcher: Cards vs Map vs Split
  const viewBtns = document.querySelectorAll(".view-btn");
  const mapWrap = document.getElementById("mapWrap");

  viewBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      viewBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.dataset.view;
      if (mode === "cards") {
        if (mapWrap) mapWrap.classList.add("hidden");
        grid.classList.remove("hidden");
      } else if (mode === "map") {
        if (mapWrap) mapWrap.classList.remove("hidden");
        grid.classList.add("hidden");
        if (leafletMap) setTimeout(() => leafletMap.invalidateSize(), 200);
      } else {
        // split view
        if (mapWrap) mapWrap.classList.remove("hidden");
        grid.classList.remove("hidden");
        if (leafletMap) setTimeout(() => leafletMap.invalidateSize(), 200);
      }
    });
  });

  if (maxDistanceSlider && distanceValueLabel) {
    maxDistanceSlider.addEventListener("input", () => {
      distanceValueLabel.textContent = `${maxDistanceSlider.value} km`;
      renderListings();
    });
  }

  // Init Leaflet Map if library available
  function setupMap() {
    const mapDiv = document.getElementById("map");
    if (!mapDiv || typeof L === "undefined") return;

    leafletMap = L.map("map").setView([13.8, 75.8], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    }).addTo(leafletMap);

    // Add current user location marker
    const userIcon = L.divIcon({
      className: "user-loc-icon",
      html: `<div style="background:#143d28;color:#fff;border-radius:50%;width:30px;height:30px;display:grid;place-items:center;font-size:16px;border:2px solid #d6ef92;box-shadow:0 4px 10px rgba(0,0,0,0.3)">📍</div>`,
      iconSize: [30, 30]
    });
    L.marker([currentUser.lat, currentUser.lng], { icon: userIcon })
      .addTo(leafletMap)
      .bindPopup(`<b>Your Current Location:</b><br>${currentUser.location}`);
  }

  function updateMapMarkers(data) {
    if (!leafletMap || typeof L === "undefined") return;
    mapMarkers.forEach(m => leafletMap.removeLayer(m));
    mapMarkers = [];

    data.forEach(item => {
      const pinHtml = `<div style="background:#fff;border:2px solid #2b774a;border-radius:50%;width:34px;height:34px;display:grid;place-items:center;font-size:18px;box-shadow:0 3px 8px rgba(0,0,0,0.2)">${item.emoji}</div>`;
      const customIcon = L.divIcon({
        className: "custom-crop-marker",
        html: pinHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(leafletMap);
      const popupContent = `
        <div class="popup-card">
          <h4>${item.emoji} ${item.name}</h4>
          <p class="popup-meta"><b>Qty:</b> ${item.availableQuantity} kg | <b>Price:</b> ${item.type === 'Sell' ? '₹' + item.price + '/kg' : item.type}</p>
          <p class="popup-meta"><b>Location:</b> ${item.location} (~${item.distanceKm} km away)</p>
          <p class="popup-meta"><b>Farmer:</b> ${item.farmerName}</p>
          <button class="btn btn-green btn-sm" onclick="openRequestModal('${item.id}')">Request This Material ↗</button>
        </div>
      `;
      marker.bindPopup(popupContent);
      mapMarkers.push(marker);
    });
  }

  function renderListings() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    const loc = (locationInput?.value || "").trim().toLowerCase();
    const selectedTypes = [...document.querySelectorAll('input[name="type"]:checked')].map(x => x.value);
    const requireVerified = verifiedOnly?.checked || false;
    const maxDist = maxDistanceSlider ? Number(maxDistanceSlider.value) : 500;

    let filtered = listings.filter(item => {
      const matchQ = !q || item.name.toLowerCase().includes(q) || item.cropCategory.toLowerCase().includes(q) || item.farmerName.toLowerCase().includes(q);
      const matchLoc = !loc || item.location.toLowerCase().includes(loc) || item.state.toLowerCase().includes(loc);
      const matchType = !selectedTypes.length || selectedTypes.includes(item.type);
      const matchVerified = !requireVerified || item.verified;
      const matchDist = item.distanceKm <= maxDist;
      return matchQ && matchLoc && matchType && matchVerified && matchDist;
    });

    const sort = sortSelect?.value || "recommended";
    if (sort === "distance") {
      filtered.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sort === "quantity") {
      filtered.sort((a, b) => b.availableQuantity - a.availableQuantity);
    } else if (sort === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "verified") {
      filtered.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
    }

    if (resultsCount) {
      resultsCount.textContent = `Showing ${filtered.length} material listing${filtered.length === 1 ? "" : "s"} across Karnataka`;
    }
    if (emptyState) {
      emptyState.classList.toggle("hidden", filtered.length > 0);
    }

    grid.innerHTML = "";
    filtered.forEach(item => {
      const card = document.createElement("article");
      card.className = "card";

      const badgeHtml = item.verified
        ? `<div class="card-badge-top"><span class="ai-badge">✓ AI Verified (${item.qualityGrade || 'Grade A'})</span></div>`
        : "";

      const priceDisplay = item.type === "Sell" ? `₹${item.price}<small>/kg</small>` : item.type;
      const pillClass = item.type === "Exchange" ? "exchange" : item.type === "Free" ? "free" : "";

      card.innerHTML = `
        <div class="card-img-wrap">
          ${badgeHtml}
          <div class="card-img">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.replaceWith('${item.emoji}')">` : item.emoji}
          </div>
        </div>
        <div class="card-body">
          <div class="card-title-row">
            <h3>${item.emoji} ${item.name}</h3>
            <span class="pill ${pillClass}">${item.type}</span>
          </div>
          <p class="meta">
            <span>⚖ <b>${item.availableQuantity} kg</b> available</span>
            <span>⌖ <b>${item.distanceKm} km</b> away (${item.location})</span>
          </p>
          <div style="font-size:11.5px;color:var(--muted);margin-bottom:8px">
            Farmer: <b>${item.farmerName}</b> • Moisture: <b>${item.moisture}%</b>
          </div>
          <div class="card-bottom">
            <strong>${priceDisplay}</strong>
            <button class="btn btn-green btn-sm" onclick="openRequestModal('${item.id}')">Request Material ↗</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    updateMapMarkers(filtered);
  }

  setupMap();
  renderListings();

  [searchInput, locationInput].forEach(el => el?.addEventListener("input", renderListings));
  sortSelect?.addEventListener("change", renderListings);
  searchBtn?.addEventListener("click", renderListings);
  typeBoxes.forEach(box => box.addEventListener("change", renderListings));
  verifiedOnly?.addEventListener("change", renderListings);
}

// ==========================================================================
// 5. Exchange Request Modal & Submission
// ==========================================================================
let activeListingForModal = null;

function setupRequestModal() {
  const modal = document.getElementById("requestModal");
  if (!modal) return;

  const closeBtn = document.getElementById("modalCloseBtn");
  const form = document.getElementById("requestForm");

  window.openRequestModal = function(listingId) {
    const item = listings.find(x => x.id === listingId);
    if (!item) return;
    activeListingForModal = item;

    document.getElementById("modalListingTitle").textContent = `${item.emoji} Request: ${item.name}`;
    document.getElementById("modalListingMeta").textContent = `${item.availableQuantity} kg available from ${item.farmerName} (${item.location})`;
    
    const qtyInput = document.getElementById("reqQuantity");
    qtyInput.max = item.availableQuantity;
    qtyInput.value = Math.min(250, item.availableQuantity);

    const priceLabel = document.getElementById("modalUnitPrice");
    if (priceLabel) {
      priceLabel.textContent = item.type === "Sell" ? `₹${item.price} per kg` : item.type;
    }

    calculateModalTotal();
    modal.classList.add("active");
  };

  function calculateModalTotal() {
    const totalEl = document.getElementById("modalTotalCalc");
    if (!totalEl || !activeListingForModal) return;
    const qty = Number(document.getElementById("reqQuantity").value) || 0;
    if (activeListingForModal.type === "Sell") {
      const total = qty * activeListingForModal.price;
      totalEl.textContent = `₹${total.toLocaleString("en-IN")}`;
    } else {
      totalEl.textContent = `${activeListingForModal.type} (₹0)`;
    }
  }

  document.getElementById("reqQuantity")?.addEventListener("input", calculateModalTotal);

  closeBtn?.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("active");
  });

  form?.addEventListener("submit", e => {
    e.preventDefault();
    if (!activeListingForModal) return;

    const requestedQty = Number(document.getElementById("reqQuantity").value);
    const pickupDate = document.getElementById("reqPickupDate").value;
    const deliveryMethod = document.getElementById("reqDeliveryMethod").value;
    const notes = document.getElementById("reqNotes").value.trim();

    if (requestedQty <= 0 || requestedQty > activeListingForModal.availableQuantity) {
      showToast("Invalid quantity requested.", "error");
      return;
    }

    const unitPrice = activeListingForModal.type === "Sell" ? activeListingForModal.price : 0;
    const newReq = {
      id: `REQ-00${requests.length + 1}`,
      listingId: activeListingForModal.id,
      material: activeListingForModal.name,
      quantity: requestedQty,
      unitPrice: unitPrice,
      totalAmount: unitPrice * requestedQty,
      generator: `${activeListingForModal.farmerName} (Farmer)`,
      utilizer: currentUser.name,
      status: "pending",
      proposedDate: pickupDate || new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
      deliveryMethod: deliveryMethod,
      location: activeListingForModal.location,
      notes: notes || "Direct request from AgriCycle web portal."
    };

    requests.unshift(newReq);
    saveData("agricycle_requests", requests);

    // Deduct available quantity
    activeListingForModal.availableQuantity -= requestedQty;
    saveData("agricycle_listings", listings);

    modal.classList.remove("active");
    form.reset();
    showToast(`Exchange request ${newReq.id} submitted successfully!`, "success");

    // Optional sync with backend if running
    fetch("http://localhost:5000/api/exchanges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId: activeListingForModal.id,
        quantityKg: requestedQty,
        deliveryMethod,
        notes
      })
    }).catch(() => {
      // Offline/demo mode fallback (silent)
    });

    setTimeout(() => {
      if (confirm("Request created! Would you like to view your requests table now?")) {
        window.location.href = "requests.html";
      }
    }, 600);
  });
}
setupRequestModal();

// ==========================================================================
// 6. Responsive Dashboard (Farmer & Utilizer Views)
// ==========================================================================
function initDashboard() {
  const container = document.getElementById("dashboardRoot");
  if (!container) return;

  const roleTabs = document.querySelectorAll(".role-tab");
  let currentDashboardRole = currentUser.role === "generator" ? "farmer" : "utilizer";

  roleTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      roleTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentDashboardRole = tab.dataset.role;
      renderDashboard();
    });
  });

  window.renderDashboard = function() {
    // Calculate live aggregated metrics
    const totalListings = listings.length;
    const totalDivertedKg = requests
      .filter(r => r.status === "completed" || r.status === "in_transit")
      .reduce((sum, r) => sum + r.quantity, 0) + 2450; // demo baseline

    const pendingRequests = requests.filter(r => r.status === "pending").length;
    const co2SavedKg = Math.round(totalDivertedKg * 1.45); // 1.45 kg CO2e per kg straw not burned
    const revenueGenerated = requests
      .filter(r => r.status === "completed")
      .reduce((sum, r) => sum + r.totalAmount, 0) + 14200;

    // Crop Distribution Data
    const cropTotals = {};
    listings.forEach(l => {
      cropTotals[l.cropCategory] = (cropTotals[l.cropCategory] || 0) + l.quantity;
    });

    const cropBarsHtml = Object.entries(cropTotals)
      .map(([name, kg]) => {
        const pct = Math.min(100, Math.round((kg / 5000) * 100));
        return `
          <div class="crop-bar-row">
            <div class="crop-bar-info"><span>${name}</span><span>${kg} kg (${pct}%)</span></div>
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
          </div>
        `;
      })
      .join("");

    // Farmer view vs Utilizer view specific content
    let roleSpecificHtml = "";

    if (currentDashboardRole === "farmer") {
      // Farmer View: Listings manager + Incoming Requests
      const myListings = listings; // in demo, show all with delete/status control
      const incomingReqs = requests;

      roleSpecificHtml = `
        <div class="dashboard-visuals-grid">
          <div class="chart-card">
            <h3>🌾 Crop Residue Inventory Breakdown <small>Total ${listings.reduce((a,b)=>a+b.quantity,0)} kg registered</small></h3>
            <div class="crop-bars">${cropBarsHtml}</div>
          </div>
          <div class="chart-card">
            <h3>♻️ Exchange Fulfillment Ratio</h3>
            <div class="donut-preview">
              <div class="donut-circle">
                <div class="donut-hole">
                  <strong>84%</strong>
                  <span>Reused</span>
                </div>
              </div>
              <div class="legend-list">
                <div class="legend-item"><span class="legend-color" style="background:var(--green)"></span> Paddy Straw (42%)</div>
                <div class="legend-item"><span class="legend-color" style="background:var(--lime)"></span> Coconut Husk (26%)</div>
                <div class="legend-item"><span class="legend-color" style="background:var(--sky)"></span> Bagasse (17%)</div>
                <div class="legend-item"><span class="legend-color" style="background:var(--amber)"></span> Others (15%)</div>
              </div>
            </div>
          </div>
        </div>

        <div class="section-head">
          <div>
            <span class="eyebrow">FARMER CONTROL PANEL</span>
            <h2>My Active Waste Listings</h2>
          </div>
          <a class="btn btn-green btn-sm" href="list-waste.html">+ New Waste Listing</a>
        </div>

        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Crop & Title</th>
                <th>Available / Total</th>
                <th>Price / Type</th>
                <th>Location</th>
                <th>AI Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${myListings.map(l => `
                <tr>
                  <td><b>${l.emoji} ${l.name}</b></td>
                  <td>${l.availableQuantity} / ${l.quantity} kg</td>
                  <td>${l.type === 'Sell' ? '₹' + l.price + '/kg' : l.type}</td>
                  <td>${l.location}</td>
                  <td><span class="pill ${l.verified ? '' : 'exchange'}">${l.qualityGrade}</span></td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="deleteListing('${l.id}')">Delete</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="section-head" style="margin-top:36px">
          <div>
            <span class="eyebrow">AI QUALITY ASSESSMENTS & INTELLIGENT VALUATION</span>
            <h2>Batch Quality Assessment History</h2>
            <p>Certified visual inspections, 100-point scores, and circular value estimates generated by Google Gemini & Python Quality Engine.</p>
          </div>
          <a class="btn btn-green btn-sm" href="list-waste.html">🔬 New Quality Assessment</a>
        </div>

        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Residue & Date</th>
                <th>Visual Condition</th>
                <th>Certified Grade</th>
                <th>Quality Score</th>
                <th>Valuation Estimate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${analyses.length === 0 ? `
                <tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px">No AI quality assessments yet. <a href="list-waste.html" style="color:var(--green);font-weight:700">Run an assessment ➔</a></td></tr>
              ` : analyses.map(a => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px">
                      <img src="${a.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80'}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;border:1px solid var(--line)" alt="${a.wasteCategory}">
                      <div>
                        <b>${a.wasteCategory}</b>
                        <div style="font-size:11px;color:var(--muted)">${new Date(a.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style="font-size:12px"><b>${a.visualObservations?.visibleCondition || 'Good'}</b> condition</div>
                    <div style="font-size:11px;color:var(--muted)">${a.visualObservations?.colour || 'Standard'} • Dam: ${a.visualObservations?.visibleDamage || 'Low'}</div>
                  </td>
                  <td>
                    <span class="obs-badge ${a.qualityGrade === 'A' ? 'grade-a' : a.qualityGrade === 'B' ? 'grade-b' : 'grade-c'}">Grade ${a.qualityGrade}</span>
                  </td>
                  <td>
                    <div style="font-weight:800;color:var(--forest)">${a.qualityScore}/100</div>
                    <div style="font-size:11px;color:var(--muted)">${a.completenessPercentage || 100}% verified</div>
                  </td>
                  <td>
                    <div style="font-weight:800;color:var(--green)">₹${Number(a.valuation?.estimatedTotalPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    <div style="font-size:11px;color:var(--muted)">₹${Number(a.valuation?.estimatedPricePerKg || 0).toFixed(2)}/kg • ${a.farmerInputs?.quantityKg || a.quantityKg || 0} kg</div>
                  </td>
                  <td>
                    <span class="pill ${a.publishedListingId ? '' : 'exchange'}">${a.publishedListingId ? '✓ Published' : 'Draft'}</span>
                  </td>
                  <td>
                    <div style="display:flex;gap:6px">
                      <button class="btn btn-outline btn-sm" onclick="openAnalysisModal('${a.id || a._id}')">View</button>
                      ${!a.publishedListingId ? `<button class="btn btn-green btn-sm" onclick="quickPublishAnalysis('${a.id || a._id}')">Publish</button>` : ''}
                      <button class="btn btn-outline btn-sm" onclick="deleteAnalysis('${a.id || a._id}')" title="Delete">🗑</button>
                    </div>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    } else {
      // Utilizer View: Smart Proximity Recommendations + Outbound Requests
      // Proximity score matching (using Haversine)
      const recommendations = [...listings].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 4);

      roleSpecificHtml = `
        <div class="section-head">
          <div>
            <span class="eyebrow">PROXIMITY MATCHING ALGORITHM (HAVERSINE)</span>
            <h2>Top Recommended Biomass Near You</h2>
            <p>Calculated for ${currentUser.location} based on travel distance and quality purity.</p>
          </div>
          <a class="btn btn-outline btn-sm" href="browse.html">View All on Map ↗</a>
        </div>

        <div class="cards" style="margin-bottom:40px">
          ${recommendations.map(item => {
            const matchScore = Math.max(70, Math.min(99, 100 - item.distanceKm));
            return `
              <article class="card">
                <div class="card-img-wrap">
                  <div class="card-badge-top">
                    <span class="ai-badge" style="background:var(--green)">⚡ ${matchScore}% Match</span>
                    ${item.verified ? '<span class="ai-badge">✓ Verified</span>' : ''}
                  </div>
                  <div class="card-img">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.emoji}
                  </div>
                </div>
                <div class="card-body">
                  <div class="card-title-row">
                    <h3>${item.emoji} ${item.name}</h3>
                    <span class="pill ${item.type === 'Exchange' ? 'exchange' : item.type === 'Free' ? 'free' : ''}">${item.type}</span>
                  </div>
                  <p class="meta">
                    <span>⌖ <b>${item.distanceKm} km</b> away</span>
                    <span>⚖ <b>${item.availableQuantity} kg</b> available</span>
                  </p>
                  <p style="font-size:11.5px;color:var(--muted);margin-bottom:12px">${item.farmerName} • Moisture ${item.moisture}%</p>
                  <button class="btn btn-green btn-sm" style="width:100%" onclick="openRequestModal('${item.id}')">Instant Request ↗</button>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="dashboard-kpi-grid">
        <div class="kpi-card emerald">
          <div class="kpi-icon">♻️</div>
          <div class="kpi-value">${totalDivertedKg.toLocaleString()} kg</div>
          <div class="kpi-label">Agricultural Waste Diverted</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon">🌾</div>
          <div class="kpi-value">${totalListings}</div>
          <div class="kpi-label">Active Regional Listings</div>
        </div>
        <div class="kpi-card amber">
          <div class="kpi-icon">⏳</div>
          <div class="kpi-value">${pendingRequests}</div>
          <div class="kpi-label">Pending Exchange Approvals</div>
        </div>
        <div class="kpi-card sky">
          <div class="kpi-icon">🌱</div>
          <div class="kpi-value">${co2SavedKg.toLocaleString()} kg</div>
          <div class="kpi-label">CO₂ Emissions Avoided</div>
        </div>
      </div>

      ${roleSpecificHtml}
    `;
  };

  window.deleteListing = function(id) {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    listings = listings.filter(l => l.id !== id);
    saveData("agricycle_listings", listings);
    showToast("Listing removed successfully.", "info");
    renderDashboard();
  };

  window.openAnalysisModal = function(id) {
    const a = analyses.find(x => (x.id === id || x._id === id));
    if (!a) return;

    const modal = document.getElementById("analysisDetailModal");
    const content = document.getElementById("modalReportContent");
    if (!modal || !content) return;

    const b = a.scoreBreakdown || { visualScore: 30, damageScore: 25, contaminationScore: 25, moistureScore: 20 };
    const recsHtml = (a.recommendations || []).map(r => `
      <div class="rec-card" style="padding:12px;margin-bottom:8px">
        <div class="rec-title-row" style="margin-bottom:4px">
          <strong style="font-size:13px">${r.application}</strong>
          <span class="obs-badge ${r.priority === 'High' ? 'grade-a' : 'grade-b'}">${r.priority}</span>
        </div>
        <p style="font-size:12px;color:var(--muted);margin:0">${r.description}</p>
      </div>
    `).join("");

    content.innerHTML = `
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px">
        <div>
          <span class="report-badge-pill">AgriCycle Certified AI Quality Report</span>
          <h2 style="font-size:20px;color:var(--forest);margin-top:6px">${a.wasteCategory}</h2>
          <p style="font-size:12px;color:var(--muted);margin:0">Assessed on ${new Date(a.createdAt).toLocaleString("en-IN")} • ${a.rulesVersion || 'Rules v1.0.0'}</p>
        </div>
        <div class="grade-stamp ${a.qualityGrade === 'B' ? 'grade-b' : a.qualityGrade === 'C' ? 'grade-c' : ''}" style="width:54px;height:54px;font-size:24px">${a.qualityGrade}</div>
      </div>

      <div style="display:grid;grid-template-columns:120px 1fr;gap:16px;margin-bottom:16px;background:var(--paper);padding:14px;border-radius:var(--radius-md);border:1px solid var(--line)">
        <img src="${a.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80'}" style="width:100%;height:100px;object-fit:cover;border-radius:6px;border:1px solid var(--line)" alt="${a.wasteCategory}">
        <div>
          <div style="font-size:22px;font-weight:900;color:var(--forest)">${a.qualityScore} <small style="font-size:13px;font-weight:600;color:var(--muted)">/ 100 Quality Score</small></div>
          <div style="font-size:12px;color:var(--muted);margin-bottom:8px">Completeness: <b>${a.completenessPercentage || 100}%</b> ${a.completenessPercentage < 100 ? '(Moisture unmeasured)' : ''}</div>
          <div style="font-size:12px">
            <span>Color: <b>${a.visualObservations?.colour || 'Standard'}</b></span> • 
            <span>Damage: <b>${a.visualObservations?.visibleDamage || 'Low'}</b></span> • 
            <span>Contamination: <b>${a.visualObservations?.visibleContamination || 'Low'}</b></span>
          </div>
          <div style="font-size:12px;margin-top:4px">
            <span>Fungal / Mould: <b>${a.visualObservations?.fungalGrowth || 'Not detected'}</b></span> • 
            <span>Storage: <b>${a.farmerInputs?.storageCondition || 'Covered'}</b></span>
          </div>
        </div>
      </div>

      <h4 style="font-size:13px;font-weight:800;color:var(--forest);margin-bottom:8px">Score Component Breakdown</h4>
      <div class="score-breakdown-list" style="margin-bottom:16px">
        <div class="score-row"><span class="score-name">Visible Condition</span><div class="score-bar-bg"><div class="score-bar-fill" style="width:${(b.visualScore/30)*100}%"></div></div><span class="score-value">${b.visualScore}/30</span></div>
        <div class="score-row"><span class="score-name">Damage Assessment</span><div class="score-bar-bg"><div class="score-bar-fill" style="width:${(b.damageScore/25)*100}%"></div></div><span class="score-value">${b.damageScore}/25</span></div>
        <div class="score-row"><span class="score-name">Contamination Cleanness</span><div class="score-bar-bg"><div class="score-bar-fill" style="width:${(b.contaminationScore/25)*100}%"></div></div><span class="score-value">${b.contaminationScore}/25</span></div>
        <div class="score-row"><span class="score-name">Moisture & Storage</span><div class="score-bar-bg"><div class="score-bar-fill" style="width:${b.moistureScore !== null ? (b.moistureScore/20)*100 : 0}%"></div></div><span class="score-value">${b.moistureScore !== null ? b.moistureScore + '/20' : 'Unknown'}</span></div>
      </div>

      <h4 style="font-size:13px;font-weight:800;color:var(--forest);margin-bottom:8px">Recommended Circular Applications</h4>
      <div style="max-height:160px;overflow-y:auto;margin-bottom:16px">${recsHtml}</div>

      <div class="valuation-banner" style="margin-bottom:16px;padding:14px">
        <div>
          <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#d3e6db">Intelligent Valuation</span>
          <div class="valuation-total" style="font-size:22px">₹${Number(a.valuation?.estimatedTotalPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div style="font-size:12px;color:#e8f5ed">₹${Number(a.valuation?.estimatedPricePerKg || 0).toFixed(2)}/kg for ${Number(a.farmerInputs?.quantityKg || a.quantityKg || 0).toLocaleString()} kg</div>
          <div class="valuation-basis" style="font-size:11px;margin-top:4px">${a.valuation?.valuationBasis || 'Benchmark reference pricing'}</div>
        </div>
      </div>

      <div style="display:flex;gap:10px;justify-content:flex-end">
        ${!a.publishedListingId ? `<button type="button" class="btn btn-green btn-sm" onclick="quickPublishAnalysis('${a.id || a._id}'); closeAnalysisModal();">🚀 Publish to Marketplace</button>` : `<span class="pill" style="align-self:center">✓ Listed on Marketplace</span>`}
        <button type="button" class="btn btn-outline btn-sm" onclick="closeAnalysisModal()">Close</button>
      </div>
    `;

    modal.classList.add("active");
  };

  window.closeAnalysisModal = function() {
    const modal = document.getElementById("analysisDetailModal");
    if (modal) modal.classList.remove("active");
  };

  window.quickPublishAnalysis = function(id) {
    const a = analyses.find(x => (x.id === id || x._id === id));
    if (!a) return;

    const newListing = {
      id: `lst_ai_${Date.now()}`,
      name: a.wasteCategory,
      cropCategory: a.wasteCategory,
      quantity: a.farmerInputs?.quantityKg || a.quantityKg || 1000,
      availableQuantity: a.farmerInputs?.quantityKg || a.quantityKg || 1000,
      location: a.farmerInputs?.location || a.location || "Mandya, Karnataka",
      state: "Karnataka",
      lat: 12.5242,
      lng: 76.8958,
      type: "Sell",
      price: a.valuation?.estimatedPricePerKg || 2.0,
      farmerName: currentUser.name || "Thanush Kunder",
      farmerContact: currentUser.phone || "+91 7795117065",
      emoji: getCategoryEmoji(a.wasteCategory),
      image: a.imageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80",
      verified: true,
      qualityGrade: `Grade ${a.qualityGrade} (${a.qualityScore}/100)`,
      moisture: a.farmerInputs?.moisturePercentage,
      dateAdded: new Date().toISOString().split("T")[0]
    };

    listings.unshift(newListing);
    saveData("agricycle_listings", listings);

    a.publishedListingId = newListing.id;
    saveData("agricycle_analyses", analyses);

    showToast(`Published ${a.wasteCategory} Grade ${a.qualityGrade} to marketplace!`, "success");
    renderDashboard();
  };

  window.deleteAnalysis = function(id) {
    if (!confirm("Are you sure you want to delete this assessment report?")) return;
    analyses = analyses.filter(x => (x.id !== id && x._id !== id));
    saveData("agricycle_analyses", analyses);
    showToast("Assessment report removed.", "info");
    renderDashboard();
  };

  renderDashboard();
}

// ==========================================================================
// 7. Request Management Page (`requests.html`)
// ==========================================================================
function initRequestsPage() {
  const tableBody = document.querySelector("#requestsTable tbody");
  if (!tableBody) return;

  const searchInput = document.getElementById("requestSearch");
  const filterTabs = document.querySelectorAll(".status-tab");
  let activeStatusFilter = "all";

  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeStatusFilter = tab.dataset.status;
      renderRequests();
    });
  });

  window.renderRequests = function() {
    const q = (searchInput?.value || "").trim().toLowerCase();

    let filtered = requests.filter(r => {
      const matchQ = !q || r.id.toLowerCase().includes(q) || r.material.toLowerCase().includes(q) || r.generator.toLowerCase().includes(q) || r.utilizer.toLowerCase().includes(q);
      const matchStatus = activeStatusFilter === "all" || r.status === activeStatusFilter;
      return matchQ && matchStatus;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--muted)">No exchange requests found for this filter.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(r => {
      const statusClass = r.status === "completed" || r.status === "accepted" ? "done" : r.status === "in_transit" ? "in_transit" : r.status === "rejected" || r.status === "cancelled" ? "rejected" : "";

      // Action buttons based on current state
      let actionsHtml = "";
      if (r.status === "pending") {
        actionsHtml = `
          <button class="btn btn-green btn-sm" onclick="updateRequestStatus('${r.id}', 'accepted')">Accept</button>
          <button class="btn btn-danger btn-sm" onclick="updateRequestStatus('${r.id}', 'rejected')">Reject</button>
        `;
      } else if (r.status === "accepted") {
        actionsHtml = `
          <button class="btn btn-outline btn-sm" onclick="updateRequestStatus('${r.id}', 'in_transit')">Mark In-Transit</button>
        `;
      } else if (r.status === "in_transit") {
        actionsHtml = `
          <button class="btn btn-green btn-sm" onclick="updateRequestStatus('${r.id}', 'completed')">Complete ✓</button>
        `;
      } else {
        actionsHtml = `<button class="btn btn-outline btn-sm" onclick="printReceipt('${r.id}')">Receipt 🖨</button>`;
      }

      return `
        <tr>
          <td><b>${r.id}</b></td>
          <td><b>${r.material}</b><br><small class="muted">${r.location}</small></td>
          <td>${r.quantity} kg</td>
          <td>
            <div><b>From:</b> ${r.generator}</div>
            <div><b>To:</b> ${r.utilizer}</div>
          </td>
          <td>${r.proposedDate}<br><small class="muted">${r.deliveryMethod.replace('_', ' ')}</small></td>
          <td><span class="status ${statusClass}">${r.status.toUpperCase()}</span></td>
          <td><div style="display:flex;gap:6px;flex-wrap:wrap">${actionsHtml}</div></td>
        </tr>
      `;
    }).join("");
  };

  window.updateRequestStatus = function(reqId, newStatus) {
    const req = requests.find(x => x.id === reqId);
    if (!req) return;
    req.status = newStatus;
    saveData("agricycle_requests", requests);
    showToast(`Request ${reqId} marked as ${newStatus}!`, "success");
    renderRequests();

    // Call backend API if alive
    fetch(`http://localhost:5000/api/exchanges/${reqId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});
  };

  window.printReceipt = function(reqId) {
    const req = requests.find(x => x.id === reqId);
    if (!req) return;
    alert(`-------------------------------------------\nAGRICYCLE CIRCULAR EXCHANGE RECEIPT\n-------------------------------------------\nOrder ID: ${req.id}\nMaterial: ${req.material}\nQuantity: ${req.quantity} kg\nFarmer: ${req.generator}\nUtilizer: ${req.utilizer}\nPickup Date: ${req.proposedDate}\nTransport: ${req.deliveryMethod}\nStatus: VERIFIED & COMPLETED\nCarbon Offset: ~${Math.round(req.quantity * 1.45)} kg CO2e\n-------------------------------------------`);
  };

  searchInput?.addEventListener("input", renderRequests);
  renderRequests();
}

// ==========================================================================
// 8. List Waste Form & AI CNN Quality Assessment Simulator
// ==========================================================================
function initListWasteForm() {
  const form = document.getElementById("listingForm");
  if (!form) return;

  const testAiBtn = document.getElementById("testAiVerificationBtn");
  const aiProgressBar = document.getElementById("aiProgressBar");
  const aiResultPanel = document.getElementById("aiResultPanel");
  const aiGradeText = document.getElementById("aiGradeText");
  const aiMoistureText = document.getElementById("aiMoistureText");
  const aiConfidenceText = document.getElementById("aiConfidenceText");
  const gpsBtn = document.getElementById("useGpsBtn");
  const districtSelect = document.getElementById("karnatakaDistricts");
  const locationInput = document.getElementById("location");

  let aiVerifiedResult = {
    verified: false,
    grade: "Pending Assessment",
    moisture: 15,
    confidence: 0
  };

  let activePhotoData = "";

  // ==========================================
  // Photo Handling: Device, Camera, and URL
  // ==========================================
  window.triggerDeviceUpload = function() {
    const fileInput = document.getElementById("deviceFileInput");
    if (fileInput) fileInput.click();
  };

  window.triggerCameraCapture = function() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // On mobile devices, native capture input opens the camera directly
    if (isMobile) {
      const cameraInput = document.getElementById("cameraFileInput");
      if (cameraInput) {
        cameraInput.click();
        return;
      }
    }

    // On desktop or devices with WebRTC MediaDevices support
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function") {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          const modal = document.getElementById("cameraModal");
          const video = document.getElementById("cameraVideo");
          if (modal && video) {
            modal.classList.remove("hidden");
            video.srcObject = stream;
            window.activeCameraStream = stream;
          }
        })
        .catch(err => {
          console.warn("Camera access error:", err);
          let msg = "Camera access was denied or is unavailable on this device. Please allow camera permissions in your browser, or select a photo using 'Choose from Device'.";
          if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
            msg = "No camera hardware was detected on this device. You can easily choose a photo from your device gallery instead.";
          }
          showCameraUnavailableAlert(msg);
        });
    } else {
      // Fallback: trigger file input with capture attribute
      const cameraInput = document.getElementById("cameraFileInput");
      if (cameraInput) {
        cameraInput.click();
      } else {
        showCameraUnavailableAlert("Camera access is not supported by your browser. Please select an existing photo using 'Choose from Device'.");
      }
    }
  };

  window.closeCameraModal = function() {
    const modal = document.getElementById("cameraModal");
    if (modal) modal.classList.add("hidden");
    if (window.activeCameraStream) {
      window.activeCameraStream.getTracks().forEach(track => track.stop());
      window.activeCameraStream = null;
    }
  };

  window.captureLiveSnapshot = function() {
    const video = document.getElementById("cameraVideo");
    const canvas = document.getElementById("cameraCanvas");
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPhotoPreview(dataUrl, "Camera Snapshot (Live)");
    closeCameraModal();
    showToast("Photo captured from camera!", "success");
  };

  window.toggleUrlInput = function() {
    const container = document.getElementById("urlInputContainer");
    if (container) {
      container.classList.toggle("hidden");
      const input = document.getElementById("imageUrlInput");
      if (!container.classList.contains("hidden") && input) {
        input.focus();
      }
    }
  };

  window.applyUrlImage = function() {
    const url = (document.getElementById("imageUrlInput")?.value || "").trim();
    if (!url) {
      showToast("Please enter a valid image web URL.", "error");
      return;
    }
    const testImg = new Image();
    testImg.onload = function() {
      setPhotoPreview(url, "Web Image URL");
      showToast("Image loaded from link!", "success");
    };
    testImg.onerror = function() {
      showToast("Could not load image from this URL. Please verify the link.", "error");
    };
    testImg.src = url;
  };

  window.handleFileSelected = function(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (JPG, PNG, WebP).", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
      const dataUrl = evt.target.result;
      setPhotoPreview(dataUrl, `${file.name} (${Math.round(file.size / 1024)} KB)`);
      showToast("Photo loaded successfully!", "success");
    };
    reader.readAsDataURL(file);
  };

  function setPhotoPreview(src, label) {
    activePhotoData = src;
    window.activePhotoData = src;
    const previewWrap = document.getElementById("photoPreviewWrap");
    const previewImg = document.getElementById("previewImageEl");
    const previewName = document.getElementById("previewFileName");
    const finalInput = document.getElementById("finalPhotoData");
    const legacyUrl = document.getElementById("imageUrl");

    if (previewWrap) previewWrap.classList.remove("hidden");
    if (previewImg) previewImg.src = src;
    if (previewName) previewName.textContent = label || "batch-photo.jpg";
    if (finalInput) finalInput.value = src;
    if (legacyUrl) legacyUrl.value = src;

    dismissCameraAlert();
  }

  window.replacePhoto = function() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      triggerDeviceUpload();
    } else {
      const btns = document.getElementById("photoMethodButtons");
      if (btns) {
        btns.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      showToast("Choose an option above to replace the photo.", "info");
    }
  };

  window.removePhoto = function() {
    activePhotoData = "";
    window.activePhotoData = "";
    const previewWrap = document.getElementById("photoPreviewWrap");
    const previewImg = document.getElementById("previewImageEl");
    const finalInput = document.getElementById("finalPhotoData");
    const legacyUrl = document.getElementById("imageUrl");
    const fileInput = document.getElementById("deviceFileInput");
    const camInput = document.getElementById("cameraFileInput");
    const urlInput = document.getElementById("imageUrlInput");

    if (previewWrap) previewWrap.classList.add("hidden");
    if (previewImg) previewImg.src = "";
    if (finalInput) finalInput.value = "";
    if (legacyUrl) legacyUrl.value = "";
    if (fileInput) fileInput.value = "";
    if (camInput) camInput.value = "";
    if (urlInput) urlInput.value = "";

    showToast("Photo removed.", "info");
  };

  window.showCameraUnavailableAlert = function(msg) {
    const alertBox = document.getElementById("cameraAlertBox");
    const alertMsg = document.getElementById("cameraAlertMessage");
    if (alertBox && alertMsg) {
      alertMsg.textContent = msg;
      alertBox.classList.remove("hidden");
      alertBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  window.dismissCameraAlert = function() {
    const alertBox = document.getElementById("cameraAlertBox");
    if (alertBox) alertBox.classList.add("hidden");
  };

  // Location selector presets
  districtSelect?.addEventListener("change", () => {
    if (districtSelect.value) {
      locationInput.value = districtSelect.value;
    }
  });

  // Browser Geolocation
  gpsBtn?.addEventListener("click", () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.", "error");
      return;
    }
    showToast("Detecting GPS coordinates...", "info");
    navigator.geolocation.getCurrentPosition(
      pos => {
        locationInput.value = `GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        showToast("Location locked from GPS!", "success");
      },
      () => {
        locationInput.value = "Mandya, Karnataka";
        showToast("GPS timeout, defaulted to Mandya.", "info");
      }
    );
  });

  // CNN Image Assessment Simulator
  testAiBtn?.addEventListener("click", () => {
    let wasteType = document.getElementById("wasteType")?.value;
    const wasteTypeSelect = document.getElementById("wasteType");

    // If user hasn't selected a waste type yet, auto-assign Paddy Straw so testing never blocks!
    if (!wasteType) {
      if (wasteTypeSelect) {
        wasteTypeSelect.value = "Paddy Straw";
        wasteType = "Paddy Straw";
        showToast("Residue type auto-set to Paddy Straw for AI verification", "info");
        wasteTypeSelect.style.borderColor = "var(--green)";
        wasteTypeSelect.style.boxShadow = "0 0 0 3px rgba(43, 119, 74, 0.2)";
        setTimeout(() => {
          wasteTypeSelect.style.borderColor = "";
          wasteTypeSelect.style.boxShadow = "";
        }, 2000);
      }
    }

    testAiBtn.disabled = true;
    testAiBtn.textContent = activePhotoData ? "Analyzing uploaded batch photo via CNN..." : `Analyzing ${wasteType} Fiber via CNN...`;
    if (aiProgressBar) aiProgressBar.style.width = "40%";

    setTimeout(() => {
      if (aiProgressBar) aiProgressBar.style.width = "85%";
    }, 500);

    setTimeout(() => {
      if (aiProgressBar) aiProgressBar.style.width = "100%";
      testAiBtn.disabled = false;
      testAiBtn.textContent = "✓ Analysis Complete";

      const sampleMoist = Math.floor(Math.random() * 8) + 10; // 10% - 18%
      const sampleConf = (94.0 + Math.random() * 5).toFixed(1);

      aiVerifiedResult = {
        verified: true,
        grade: "Grade A (High Purity)",
        moisture: sampleMoist,
        confidence: Number(sampleConf)
      };

      if (aiGradeText) aiGradeText.textContent = aiVerifiedResult.grade;
      if (aiMoistureText) aiMoistureText.textContent = `${aiVerifiedResult.moisture}% (Optimal)`;
      if (aiConfidenceText) aiConfidenceText.textContent = `${aiVerifiedResult.confidence}%`;
      if (aiResultPanel) aiResultPanel.classList.remove("hidden");

      showToast(`AI Verification Complete: ${wasteType} Grade A certified!`, "success");
    }, 1200);
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("wasteType").value;
    const type = document.getElementById("listingType").value;
    const quantity = Number(document.getElementById("quantity").value);
    const price = Number(document.getElementById("price")?.value || 0);
    const loc = locationInput.value.trim();
    const image = (document.getElementById("finalPhotoData")?.value || document.getElementById("imageUrl")?.value || "").trim();

    if (!name || !type || !quantity || !loc) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    // Determine district coordinates
    let lat = 12.5242, lng = 76.8958;
    if (loc.includes("Udupi")) { lat = 13.3409; lng = 74.7421; }
    else if (loc.includes("Belagavi")) { lat = 15.8497; lng = 74.4977; }
    else if (loc.includes("Sirsi")) { lat = 14.6195; lng = 74.8354; }
    else if (loc.includes("Karwar")) { lat = 14.8136; lng = 74.1298; }

    const newListing = {
      id: `lst_00${listings.length + 1}`,
      name: name,
      cropCategory: name,
      quantity: quantity,
      availableQuantity: quantity,
      location: loc,
      state: "Karnataka",
      lat: lat,
      lng: lng,
      type: type,
      price: price,
      farmerName: currentUser.name,
      farmerContact: currentUser.phone,
      emoji: name.includes("Paddy") ? "🌾" : name.includes("Coconut") ? "🥥" : name.includes("Sugarcane") ? "🎋" : name.includes("Areca") ? "🍃" : "🌱",
      image: image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80",
      verified: aiVerifiedResult.verified,
      qualityGrade: aiVerifiedResult.grade,
      moisture: aiVerifiedResult.moisture,
      dateAdded: new Date().toISOString().split("T")[0]
    };

    listings.unshift(newListing);
    saveData("agricycle_listings", listings);

    form.reset();
    if (typeof removePhoto === "function") removePhoto();
    showToast("Listing published to AgriCycle marketplace!", "success");

    // Optional POST to backend API
    fetch("http://localhost:5000/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${newListing.name} Batch`,
        wasteType: newListing.name,
        quantityKg: quantity,
        pricePerKg: price,
        location: { coordinates: [lng, lat], address: loc, city: loc }
      })
    }).catch(() => {});

    setTimeout(() => {
      window.location.href = "browse.html";
    }, 900);
  });

  // Default harvest date to today
  const harvestDateInput = document.getElementById("farmerHarvestDateInput");
  if (harvestDateInput && !harvestDateInput.value) {
    harvestDateInput.value = new Date().toISOString().split("T")[0];
  }

  // 1. Mode Switcher
  window.switchListingMode = function(mode) {
    const tabAi = document.getElementById("tabAiAssessment");
    const tabQuick = document.getElementById("tabQuickListing");
    const aiWrap = document.getElementById("aiAssessmentContainer");
    const manualWrap = document.getElementById("manualListingContainer");

    if (mode === "ai") {
      tabAi?.classList.add("active");
      tabQuick?.classList.remove("active");
      aiWrap?.classList.remove("hidden");
      manualWrap?.classList.add("hidden");
    } else {
      tabQuick?.classList.add("active");
      tabAi?.classList.remove("active");
      manualWrap?.classList.remove("hidden");
      aiWrap?.classList.add("hidden");
    }
  };

  // 2. Toggle Moisture Unknown
  window.toggleMoistureUnknown = function(checkbox) {
    const input = document.getElementById("farmerMoistureInput");
    if (!input) return;
    if (checkbox && checkbox.checked) {
      input.value = "";
      input.disabled = true;
      input.placeholder = "Marked as Unknown (Assessment Completeness ~80%)";
      input.style.opacity = "0.6";
    } else {
      input.disabled = false;
      input.placeholder = "e.g. 14.0 (if known)";
      input.style.opacity = "1";
    }
  };

  // 3. Farmer GPS locator
  window.grabGpsForFarmer = function() {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.", "error");
      return;
    }
    showToast("Detecting GPS coordinates...", "info");
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = document.getElementById("farmerLocationInput");
        if (loc) loc.value = `Mandya (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`;
        showToast("Location locked from GPS!", "success");
      },
      () => {
        const loc = document.getElementById("farmerLocationInput");
        if (loc && !loc.value) loc.value = "Mandya, Karnataka";
        showToast("Defaulted to Mandya, Karnataka.", "info");
      }
    );
  };

  // 4. Run AI Vision Analysis
  window.runAiVisionAnalysis = async function() {
    const photo = window.activePhotoData || document.getElementById("imageUrlInput")?.value || "";
    const previewImg = document.getElementById("previewImageEl");
    const photoToUse = photo || (previewImg && previewImg.src && !previewImg.src.endsWith("#") ? previewImg.src : "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80");

    const loadingCard = document.getElementById("aiLoadingCard");
    const flowBar = document.getElementById("aiFlowProgressBar");
    const step3Card = document.getElementById("step3Card");
    const step4Card = document.getElementById("step4Card");

    if (loadingCard) loadingCard.classList.remove("hidden");
    if (flowBar) flowBar.style.width = "30%";
    loadingCard?.scrollIntoView({ behavior: "smooth", block: "center" });

    let visionResult = null;

    try {
      if (flowBar) flowBar.style.width = "65%";
      const resp = await fetch("http://localhost:5000/api/waste-analysis/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("agricycle_token") ? { "Authorization": `Bearer ${localStorage.getItem("agricycle_token")}` } : {})
        },
        body: JSON.stringify({
          imageBase64: photoToUse.startsWith("data:") ? photoToUse : "",
          imageUrl: photoToUse.startsWith("http") ? photoToUse : ""
        })
      });

      if (resp.ok) {
        const body = await resp.json();
        if (body.success && body.data) {
          visionResult = body.data;
        }
      }
    } catch (err) {
      console.warn("Backend vision API call offline, falling back to heuristic CV:", err);
    }

    if (!visionResult) {
      visionResult = evaluateHeuristicVisionObservations(photoToUse);
    }

    if (flowBar) flowBar.style.width = "100%";
    window.currentVisionObservations = visionResult;

    setTimeout(() => {
      if (loadingCard) loadingCard.classList.add("hidden");

      const select = document.getElementById("aiDetectedCategorySelect");
      if (select) {
        const target = visionResult.wasteType || "Rice Straw";
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].value.toLowerCase() === target.toLowerCase() || target.toLowerCase().includes(select.options[i].value.toLowerCase())) {
            select.selectedIndex = i;
            break;
          }
        }
      }

      const confBadge = document.getElementById("aiConfidenceBadge");
      if (confBadge) confBadge.textContent = `${Math.round((visionResult.confidence || 0.94) * 100)}%`;

      const sourceBadge = document.getElementById("aiModelSourceBadge");
      if (sourceBadge) sourceBadge.textContent = `Source: ${visionResult.modelUsed || "Gemini Vision"}`;

      const obs = visionResult.visualObservations || {};
      const obsColor = document.getElementById("obsColorText");
      if (obsColor) obsColor.textContent = obs.colour || "Light golden";

      const obsCond = document.getElementById("obsConditionText");
      if (obsCond) obsCond.textContent = obs.visibleCondition || "Good";

      const obsDam = document.getElementById("obsDamageText");
      if (obsDam) obsDam.textContent = obs.visibleDamage || "Low";

      const obsContam = document.getElementById("obsContaminationText");
      if (obsContam) obsContam.textContent = obs.visibleContamination || "Low";

      const obsGrade = document.getElementById("obsPreliminaryGradeBadge");
      if (obsGrade) {
        const pGrade = visionResult.visualQuality?.preliminaryGrade || "A";
        obsGrade.textContent = `Grade ${pGrade}`;
        obsGrade.className = `obs-badge grade-${pGrade.toLowerCase()}`;
      }

      const obsFungal = document.getElementById("obsFungalText");
      if (obsFungal) obsFungal.textContent = obs.fungalGrowth || "Not visibly detected";

      if (step3Card) step3Card.classList.remove("hidden");
      if (step4Card) step4Card.classList.remove("hidden");

      step3Card?.scrollIntoView({ behavior: "smooth", block: "start" });
      showToast(`AI Vision Analysis Complete: ${visionResult.wasteType} identified!`, "success");
    }, 600);
  };

  // 5. Submit Final Quality Assessment
  window.submitFinalQualityAssessment = async function() {
    const category = document.getElementById("aiDetectedCategorySelect")?.value || "Rice Straw";
    const qty = Number(document.getElementById("farmerQtyInput")?.value || 0);
    const isUnknown = document.getElementById("moistureUnknownCheckbox")?.checked || false;
    const moistureRaw = document.getElementById("farmerMoistureInput")?.value;
    const moisture = isUnknown || !moistureRaw ? null : Number(moistureRaw);
    const storage = document.getElementById("farmerStorageSelect")?.value || "Covered storage";
    const harvestDate = document.getElementById("farmerHarvestDateInput")?.value || new Date().toISOString().split("T")[0];
    const location = document.getElementById("farmerLocationInput")?.value?.trim() || "Mandya, Karnataka";
    const notes = document.getElementById("farmerNotesInput")?.value?.trim() || "";
    const isDried = document.getElementById("farmerDriedCheckbox")?.checked ?? true;

    if (!qty || qty <= 0) {
      showToast("Please enter a valid residue quantity (kg).", "error");
      document.getElementById("farmerQtyInput")?.focus();
      return;
    }

    if (!location) {
      showToast("Please provide your district / location.", "error");
      document.getElementById("farmerLocationInput")?.focus();
      return;
    }

    const calcBtn = document.getElementById("btnCalculateReport");
    if (calcBtn) {
      calcBtn.disabled = true;
      calcBtn.textContent = "Calculating certified grading...";
    }

    const previewImg = document.getElementById("previewImageEl");
    const photoToUse = window.activePhotoData || (previewImg && previewImg.src && !previewImg.src.endsWith("#") ? previewImg.src : "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80");

    const visualObs = window.currentVisionObservations?.visualObservations || {
      colour: document.getElementById("obsColorText")?.textContent || "Light golden",
      visibleCondition: document.getElementById("obsConditionText")?.textContent || "Good",
      visibleDamage: document.getElementById("obsDamageText")?.textContent || "Low",
      visibleContamination: document.getElementById("obsContaminationText")?.textContent || "Low",
      visibleDeterioration: "Not detected",
      fungalGrowth: document.getElementById("obsFungalText")?.textContent || "Not visibly detected"
    };

    const visualQual = window.currentVisionObservations?.visualQuality || {
      preliminaryGrade: document.getElementById("obsPreliminaryGradeBadge")?.textContent?.replace("Grade ", "") || "A",
      description: "Visual surface analysis",
      confidence: 0.90
    };

    let report = null;

    try {
      const resp = await fetch("http://localhost:5000/api/waste-analysis/assess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("agricycle_token") ? { "Authorization": `Bearer ${localStorage.getItem("agricycle_token")}` } : {})
        },
        body: JSON.stringify({
          wasteCategory: category,
          quantityKg: qty,
          moisturePercentage: moisture,
          moistureUnknown: isUnknown,
          storageCondition: storage,
          harvestDate,
          location,
          notes,
          isDried,
          visualObservations: visualObs,
          visualQuality: visualQual,
          imageUrl: photoToUse
        })
      });

      if (resp.ok) {
        const body = await resp.json();
        if (body.success && body.data) {
          report = body.data;
        }
      }
    } catch (err) {
      console.warn("Backend quality assessment failed, using deterministic local engine:", err);
    }

    if (!report) {
      report = evaluateDeterministicQualityReport({
        wasteCategory: category,
        quantityKg: qty,
        moisturePercentage: moisture,
        moistureUnknown: isUnknown,
        storageCondition: storage,
        harvestDate,
        location,
        notes,
        isDried,
        visualObservations: visualObs,
        visualQuality: visualQual,
        imageUrl: photoToUse
      });
    }

    if (calcBtn) {
      calcBtn.disabled = false;
      calcBtn.textContent = "✓ Report Generated";
    }

    window.currentAnalysisResult = report;
    renderFinalReportBox(report);
  };

  // 6. Render Final Report Box
  function renderFinalReportBox(report) {
    const box = document.getElementById("finalReportBox");
    if (!box) return;

    const rulesEl = document.getElementById("reportRulesVersionBadge");
    if (rulesEl) rulesEl.textContent = report.rulesVersion || "Rules v1.0.0-provisional";

    const dateEl = document.getElementById("reportDateText");
    if (dateEl) dateEl.textContent = new Date(report.createdAt || Date.now()).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });

    const stampEl = document.getElementById("reportGradeStamp");
    if (stampEl) {
      stampEl.textContent = report.qualityGrade;
      stampEl.className = `grade-stamp grade-${report.qualityGrade.toLowerCase()}`;
    }

    const titleEl = document.getElementById("reportGradeTitle");
    if (titleEl) {
      const gTitle = report.qualityGrade === "A" ? "High Quality" : report.qualityGrade === "B" ? "Medium Quality" : "Low Quality";
      titleEl.textContent = `Grade ${report.qualityGrade} (${gTitle})`;
    }

    const catEl = document.getElementById("reportCategoryText");
    if (catEl) catEl.textContent = `${report.wasteCategory} • Certified Agricultural Waste`;

    const scoreEl = document.getElementById("reportScoreText");
    if (scoreEl) scoreEl.innerHTML = `${report.qualityScore}<small style="font-size:14px">/100</small>`;

    const compEl = document.getElementById("reportCompletenessText");
    if (compEl) {
      compEl.textContent = `Assessment Completeness: ${report.completenessPercentage}% ${report.completenessPercentage < 100 ? '(Moisture unmeasured)' : '(All parameters verified)'}`;
    }

    // Breakdown bars
    const bd = report.scoreBreakdown || { visualScore: 30, damageScore: 25, contaminationScore: 25, moistureScore: 20 };
    const barV = document.getElementById("barVisual");
    const valV = document.getElementById("valVisual");
    if (barV) barV.style.width = `${Math.round((bd.visualScore / 30) * 100)}%`;
    if (valV) valV.textContent = `${bd.visualScore}/30`;

    const barD = document.getElementById("barDamage");
    const valD = document.getElementById("valDamage");
    if (barD) barD.style.width = `${Math.round((bd.damageScore / 25) * 100)}%`;
    if (valD) valD.textContent = `${bd.damageScore}/25`;

    const barC = document.getElementById("barContam");
    const valC = document.getElementById("valContam");
    if (barC) barC.style.width = `${Math.round((bd.contaminationScore / 25) * 100)}%`;
    if (valC) valC.textContent = `${bd.contaminationScore}/25`;

    const barM = document.getElementById("barMoist");
    const valM = document.getElementById("valMoist");
    if (barM) barM.style.width = bd.moistureScore !== null ? `${Math.round((bd.moistureScore / 20) * 100)}%` : "0%";
    if (valM) valM.textContent = bd.moistureScore !== null ? `${bd.moistureScore}/20` : "Unknown (N/A)";

    // Recommendations
    const recsBox = document.getElementById("reportRecsContainer");
    if (recsBox) {
      recsBox.innerHTML = (report.recommendations || []).map(r => `
        <div class="rec-card ${r.suitable ? '' : 'unsuitable'}">
          <div class="rec-title-row">
            <h4>${r.application}</h4>
            <span class="obs-badge ${r.priority === 'High' ? 'grade-a' : r.priority === 'Medium' ? 'grade-b' : 'grade-c'}">${r.priority} Priority</span>
          </div>
          <p>${r.description}</p>
          <div style="font-size:11.5px;color:var(--muted);margin-top:6px">
            ${r.suitable ? '✓ Recommended for this certified batch' : '⚠ Not recommended due to purity/moisture constraints'}
          </div>
        </div>
      `).join("");
    }

    // Valuation
    const valTotal = document.getElementById("reportValuationTotal");
    if (valTotal) valTotal.textContent = `₹${Number(report.valuation.estimatedTotalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const valRate = document.getElementById("reportValuationRate");
    if (valRate) valRate.textContent = `₹${Number(report.valuation.estimatedPricePerKg).toFixed(2)} / kg`;

    const valQty = document.getElementById("reportValuationQty");
    if (valQty) valQty.textContent = `${Number(report.farmerInputs?.quantityKg || report.quantityKg).toLocaleString()} kg`;

    const valBasis = document.getElementById("reportValuationBasis");
    if (valBasis) valBasis.textContent = report.valuation.valuationBasis;

    const valRel = document.getElementById("reportReliabilityBadge");
    if (valRel) {
      valRel.textContent = `${report.valuation.confidenceLevel} Reliability`;
      valRel.className = `obs-badge grade-${report.valuation.confidenceLevel === 'High' ? 'a' : 'b'}`;
    }

    box.classList.remove("hidden");
    box.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast(`Quality Assessment Complete: Grade ${report.qualityGrade} (${report.qualityScore}/100)!`, "success");
  }

  // 7. Publish Report as Listing
  window.publishReportAsListing = async function() {
    const report = window.currentAnalysisResult;
    if (!report) {
      showToast("Please calculate a quality assessment first.", "error");
      return;
    }

    const btn = document.getElementById("btnPublishListing");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Publishing to Marketplace...";
    }

    const newListing = {
      id: `lst_ai_${Date.now()}`,
      name: report.wasteCategory,
      cropCategory: report.wasteCategory,
      quantity: report.farmerInputs?.quantityKg || report.quantityKg,
      availableQuantity: report.farmerInputs?.quantityKg || report.quantityKg,
      location: report.farmerInputs?.location || report.location,
      state: "Karnataka",
      lat: 12.5242,
      lng: 76.8958,
      type: "Sell",
      price: report.valuation.estimatedPricePerKg,
      farmerName: currentUser.name || "Thanush Kunder",
      farmerContact: currentUser.phone || "+91 7795117065",
      emoji: getCategoryEmoji(report.wasteCategory),
      image: report.imageUrl || window.activePhotoData || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80",
      verified: true,
      qualityGrade: `Grade ${report.qualityGrade} (${report.qualityScore}/100)`,
      moisture: report.farmerInputs?.moisturePercentage,
      dateAdded: new Date().toISOString().split("T")[0]
    };

    if (report._id || report.id) {
      fetch(`http://localhost:5000/api/waste-analysis/${report._id || report.id}/publish-listing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("agricycle_token") ? { "Authorization": `Bearer ${localStorage.getItem("agricycle_token")}` } : {})
        },
        body: JSON.stringify({
          pricePerKg: report.valuation.estimatedPricePerKg,
          type: "Sell"
        })
      }).catch(() => {});
    }

    listings.unshift(newListing);
    saveData("agricycle_listings", listings);

    report.publishedListingId = newListing.id;
    const existingIdx = analyses.findIndex(x => (x.id === report.id || x._id === report._id));
    if (existingIdx >= 0) {
      analyses[existingIdx] = report;
    } else {
      analyses.unshift(report);
    }
    saveData("agricycle_analyses", analyses);

    showToast(`✓ Certified ${report.wasteCategory} Grade ${report.qualityGrade} published to Marketplace!`, "success");

    setTimeout(() => {
      window.location.href = "browse.html";
    }, 1000);
  };

  // 8. Save Report Only
  window.saveReportOnly = function() {
    const report = window.currentAnalysisResult;
    if (!report) {
      showToast("Please calculate a quality assessment first.", "error");
      return;
    }

    const existingIdx = analyses.findIndex(x => (x.id === report.id || x._id === report._id));
    if (existingIdx >= 0) {
      analyses[existingIdx] = report;
    } else {
      analyses.unshift(report);
    }
    saveData("agricycle_analyses", analyses);

    showToast("✓ Assessment report saved to your dashboard!", "success");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);
  };

  // 9. Reset Assessment Workflow
  window.resetAssessmentWorkflow = function() {
    if (typeof removePhoto === "function") removePhoto();
    window.currentVisionObservations = null;
    window.currentAnalysisResult = null;

    document.getElementById("finalReportBox")?.classList.add("hidden");
    document.getElementById("step3Card")?.classList.add("hidden");
    document.getElementById("step4Card")?.classList.add("hidden");
    document.getElementById("aiLoadingCard")?.classList.add("hidden");

    const qtyInput = document.getElementById("farmerQtyInput");
    if (qtyInput) qtyInput.value = "1000";

    const moistInput = document.getElementById("farmerMoistureInput");
    if (moistInput) {
      moistInput.value = "";
      moistInput.disabled = false;
      moistInput.placeholder = "e.g. 14.0 (if known)";
      moistInput.style.opacity = "1";
    }

    const moistCheck = document.getElementById("moistureUnknownCheckbox");
    if (moistCheck) moistCheck.checked = false;

    const notesInput = document.getElementById("farmerNotesInput");
    if (notesInput) notesInput.value = "";

    document.getElementById("step1Card")?.scrollIntoView({ behavior: "smooth" });
    showToast("Ready for new batch assessment.", "info");
  };
}

// ==========================================================================
// Quality Assessment & Valuation Helpers (Category, Heuristics, Deterministic Engine)
// ==========================================================================
function getCategoryEmoji(cat) {
  const c = (cat || "").toLowerCase();
  if (c.includes("rice") || c.includes("paddy")) return "🌾";
  if (c.includes("wheat")) return "🌾";
  if (c.includes("sugarcane") || c.includes("bagasse")) return "🎋";
  if (c.includes("coconut") || c.includes("coir")) return "🥥";
  if (c.includes("groundnut") || c.includes("peanut")) return "🥜";
  if (c.includes("corn") || c.includes("maize")) return "🌽";
  if (c.includes("banana")) return "🍌";
  if (c.includes("areca")) return "🍃";
  if (c.includes("cotton")) return "☁️";
  return "🌱";
}

function evaluateHeuristicVisionObservations(photo) {
  const cat = (photo && photo.toLowerCase().includes("bagasse")) ? "Sugarcane Bagasse" :
              (photo && photo.toLowerCase().includes("coconut")) ? "Coconut Husk" :
              (photo && photo.toLowerCase().includes("areca")) ? "Areca Leaf" : "Rice Straw";

  return {
    wasteType: cat,
    confidence: 0.94,
    visualObservations: {
      colour: cat === "Rice Straw" ? "Light golden" : cat === "Coconut Husk" ? "Fibrous brown" : cat === "Sugarcane Bagasse" ? "Pale brownish-yellow" : "Natural dry tan",
      visibleCondition: "Good",
      visibleDamage: "Low",
      visibleContamination: "Low",
      visibleDeterioration: "Not detected",
      fungalGrowth: "Not visibly detected"
    },
    visualQuality: {
      preliminaryGrade: "A",
      description: "Clean, consistent surface fiber pattern with minimal visible foreign matter.",
      confidence: 0.91
    },
    warnings: [],
    recommendedNextSteps: ["Verify moisture content with calibrated meter or laboratory drying oven"],
    modelUsed: "Edge Heuristic CV"
  };
}

function evaluateDeterministicQualityReport(data) {
  const cat = data.wasteCategory || "Rice Straw";
  const qty = Number(data.quantityKg || 1000);
  const moist = data.moisturePercentage !== null && data.moisturePercentage !== undefined ? Number(data.moisturePercentage) : null;
  const isUnknown = data.moistureUnknown || moist === null;

  const categoryThresholds = {
    "Rice Straw": { optimalMoist: 14, basePrice: { A: 2.50, B: 1.80, C: 1.10 } },
    "Wheat Straw": { optimalMoist: 13, basePrice: { A: 2.60, B: 1.90, C: 1.20 } },
    "Sugarcane Bagasse": { optimalMoist: 25, basePrice: { A: 2.20, B: 1.60, C: 1.00 } },
    "Coconut Husk": { optimalMoist: 18, basePrice: { A: 3.00, B: 2.10, C: 1.30 } },
    "Groundnut Shells": { optimalMoist: 12, basePrice: { A: 2.40, B: 1.70, C: 1.10 } },
    "Corn Stalks": { optimalMoist: 15, basePrice: { A: 2.00, B: 1.50, C: 0.90 } },
    "Banana Waste": { optimalMoist: 30, basePrice: { A: 1.80, B: 1.30, C: 0.80 } },
    "Areca Leaf": { optimalMoist: 12, basePrice: { A: 3.50, B: 2.40, C: 1.50 } },
    "Cotton Stalk": { optimalMoist: 15, basePrice: { A: 2.20, B: 1.60, C: 1.00 } },
    "Other Agricultural Residues": { optimalMoist: 16, basePrice: { A: 1.80, B: 1.30, C: 0.80 } }
  };

  const meta = categoryThresholds[cat] || categoryThresholds["Other Agricultural Residues"];

  const visualCond = (data.visualObservations?.visibleCondition || "Good").toLowerCase();
  const visualScore = visualCond.includes("good") ? 30 : visualCond.includes("fair") ? 20 : 10;

  const damageLevel = (data.visualObservations?.visibleDamage || "Low").toLowerCase();
  const damageScore = damageLevel.includes("low") ? 25 : damageLevel.includes("medium") ? 15 : 5;

  const contamLevel = (data.visualObservations?.visibleContamination || "Low").toLowerCase();
  const contamScore = contamLevel.includes("low") ? 25 : contamLevel.includes("medium") ? 15 : 0;

  let moistureScore = null;
  let completeness = 80;

  if (!isUnknown && moist !== null) {
    completeness = 100;
    if (moist <= meta.optimalMoist) {
      moistureScore = 20;
    } else if (moist <= meta.optimalMoist + 5) {
      moistureScore = 14;
    } else {
      moistureScore = 5;
    }
  }

  let totalScore = 0;
  if (moistureScore !== null) {
    totalScore = visualScore + damageScore + contamScore + moistureScore;
  } else {
    const rawSum = visualScore + damageScore + contamScore;
    totalScore = Math.round((rawSum / 80) * 100);
  }

  const fungalDetected = (data.visualObservations?.fungalGrowth || "").toLowerCase().includes("detect") &&
                        !(data.visualObservations?.fungalGrowth || "").toLowerCase().includes("not");

  let grade = "A";
  if (fungalDetected || contamLevel.includes("high")) {
    grade = "C";
  } else if (totalScore >= 80) {
    grade = "A";
  } else if (totalScore >= 60) {
    grade = "B";
  } else {
    grade = "C";
  }

  const baseRate = meta.basePrice[grade] || 1.80;
  const bulkIncentive = qty >= 3000 ? 0.20 : qty >= 1000 ? 0.10 : 0;
  const qualityDelta = totalScore >= 90 ? 0.10 : totalScore < 55 ? -0.10 : 0;
  const pricePerKg = Number((baseRate + bulkIncentive + qualityDelta).toFixed(2));
  const totalPrice = Number((pricePerKg * qty).toFixed(2));

  const allRecs = {
    "Rice Straw": [
      { application: "Mushroom Cultivation Substrate", priority: "High", description: "Optimal cellulose structure for oyster and paddy straw mushroom mycelium growth.", suitable: grade !== "C" && !fungalDetected },
      { application: "Livestock Fodder & Bedding", priority: "High", description: "Clean dry golden straw for cattle fodder roughage and animal shed bedding.", suitable: grade === "A" && !fungalDetected },
      { application: "Biomass Briquetting & Pelleting", priority: "Medium", description: "High calorific density for industrial boiler fuels and solid biofuel briquettes.", suitable: true }
    ],
    "Sugarcane Bagasse": [
      { application: "Biofuel Boiler Feedstock", priority: "High", description: "High-yield calorific fuel for sugar mill co-generation and paper mills.", suitable: true },
      { application: "Biodegradable Tableware Moulding", priority: "High", description: "Thermoformed biodegradable tableware, plates, and takeaway boxes.", suitable: grade === "A" },
      { application: "Organic Soil Composting", priority: "Medium", description: "Enriched carbonaceous substrate for organic composting and mulching.", suitable: true }
    ],
    "Coconut Husk": [
      { application: "Coir Geotextile & Fiber Yarn", priority: "High", description: "Strong natural fibers for erosion control blankets and horticultural ropes.", suitable: grade !== "C" },
      { application: "Horticultural Coco Peat Substrate", priority: "High", description: "High water retention growing media for polyhouse floriculture and nurseries.", suitable: grade !== "C" },
      { application: "Activated Carbon Precursor", priority: "Medium", description: "Dense lignin matrix for industrial water and air filtration activated carbon.", suitable: true }
    ],
    "Areca Leaf": [
      { application: "Biodegradable Areca Dinnerware", priority: "High", description: "Hot-pressed eco-friendly plates, bowls, and cutlery replacing single-use plastics.", suitable: grade === "A" && !fungalDetected },
      { application: "Mushroom Substrate Amendment", priority: "Medium", description: "Sterilized lignified leaf sheaths for specialty mushroom cultures.", suitable: grade !== "C" },
      { application: "Organic Mulch & Compost", priority: "Low", description: "Shredded organic mulch for weed suppression and soil moisture retention.", suitable: true }
    ]
  };

  const recs = allRecs[cat] || [
    { application: "Biomass Briquetting & Pelleting", priority: "High", description: "Clean compressed bio-pellets for commercial and industrial thermal energy.", suitable: true },
    { application: "Enriched Microbial Compost", priority: "Medium", description: "Aerobic microbial composting converting crop residues into nutrient-rich humus.", suitable: true },
    { application: "Biochar Pyrolysis", priority: "Medium", description: "Slow-pyrolysis biochar for long-term carbon sequestration and soil health.", suitable: true }
  ];

  return {
    id: `ana_local_${Date.now()}`,
    wasteCategory: cat,
    quantityKg: qty,
    qualityGrade: grade,
    qualityScore: totalScore,
    completenessPercentage: completeness,
    scoreBreakdown: {
      visualScore,
      damageScore,
      contaminationScore,
      moistureScore
    },
    valuation: {
      estimatedPricePerKg: pricePerKg,
      estimatedTotalPrice: totalPrice,
      valuationBasis: `Base benchmark: ₹${baseRate.toFixed(2)}/kg for Grade ${grade} with +₹${bulkIncentive.toFixed(2)}/kg bulk incentive and ${qualityDelta >= 0 ? '+' : ''}₹${qualityDelta.toFixed(2)}/kg score adjustment`,
      confidenceLevel: completeness === 100 ? "High" : "Medium"
    },
    recommendations: recs,
    visualObservations: data.visualObservations,
    visualQuality: data.visualQuality,
    farmerInputs: {
      quantityKg: qty,
      moisturePercentage: moist,
      moistureUnknown: isUnknown,
      storageCondition: data.storageCondition,
      harvestDate: data.harvestDate,
      location: data.location,
      notes: data.notes,
      isDried: data.isDried
    },
    rulesVersion: "1.0.0-provisional",
    createdAt: new Date().toISOString(),
    imageUrl: data.imageUrl
  };
}

// ==========================================================================
// 9. Environmental Impact & Stubble Burning Calculator (`impact.html`)
// ==========================================================================
function initImpactCalculator() {
  const slider = document.getElementById("calcKgSlider");
  const sliderLabel = document.getElementById("calcKgValue");
  const cropSelect = document.getElementById("calcCropType");

  const co2El = document.getElementById("calcCo2Val");
  const pmEl = document.getElementById("calcPmVal");
  const compostEl = document.getElementById("calcCompostVal");
  const farmersEl = document.getElementById("calcFarmersVal");

  if (!slider) return;

  function updateCalc() {
    const kg = Number(slider.value);
    if (sliderLabel) sliderLabel.textContent = `${kg.toLocaleString()} kg`;

    const crop = cropSelect?.value || "paddy";
    let co2Factor = 1.45; // 1.45 kg CO2e per kg burnt
    let pmFactor = 0.008; // 8g particulate matter per kg
    let compostRatio = 0.65;

    if (crop === "bagasse") {
      co2Factor = 1.25;
      pmFactor = 0.006;
      compostRatio = 0.75;
    } else if (crop === "coconut") {
      co2Factor = 1.1;
      pmFactor = 0.004;
      compostRatio = 0.85;
    }

    const co2Saved = Math.round(kg * co2Factor);
    const pmSavedKg = (kg * pmFactor).toFixed(1);
    const compostGenerated = Math.round(kg * compostRatio);
    const farmersSupported = Math.max(1, Math.round(kg / 800));

    if (co2El) co2El.textContent = `${co2Saved.toLocaleString()} kg`;
    if (pmEl) pmEl.textContent = `${pmSavedKg} kg`;
    if (compostEl) compostEl.textContent = `${compostGenerated.toLocaleString()} kg`;
    if (farmersEl) farmersEl.textContent = farmersSupported;
  }

  slider.addEventListener("input", updateCalc);
  cropSelect?.addEventListener("change", updateCalc);
  updateCalc();
}

// ==========================================================================
// ==========================================================================
// 10. AI Chatbot Assistant ("AgriBot") - Powered by Real Generative AI LLM
// ==========================================================================
function setupAgriBot() {
  const bubble = document.getElementById("agriBotBubble");
  const windowEl = document.getElementById("agriBotWindow");
  if (!windowEl) return;

  // 1. Augment Chat Header with Controls if not already present
  const header = windowEl.querySelector(".chatbot-header");
  if (header && !header.querySelector(".chat-header-actions")) {
    header.innerHTML = `
      <div class="chat-header-title">
        <h4><span class="chat-status-dot"></span>🤖 AgriBot Assistant</h4>
        <span class="chat-ai-badge">AI Powered</span>
      </div>
      <div class="chat-header-actions">
        <button id="agriBotNewChat" class="chat-hdr-btn" type="button" title="Start new conversation">➕</button>
        <button id="agriBotHistoryBtn" class="chat-hdr-btn" type="button" title="Conversation history">🕒</button>
        <button id="agriBotLangBtn" class="chat-hdr-btn" type="button" title="Language (EN / ಕನ್ನಡ / हिंदी)">🌐</button>
        <button id="agriBotClear" class="chat-hdr-btn" type="button" title="Clear conversation">🗑️</button>
        <button id="agriBotMaximize" class="chat-hdr-btn" type="button" title="Maximize/Restore window">⤢</button>
        <button id="agriBotClose" class="chat-hdr-btn" type="button" title="Close">✕</button>
      </div>
    `;
  }

  // 1.1 Inject History Drawer and Language Menu if not present
  let historyDrawer = document.getElementById("agriBotHistoryDrawer");
  if (!historyDrawer) {
    historyDrawer = document.createElement("div");
    historyDrawer.id = "agriBotHistoryDrawer";
    historyDrawer.className = "chat-history-drawer hidden";
    historyDrawer.innerHTML = `
      <div class="history-drawer-header">
        <h5>🕒 Saved Conversations</h5>
        <button id="agriBotCloseHistory" class="chat-hdr-btn" type="button" title="Close history">✕</button>
      </div>
      <div id="agriBotHistoryList" class="history-list"></div>
    `;
    windowEl.insertBefore(historyDrawer, header.nextSibling);
  }

  let langMenu = document.getElementById("agriBotLangMenu");
  if (!langMenu) {
    langMenu = document.createElement("div");
    langMenu.id = "agriBotLangMenu";
    langMenu.className = "chat-lang-menu hidden";
    langMenu.innerHTML = `
      <button type="button" class="lang-opt-btn active" data-lang="auto">🌐 Auto-detect</button>
      <button type="button" class="lang-opt-btn" data-lang="en">🇬🇧 English</button>
      <button type="button" class="lang-opt-btn" data-lang="kn">🇮🇳 ಕನ್ನಡ (Kannada)</button>
      <button type="button" class="lang-opt-btn" data-lang="hi">🇮🇳 हिंदी (Hindi)</button>
    `;
    windowEl.insertBefore(langMenu, header.nextSibling);
  }

  const closeBtn = document.getElementById("agriBotClose");
  const maxBtn = document.getElementById("agriBotMaximize");
  const clearBtn = document.getElementById("agriBotClear");
  const newChatBtn = document.getElementById("agriBotNewChat");
  const historyBtn = document.getElementById("agriBotHistoryBtn");
  const closeHistoryBtn = document.getElementById("agriBotCloseHistory");
  const langBtn = document.getElementById("agriBotLangBtn");
  const sendBtn = document.getElementById("agriBotSend");
  const input = document.getElementById("agriBotInput");
  const msgContainer = document.getElementById("agriBotMessages");
  const pills = document.querySelectorAll(".chat-pill");
  const inputBar = windowEl.querySelector(".chatbot-input-bar");

  // 1.2 Inject Attachment Preview Bar and Buttons into Input Bar
  let attachedPreview = document.getElementById("agriBotAttachedPreview");
  if (!attachedPreview && inputBar) {
    attachedPreview = document.createElement("div");
    attachedPreview.id = "agriBotAttachedPreview";
    attachedPreview.className = "chat-attached-preview";
    attachedPreview.style.display = "none";
    inputBar.parentNode.insertBefore(attachedPreview, inputBar);
  }

  let fileInput = document.getElementById("agriBotFileInput");
  let attachBtn = document.getElementById("agriBotAttach");
  if (inputBar && !attachBtn) {
    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "agriBotFileInput";
    fileInput.style.display = "none";
    fileInput.accept = ".pdf,.txt,.csv,.docx,.xlsx,.doc,.xls,.json,.md";

    attachBtn = document.createElement("button");
    attachBtn.id = "agriBotAttach";
    attachBtn.className = "bot-attach-btn";
    attachBtn.type = "button";
    attachBtn.title = "Attach document (PDF, TXT, CSV, DOCX, XLSX)";
    attachBtn.innerHTML = "📎";

    inputBar.insertBefore(attachBtn, input);
    inputBar.appendChild(fileInput);
  }

  let pauseBtn = document.getElementById("agriBotPause");
  let stopBtn = document.getElementById("agriBotStop");
  if (inputBar && !stopBtn) {
    pauseBtn = document.createElement("button");
    pauseBtn.id = "agriBotPause";
    pauseBtn.className = "bot-pause-btn";
    pauseBtn.type = "button";
    pauseBtn.title = "Pause generation";
    pauseBtn.style.display = "none";
    pauseBtn.innerHTML = "⏸️";

    stopBtn = document.createElement("button");
    stopBtn.id = "agriBotStop";
    stopBtn.className = "bot-stop-btn";
    stopBtn.type = "button";
    stopBtn.title = "Stop generation";
    stopBtn.style.display = "none";
    stopBtn.innerHTML = "⏹️";

    inputBar.appendChild(pauseBtn);
    inputBar.appendChild(stopBtn);
  }

  // 2. Window Visibility and Sizing Handlers
  window.openAgriBot = function() {
    windowEl.classList.remove("hidden");
    if (input) setTimeout(() => input.focus(), 150);
  };

  window.toggleAgriBot = function() {
    windowEl.classList.toggle("hidden");
    if (!windowEl.classList.contains("hidden") && input) {
      setTimeout(() => input.focus(), 150);
    }
  };

  window.toggleAgriBotMaximize = function() {
    windowEl.classList.toggle("maximized");
    const isMax = windowEl.classList.contains("maximized");
    if (maxBtn) {
      maxBtn.textContent = isMax ? "🗗" : "⤢";
      maxBtn.title = isMax ? "Restore window size" : "Expand window";
    }
  };

  bubble?.addEventListener("click", window.toggleAgriBot);
  closeBtn?.addEventListener("click", () => windowEl.classList.add("hidden"));
  maxBtn?.addEventListener("click", window.toggleAgriBotMaximize);

  document.querySelectorAll("#topbarChatbotBtn, [data-open-chatbot]").forEach(btn => {
    btn.addEventListener("click", window.openAgriBot);
  });

  // 3. Multi-Conversation Management & Persistence
  let conversations = [];
  let currentConvId = null;

  try {
    const savedConvs = localStorage.getItem("agricycle_conversations");
    if (savedConvs) {
      conversations = JSON.parse(savedConvs);
      if (!Array.isArray(conversations)) conversations = [];
    }
  } catch (_) {
    conversations = [];
  }

  // Migration from legacy single-history format
  if (conversations.length === 0) {
    let legacyHistory = [];
    try {
      const saved = localStorage.getItem("agricycle_chat_history");
      if (saved) legacyHistory = JSON.parse(saved) || [];
    } catch (_) {}

    const firstConv = {
      id: "conv-" + Date.now(),
      title: legacyHistory.length > 0 && legacyHistory[0]?.content ? legacyHistory[0].content.slice(0, 32) : "Welcome Conversation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: legacyHistory
    };
    conversations = [firstConv];
    currentConvId = firstConv.id;
    saveConversations();
  } else {
    currentConvId = localStorage.getItem("agricycle_active_conv_id") || conversations[0].id;
  }

  function getActiveConversation() {
    let conv = conversations.find(c => c.id === currentConvId);
    if (!conv) {
      conv = conversations[0] || {
        id: "conv-" + Date.now(),
        title: "New Conversation",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };
      currentConvId = conv.id;
    }
    return conv;
  }

  function saveConversations() {
    try {
      localStorage.setItem("agricycle_conversations", JSON.stringify(conversations.slice(0, 30)));
      localStorage.setItem("agricycle_active_conv_id", currentConvId);
      // Keep legacy key in sync for backwards compatibility
      const active = getActiveConversation();
      localStorage.setItem("agricycle_chat_history", JSON.stringify(active.messages.slice(-20)));
    } catch (_) {}
  }

  function renderHistoryList() {
    const listEl = document.getElementById("agriBotHistoryList");
    if (!listEl) return;
    listEl.innerHTML = "";

    if (conversations.length === 0) {
      listEl.innerHTML = '<div style="padding:14px;font-size:11px;color:var(--text-light);text-align:center;">No saved conversations</div>';
      return;
    }

    conversations.forEach(conv => {
      const itemEl = document.createElement("div");
      itemEl.className = "history-item" + (conv.id === currentConvId ? " active" : "");
      const timeStr = new Date(conv.updatedAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
      const msgCount = (conv.messages || []).length;

      itemEl.innerHTML = `
        <div class="history-item-info">
          <div class="history-item-title">${escapeHtml(conv.title || "Conversation")}</div>
          <div class="history-item-meta">${timeStr} • ${msgCount} msgs</div>
        </div>
        <button type="button" class="history-item-delete" title="Delete conversation">🗑️</button>
      `;

      itemEl.addEventListener("click", (e) => {
        if (e.target.closest(".history-item-delete")) return;
        switchConversation(conv.id);
        historyDrawer.classList.add("hidden");
      });

      const delBtn = itemEl.querySelector(".history-item-delete");
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteConversation(conv.id);
      });

      listEl.appendChild(itemEl);
    });
  }

  function switchConversation(convId) {
    if (isGenerating) stopAgriBotGeneration();
    currentConvId = convId;
    saveConversations();
    rehydrateActiveConversation();
  }

  function startNewConversation() {
    if (isGenerating) stopAgriBotGeneration();
    const newConv = {
      id: "conv-" + Date.now(),
      title: "New Conversation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    conversations.unshift(newConv);
    currentConvId = newConv.id;
    saveConversations();
    rehydrateActiveConversation();
    historyDrawer.classList.add("hidden");
    if (typeof showToast === "function") showToast("Started new conversation", "info");
  }

  function deleteConversation(convId) {
    conversations = conversations.filter(c => c.id !== convId);
    if (conversations.length === 0) {
      startNewConversation();
      return;
    }
    if (currentConvId === convId) {
      currentConvId = conversations[0].id;
    }
    saveConversations();
    renderHistoryList();
    rehydrateActiveConversation();
  }

  newChatBtn?.addEventListener("click", startNewConversation);
  historyBtn?.addEventListener("click", () => {
    historyDrawer.classList.toggle("hidden");
    langMenu.classList.add("hidden");
    if (!historyDrawer.classList.contains("hidden")) {
      renderHistoryList();
    }
  });
  closeHistoryBtn?.addEventListener("click", () => historyDrawer.classList.add("hidden"));

  // 4. Multilingual Selection Handling
  let selectedLanguage = localStorage.getItem("agricycle_chat_lang") || "auto";

  function updateLangUI() {
    if (langMenu) {
      langMenu.querySelectorAll(".lang-opt-btn").forEach(btn => {
        const lang = btn.dataset.lang;
        btn.classList.toggle("active", lang === selectedLanguage);
      });
    }
    if (langBtn) {
      const labels = { auto: "🌐", en: "🇬🇧", kn: "ಕನ್ನಡ", hi: "हिंदी" };
      langBtn.innerHTML = labels[selectedLanguage] || "🌐";
    }
  }
  updateLangUI();

  langBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    langMenu.classList.toggle("hidden");
    historyDrawer.classList.add("hidden");
  });

  langMenu?.querySelectorAll(".lang-opt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedLanguage = btn.dataset.lang || "auto";
      localStorage.setItem("agricycle_chat_lang", selectedLanguage);
      updateLangUI();
      langMenu.classList.add("hidden");
      if (typeof showToast === "function") {
        const names = { auto: "Auto-detect", en: "English", kn: "Kannada (ಕನ್ನಡ)", hi: "Hindi (हिंदी)" };
        showToast(`Language: ${names[selectedLanguage]}`, "info");
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (langMenu && !langMenu.contains(e.target) && e.target !== langBtn) {
      langMenu.classList.add("hidden");
    }
  });

  // 5. Document File Attachment Handling
  let activeAttachedFile = null;

  function setAttachedFile(file) {
    activeAttachedFile = file;
    if (!attachedPreview) return;
    if (file) {
      const sizeKb = Math.round(file.size / 1024);
      attachedPreview.style.display = "flex";
      attachedPreview.innerHTML = `
        <span class="chat-attached-badge">📄 ${escapeHtml(file.name)} (${sizeKb} KB)</span>
        <button type="button" class="remove-attach-btn" title="Remove attachment">✕</button>
      `;
      attachedPreview.querySelector(".remove-attach-btn")?.addEventListener("click", () => {
        setAttachedFile(null);
      });
    } else {
      attachedPreview.style.display = "none";
      attachedPreview.innerHTML = "";
      if (fileInput) fileInput.value = "";
    }
  }

  attachBtn?.addEventListener("click", () => {
    if (isGenerating) return;
    fileInput?.click();
  });

  fileInput?.addEventListener("change", () => {
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      if (file.size > 10 * 1024 * 1024) {
        if (typeof showToast === "function") showToast("File size limit is 10MB", "error");
        return;
      }
      setAttachedFile(file);
      if (typeof showToast === "function") showToast(`Attached ${file.name}`, "info");
    }
  });

  // 6. Active Generation Controller State
  let activeAbortController = null;
  let activeReader = null;
  let isGenerating = false;
  let isGenerationPaused = false;
  let pauseBuffer = [];
  let currentBotContentEl = null;
  let currentBotMsgEl = null;
  let currentBotRawText = "";

  function setGeneratingState(generating, paused = false) {
    isGenerating = generating;
    isGenerationPaused = paused;

    if (generating) {
      if (sendBtn) sendBtn.style.display = "none";
      if (pauseBtn) {
        pauseBtn.style.display = "inline-flex";
        pauseBtn.innerHTML = paused ? "▶️" : "⏸️";
        pauseBtn.title = paused ? "Resume generation" : "Pause generation";
      }
      if (stopBtn) {
        stopBtn.style.display = "inline-flex";
      }
      if (input) {
        input.disabled = true;
        input.placeholder = paused ? "Generation paused..." : "AgriBot is responding...";
      }
    } else {
      if (sendBtn) {
        sendBtn.style.display = "inline-flex";
        sendBtn.disabled = false;
      }
      if (pauseBtn) pauseBtn.style.display = "none";
      if (stopBtn) stopBtn.style.display = "none";
      if (input) {
        input.disabled = false;
        input.placeholder = "Ask AgriBot a question...";
      }
    }
  }

  window.clearAgriBotHistory = function() {
    if (isGenerating) stopAgriBotGeneration();
    const active = getActiveConversation();
    active.messages = [];
    active.updatedAt = new Date().toISOString();
    saveConversations();
    rehydrateActiveConversation();
    if (typeof showToast === "function") showToast("Conversation cleared", "info");
  };
  clearBtn?.addEventListener("click", window.clearAgriBotHistory);

  // 7. Markdown Formatter with Code Syntax Wrappers & Tables
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatChatMarkdown(raw) {
    if (!raw) return "";

    // 7.1 Extract code blocks first to protect code contents
    const codeBlocks = [];
    let text = raw.replace(/```([a-zA-Z0-9_\-\+]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
      const ph = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push({ lang: (lang || "code").trim(), code: code.trim() });
      return ph;
    });

    // 7.2 Escape HTML in regular text
    text = escapeHtml(text);

    // 7.3 Markdown tables
    text = text.replace(/((?:\|[^\n]+\|\r?\n)+)/g, match => {
      const lines = match.trim().split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) return match;
      const headers = lines[0].split("|").slice(1, -1).map(h => h.trim());
      if (!lines[1].includes("-")) return match;
      let table = '<div class="chat-table-wrap"><table class="chat-table"><thead><tr>';
      headers.forEach(h => { table += `<th>${h}</th>`; });
      table += '</tr></thead><tbody>';
      for (let i = 2; i < lines.length; i++) {
        const cells = lines[i].split("|").slice(1, -1).map(c => c.trim());
        table += '<tr>';
        cells.forEach(c => { table += `<td>${c}</td>`; });
        table += '</tr>';
      }
      table += '</tbody></table></div>';
      return table;
    });

    // 7.4 Headings
    text = text.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
    text = text.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    // 7.5 Blockquotes
    text = text.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');

    // 7.6 Inline code
    const inlineCodes = [];
    text = text.replace(/`([^`\n]+)`/g, (match, code) => {
      const ph = `__INLINE_CODE_${inlineCodes.length}__`;
      inlineCodes.push(code);
      return ph;
    });

    // 7.7 Bold & Italics
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
    text = text.replace(/\*([^\*\n]+?)\*/g, '<em>$1</em>');
    text = text.replace(/(^|\s)_([^_ \n]+?)_(\s|$)/g, '$1<em>$2</em>$3');

    // 7.8 Restore inline code
    inlineCodes.forEach((ic, idx) => {
      text = text.replace(`__INLINE_CODE_${idx}__`, `<code>${ic}</code>`);
    });

    // 7.9 Unordered lists
    text = text.replace(/(?:^|\n)([\*\-] [^\n]+(?:\n[\*\-] [^\n]+)*)/g, (m, list) => {
      const items = list.split(/\n[\*\-] /).map((it, idx) => {
        const clean = idx === 0 ? it.replace(/^[\*\-] /, "") : it;
        return `<li>${clean.trim()}</li>`;
      }).join("");
      return `<ul>${items}</ul>`;
    });

    // 7.10 Ordered lists
    text = text.replace(/(?:^|\n)(\d+\. [^\n]+(?:\n\d+\. [^\n]+)*)/g, (m, list) => {
      const items = list.split(/\n\d+\. /).map((it, idx) => {
        const clean = idx === 0 ? it.replace(/^\d+\. /, "") : it;
        return `<li>${clean.trim()}</li>`;
      }).join("");
      return `<ol>${items}</ol>`;
    });

    // 7.11 Paragraphs and line breaks
    const paragraphs = text.split(/\n\s*\n/);
    text = paragraphs.map(p => {
      p = p.trim();
      if (!p) return "";
      if (/^<(h[1-4]|ul|ol|blockquote|div|table)/i.test(p)) return p;
      return `<p>${p.replace(/\n/g, "<br>")}</p>`;
    }).filter(Boolean).join("");

    // 7.12 Restore code blocks
    codeBlocks.forEach((cb, idx) => {
      const ph = `__CODE_BLOCK_${idx}__`;
      const escaped = escapeHtml(cb.code);
      const langLabel = (cb.lang || "code").toUpperCase();
      const blockHtml = `
        <div class="code-block-wrap">
          <div class="code-block-header">
            <span class="code-lang-badge">${langLabel}</span>
            <button type="button" class="copy-code-btn" onclick="window.copyChatCode(this)">📋 Copy Code</button>
          </div>
          <pre><code class="language-${cb.lang}">${escaped}</code></pre>
        </div>
      `.trim();
      text = text.replace(ph, blockHtml);
    });

    return text;
  }

  // 8. Global Action Handlers: Copy Code, Copy Response, Regenerate
  window.copyChatCode = function(btn) {
    const codeEl = btn.closest(".code-block-wrap")?.querySelector("pre code");
    if (!codeEl) return;
    const codeText = codeEl.textContent || "";
    navigator.clipboard.writeText(codeText).then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = "✓ Copied!";
      setTimeout(() => { btn.innerHTML = orig; }, 1800);
    }).catch(() => {
      if (typeof showToast === "function") showToast("Failed to copy code", "error");
    });
  };

  window.copyChatResponse = function(btn) {
    const msg = btn.closest(".chat-msg.bot");
    if (!msg) return;
    const raw = msg.dataset.rawText || msg.innerText || "";
    navigator.clipboard.writeText(raw).then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = "✓ Copied";
      setTimeout(() => { btn.innerHTML = orig; }, 1800);
    }).catch(() => {
      if (typeof showToast === "function") showToast("Failed to copy response", "error");
    });
  };

  // 9. UI Helpers: Typing Indicator & Message Rendering
  function showTypingIndicator(customText) {
    hideTypingIndicator();
    const indicator = document.createElement("div");
    indicator.className = "typing-bubble";
    indicator.id = "agriBotTypingIndicator";
    const label = customText || "AgriBot is thinking...";
    indicator.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span style="margin-left: 4px;">${escapeHtml(label)}</span>
    `;
    msgContainer.appendChild(indicator);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function hideTypingIndicator() {
    const el = document.getElementById("agriBotTypingIndicator");
    if (el) el.remove();
  }

  function appendBotFooter(botEl) {
    if (botEl.querySelector(".msg-footer")) return;

    const footer = document.createElement("div");
    footer.className = "msg-footer";
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    footer.innerHTML = `
      <span class="msg-time">${timeStr} • AgriBot</span>
      <div class="msg-actions">
        <button type="button" class="msg-btn copy-msg-btn" onclick="window.copyChatResponse(this)" title="Copy response">📋 Copy</button>
        <button type="button" class="msg-btn regen-msg-btn" onclick="window.regenerateChatResponse(this)" title="Regenerate response">🔄 Regenerate</button>
      </div>
    `;
    botEl.appendChild(footer);
  }

  // 10. Interactive Controls: Render User Message with Edit & Rerun
  function renderUserMessage(text, turnIndex) {
    const userEl = document.createElement("div");
    userEl.className = "chat-msg user";
    userEl.dataset.turnIndex = turnIndex;

    const textEl = document.createElement("div");
    textEl.className = "user-msg-text";
    textEl.textContent = text;
    userEl.appendChild(textEl);

    const actionsEl = document.createElement("div");
    actionsEl.className = "user-msg-actions";
    actionsEl.innerHTML = `
      <button type="button" class="user-action-btn edit-msg-btn" title="Edit question">✏️ Edit</button>
      <button type="button" class="user-action-btn rerun-msg-btn" title="Rerun question">🔁 Rerun</button>
    `;

    actionsEl.querySelector(".edit-msg-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      if (isGenerating) return;
      startEditingUserMessage(userEl, turnIndex);
    });

    actionsEl.querySelector(".rerun-msg-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      if (isGenerating) return;
      rerunUserQuestion(turnIndex);
    });

    userEl.appendChild(actionsEl);
    return userEl;
  }

  function startEditingUserMessage(userEl, turnIndex) {
    if (isGenerating) return;

    const active = getActiveConversation();
    // Restore any other open edit box
    msgContainer.querySelectorAll(".msg-edit-box").forEach(box => {
      const parent = box.closest(".chat-msg.user");
      const idx = parseInt(parent?.dataset.turnIndex, 10);
      if (!isNaN(idx) && active.messages[idx]) {
        const origEl = renderUserMessage(active.messages[idx].content, idx);
        parent.replaceWith(origEl);
      }
    });

    const currentText = active.messages[turnIndex]?.content || userEl.querySelector(".user-msg-text")?.textContent || "";

    userEl.innerHTML = `
      <div class="msg-edit-box">
        <textarea class="msg-edit-textarea" rows="2" aria-label="Edit question">${escapeHtml(currentText)}</textarea>
        <div class="msg-edit-actions">
          <button type="button" class="edit-btn edit-cancel-btn">Cancel</button>
          <button type="button" class="edit-btn edit-save-btn">Save & Submit</button>
        </div>
      </div>
    `;

    const textarea = userEl.querySelector(".msg-edit-textarea");
    const cancelBtn = userEl.querySelector(".edit-cancel-btn");
    const saveBtn = userEl.querySelector(".edit-save-btn");

    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          saveBtn.click();
        } else if (e.key === "Escape") {
          cancelBtn.click();
        }
      });
    }

    cancelBtn.addEventListener("click", () => {
      const restoredEl = renderUserMessage(currentText, turnIndex);
      userEl.replaceWith(restoredEl);
    });

    saveBtn.addEventListener("click", () => {
      const newText = textarea.value.trim();
      if (!newText) return;
      saveAndResubmitEdit(turnIndex, newText);
    });
  }

  function saveAndResubmitEdit(turnIndex, newText) {
    if (isGenerating) return;
    const active = getActiveConversation();
    active.messages = active.messages.slice(0, turnIndex);
    active.updatedAt = new Date().toISOString();
    saveConversations();

    const allMsgs = Array.from(msgContainer.querySelectorAll(".chat-msg"));
    allMsgs.forEach(m => {
      const idx = parseInt(m.dataset.turnIndex, 10);
      if (!isNaN(idx) && idx >= turnIndex) {
        m.remove();
      }
    });

    handleUserQuery(newText);
  }

  function rerunUserQuestion(turnIndex) {
    if (isGenerating) return;
    const active = getActiveConversation();
    const question = active.messages[turnIndex]?.content;
    if (!question) return;

    active.messages = active.messages.slice(0, turnIndex);
    active.updatedAt = new Date().toISOString();
    saveConversations();

    const allMsgs = Array.from(msgContainer.querySelectorAll(".chat-msg"));
    allMsgs.forEach(m => {
      const idx = parseInt(m.dataset.turnIndex, 10);
      if (!isNaN(idx) && idx >= turnIndex) {
        m.remove();
      }
    });

    handleUserQuery(question);
  }

  window.regenerateChatResponse = function(btn) {
    if (isGenerating) return;
    const active = getActiveConversation();

    let botTurnIdx = NaN;
    if (btn) {
      const targetBotEl = btn.closest(".chat-msg.bot");
      if (targetBotEl) botTurnIdx = parseInt(targetBotEl.dataset.turnIndex, 10);
    }

    if (isNaN(botTurnIdx)) {
      for (let i = active.messages.length - 1; i >= 0; i--) {
        if (active.messages[i].role === "assistant") {
          botTurnIdx = i;
          break;
        }
      }
    }

    if (isNaN(botTurnIdx) || botTurnIdx < 1) {
      if (typeof showToast === "function") showToast("No previous response to regenerate", "info");
      return;
    }

    const userTurnIdx = botTurnIdx - 1;
    const userQuestion = active.messages[userTurnIdx]?.content;
    if (!userQuestion) return;

    active.messages = active.messages.slice(0, botTurnIdx);
    active.updatedAt = new Date().toISOString();
    saveConversations();

    const allMsgs = Array.from(msgContainer.querySelectorAll(".chat-msg"));
    allMsgs.forEach(m => {
      const idx = parseInt(m.dataset.turnIndex, 10);
      if (!isNaN(idx) && idx >= botTurnIdx) {
        m.remove();
      }
    });

    handleUserQuery(userQuestion, true);
  };

  // 11. Stop / Cancel Generation Handler
  function stopAgriBotGeneration() {
    if (!isGenerating) return;

    isGenerating = false;
    isGenerationPaused = false;
    pauseBuffer = [];

    if (activeAbortController) {
      try { activeAbortController.abort(); } catch (_) {}
      activeAbortController = null;
    }
    if (activeReader) {
      try { activeReader.cancel().catch(() => {}); } catch (_) {}
      activeReader = null;
    }

    hideTypingIndicator();

    if (currentBotMsgEl) {
      currentBotMsgEl.classList.remove("generating");
      const pBadge = currentBotMsgEl.querySelector(".generation-paused-indicator");
      if (pBadge) pBadge.remove();

      if (currentBotRawText.trim().length === 0) {
        if (currentBotContentEl) {
          currentBotContentEl.innerHTML = `<p class="msg-interrupted"><em>⏹️ Generation cancelled.</em></p>`;
        }
        currentBotRawText = "Generation cancelled.";
      } else {
        if (!currentBotMsgEl.querySelector(".msg-interrupted-tag")) {
          const stopTag = document.createElement("div");
          stopTag.className = "msg-interrupted-tag";
          stopTag.innerHTML = "⏹️ Generation stopped";
          currentBotMsgEl.appendChild(stopTag);
        }
      }

      currentBotMsgEl.dataset.rawText = currentBotRawText;
      appendBotFooter(currentBotMsgEl);

      const active = getActiveConversation();
      const botTurnIndex = active.messages.length;
      currentBotMsgEl.dataset.turnIndex = botTurnIndex;
      active.messages.push({ role: "assistant", content: currentBotRawText });
      active.updatedAt = new Date().toISOString();
      saveConversations();
    }

    setGeneratingState(false);
    if (input) setTimeout(() => input.focus(), 100);
  }

  stopBtn?.addEventListener("click", stopAgriBotGeneration);

  // 12. Pause / Resume Handler
  function flushPauseBuffer() {
    if (pauseBuffer.length > 0 && currentBotContentEl) {
      while (pauseBuffer.length > 0) {
        currentBotRawText += pauseBuffer.shift();
      }
      currentBotContentEl.innerHTML = formatChatMarkdown(currentBotRawText);
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }
  }

  pauseBtn?.addEventListener("click", () => {
    if (!isGenerating) return;
    isGenerationPaused = !isGenerationPaused;

    if (isGenerationPaused) {
      pauseBtn.innerHTML = "▶️";
      pauseBtn.title = "Resume generation";
      if (input) input.placeholder = "Generation paused...";
      if (currentBotMsgEl && !currentBotMsgEl.querySelector(".generation-paused-indicator")) {
        const pBadge = document.createElement("div");
        pBadge.className = "generation-paused-indicator";
        pBadge.innerHTML = "⏸️ Generation paused";
        currentBotMsgEl.appendChild(pBadge);
      }
    } else {
      pauseBtn.innerHTML = "⏸️";
      pauseBtn.title = "Pause generation";
      if (input) input.placeholder = "AgriBot is responding...";
      const pBadge = currentBotMsgEl?.querySelector(".generation-paused-indicator");
      if (pBadge) pBadge.remove();

      flushPauseBuffer();
    }
  });

  // 13. Core Dispatcher with Streaming, Document Upload & Multilingual
  async function handleUserQuery(query, isRegen = false) {
    const cleanQuery = String(query || "").trim();
    const hasAttachment = Boolean(activeAttachedFile);

    if (!cleanQuery && !hasAttachment) return;

    const active = getActiveConversation();
    const API_BASE = window.location.port === "5000" ? "" : "http://localhost:5000";

    // 13.1 Handle Document Upload Analysis
    if (hasAttachment) {
      const file = activeAttachedFile;
      setAttachedFile(null); // Clear attachment preview

      const displayText = cleanQuery ? `📄 **Attached Document**: \`${file.name}\`\n\n${cleanQuery}` : `📄 **Attached Document**: \`${file.name}\` (Analyze Document)`;
      const userTurnIndex = active.messages.length;
      const userEl = renderUserMessage(displayText, userTurnIndex);
      msgContainer.appendChild(userEl);
      msgContainer.scrollTop = msgContainer.scrollHeight;
      active.messages.push({ role: "user", content: displayText });
      if (active.messages.length <= 2) {
        active.title = `Document: ${file.name.slice(0, 24)}`;
      }
      active.updatedAt = new Date().toISOString();
      saveConversations();

      showTypingIndicator(`Analyzing document '${file.name}'...`);
      setGeneratingState(true, false);

      try {
        const formData = new FormData();
        formData.append("file", file);
        if (cleanQuery) formData.append("message", cleanQuery);

        const docRes = await fetch(`${API_BASE}/api/ai/document/analyze`, {
          method: "POST",
          body: formData,
        });

        hideTypingIndicator();
        setGeneratingState(false);

        if (!docRes.ok) throw new Error(`HTTP ${docRes.status}`);
        const data = await docRes.json();
        const reply = data.reply || "Document processed successfully.";

        const botMsgEl = document.createElement("div");
        botMsgEl.className = "chat-msg bot";
        const botContentEl = document.createElement("div");
        botContentEl.className = "msg-content";
        botContentEl.innerHTML = formatChatMarkdown(reply);
        botMsgEl.appendChild(botContentEl);

        botMsgEl.dataset.rawText = reply;
        const botTurnIndex = active.messages.length;
        botMsgEl.dataset.turnIndex = botTurnIndex;
        appendBotFooter(botMsgEl);
        msgContainer.appendChild(botMsgEl);

        active.messages.push({ role: "assistant", content: reply });
        active.updatedAt = new Date().toISOString();
        saveConversations();
      } catch (docErr) {
        hideTypingIndicator();
        setGeneratingState(false);
        const errEl = document.createElement("div");
        errEl.className = "chat-msg bot";
        errEl.innerHTML = `<p style="color:var(--rose);">⚠️ <strong>Document Analysis Notice:</strong> Failed to analyze document (${escapeHtml(docErr.message)}). Please verify document format and try again.</p>`;
        msgContainer.appendChild(errEl);
      }

      msgContainer.scrollTop = msgContainer.scrollHeight;
      if (input) {
        input.value = "";
        setTimeout(() => input.focus(), 100);
      }
      return;
    }

    // 13.2 Multilingual Query Augmentation
    let queryPayload = cleanQuery;
    if (selectedLanguage === "kn") {
      queryPayload = `[Respond in Kannada / ಕನ್ನಡ]: ${cleanQuery}`;
    } else if (selectedLanguage === "hi") {
      queryPayload = `[Respond in Hindi / हिंदी]: ${cleanQuery}`;
    }

    if (!isRegen) {
      const userTurnIndex = active.messages.length;
      const userEl = renderUserMessage(cleanQuery, userTurnIndex);
      msgContainer.appendChild(userEl);
      msgContainer.scrollTop = msgContainer.scrollHeight;
      active.messages.push({ role: "user", content: cleanQuery });

      // Auto-generate conversation title from first user query
      if (active.messages.length <= 2) {
        active.title = cleanQuery.slice(0, 32);
      }
      active.updatedAt = new Date().toISOString();
      saveConversations();
    }

    showTypingIndicator();
    setGeneratingState(true, false);

    activeAbortController = new AbortController();
    activeReader = null;
    isGenerationPaused = false;
    pauseBuffer = [];
    currentBotRawText = "";

    const historyPayload = active.messages.slice(-10);
    let streamSuccess = false;
    currentBotMsgEl = null;
    currentBotContentEl = null;

    // 13.3 SSE Streaming
    try {
      const streamRes = await fetch(`${API_BASE}/api/ai/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: activeAbortController.signal,
        body: JSON.stringify({
          message: queryPayload,
          history: historyPayload
        })
      });

      if (streamRes.ok && streamRes.body) {
        hideTypingIndicator();
        currentBotMsgEl = document.createElement("div");
        currentBotMsgEl.className = "chat-msg bot generating";
        currentBotContentEl = document.createElement("div");
        currentBotContentEl.className = "msg-content";
        currentBotMsgEl.appendChild(currentBotContentEl);
        msgContainer.appendChild(currentBotMsgEl);

        const reader = streamRes.body.getReader();
        activeReader = reader;
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          if (!isGenerating || activeAbortController?.signal.aborted) {
            break;
          }

          let readRes;
          try {
            readRes = await reader.read();
          } catch (rErr) {
            if (activeAbortController?.signal.aborted || rErr.name === "AbortError") {
              break;
            }
            throw rErr;
          }

          const { done, value } = readRes;
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            const line = part.trim();
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.chunk) {
                  if (isGenerationPaused) {
                    pauseBuffer.push(data.chunk);
                  } else {
                    flushPauseBuffer();
                    currentBotRawText += data.chunk;
                    currentBotContentEl.innerHTML = formatChatMarkdown(currentBotRawText);
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                  }
                }
              } catch (_) {}
            }
          }
        }

        // Wait if paused at finish
        while (isGenerationPaused && isGenerating && !activeAbortController?.signal.aborted) {
          await new Promise(resolve => setTimeout(resolve, 150));
        }

        if (isGenerating && !activeAbortController?.signal.aborted) {
          if (buffer.trim().startsWith("data: ")) {
            try {
              const data = JSON.parse(buffer.trim().slice(6));
              if (data.chunk) {
                if (isGenerationPaused) {
                  pauseBuffer.push(data.chunk);
                } else {
                  currentBotRawText += data.chunk;
                  currentBotContentEl.innerHTML = formatChatMarkdown(currentBotRawText);
                }
              }
            } catch (_) {}
          }

          flushPauseBuffer();

          if (currentBotRawText.trim().length > 0) {
            streamSuccess = true;
            currentBotMsgEl.classList.remove("generating");
            const pBadge = currentBotMsgEl.querySelector(".generation-paused-indicator");
            if (pBadge) pBadge.remove();

            currentBotMsgEl.dataset.rawText = currentBotRawText;
            const botTurnIndex = active.messages.length;
            currentBotMsgEl.dataset.turnIndex = botTurnIndex;
            appendBotFooter(currentBotMsgEl);
            active.messages.push({ role: "assistant", content: currentBotRawText });
            active.updatedAt = new Date().toISOString();
            saveConversations();
          }
        }
      }
    } catch (streamErr) {
      if (activeAbortController?.signal.aborted || streamErr.name === "AbortError") {
        return;
      }
      console.warn("AgriBot streaming unavailable, falling back to standard endpoint:", streamErr);
    }

    if (!isGenerating || activeAbortController?.signal.aborted) {
      return;
    }

    // 13.4 Standard Fallback
    if (!streamSuccess && isGenerating) {
      try {
        const fbRes = await fetch(`${API_BASE}/api/ai/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: activeAbortController.signal,
          body: JSON.stringify({
            message: queryPayload,
            history: historyPayload
          })
        });

        hideTypingIndicator();
        if (!fbRes.ok) throw new Error(`HTTP ${fbRes.status}`);
        const data = await fbRes.json();
        const reply = data.reply || data.response || "I apologize, but I could not generate a response.";

        if (!currentBotMsgEl) {
          currentBotMsgEl = document.createElement("div");
          currentBotMsgEl.className = "chat-msg bot";
          currentBotContentEl = document.createElement("div");
          currentBotContentEl.className = "msg-content";
          currentBotMsgEl.appendChild(currentBotContentEl);
          msgContainer.appendChild(currentBotMsgEl);
        }

        currentBotMsgEl.classList.remove("generating");
        currentBotContentEl.innerHTML = formatChatMarkdown(reply);
        currentBotMsgEl.dataset.rawText = reply;
        const botTurnIndex = active.messages.length;
        currentBotMsgEl.dataset.turnIndex = botTurnIndex;
        appendBotFooter(currentBotMsgEl);
        active.messages.push({ role: "assistant", content: reply });
        active.updatedAt = new Date().toISOString();
        saveConversations();
      } catch (err) {
        if (activeAbortController?.signal.aborted || err.name === "AbortError") {
          return;
        }
        hideTypingIndicator();
        const errEl = document.createElement("div");
        errEl.className = "chat-msg bot";
        errEl.innerHTML = `
          <p style="color:var(--rose);">⚠️ <strong>Service Notice:</strong> Could not connect to the AgriCycle AI backend. Please ensure the backend server is running on port 5000.</p>
        `;
        msgContainer.appendChild(errEl);
      }
    }

    hideTypingIndicator();
    setGeneratingState(false);
    activeAbortController = null;
    activeReader = null;
    currentBotMsgEl = null;
    currentBotContentEl = null;
    if (input) {
      input.value = "";
      setTimeout(() => input.focus(), 100);
    }
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  // 14. Rehydrate active conversation
  function rehydrateActiveConversation() {
    if (!msgContainer) return;
    const active = getActiveConversation();
    msgContainer.innerHTML = "";

    if (!active.messages || active.messages.length === 0) {
      msgContainer.innerHTML = `
        <div class="chat-msg bot" data-raw-text="Hello! I am AgriBot, your intelligent assistant powered by generative AI.">
          <p>👋 Hello! I am <strong>AgriBot</strong>, your intelligent assistant powered by generative AI.</p>
          <p>I can help you with <strong>agricultural waste valuation</strong>, <strong>crop residue recycling</strong>, <strong>document analysis (PDF, CSV, DOCX)</strong>, and any open-ended questions across <strong>technology, science, mathematics, coding, business, and writing</strong> in <strong>English, ಕನ್ನಡ, or हिंदी</strong>.</p>
          <p>How can I help you today?</p>
        </div>
      `;
      return;
    }

    active.messages.forEach((item, idx) => {
      if (item.role === "user") {
        msgContainer.appendChild(renderUserMessage(item.content, idx));
      } else {
        const botEl = document.createElement("div");
        botEl.className = "chat-msg bot";
        botEl.dataset.turnIndex = idx;
        botEl.dataset.rawText = item.content;
        const cEl = document.createElement("div");
        cEl.className = "msg-content";
        cEl.innerHTML = formatChatMarkdown(item.content);
        botEl.appendChild(cEl);
        appendBotFooter(botEl);
        msgContainer.appendChild(botEl);
      }
    });
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  rehydrateActiveConversation();

  // 15. Event Bindings: Input Submit & Quick Action Pills
  sendBtn?.addEventListener("click", () => {
    if (isGenerating) return;
    const val = input.value.trim();
    if (!val && !activeAttachedFile) return;
    handleUserQuery(val);
  });

  input?.addEventListener("keypress", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating) return;
      const val = input.value.trim();
      if (!val && !activeAttachedFile) return;
      handleUserQuery(val);
    }
  });

  pills.forEach(p => {
    p.addEventListener("click", () => {
      if (isGenerating) return;
      const q = p.dataset.query || p.textContent.replace(/^[^\w]+/, "").trim();
      handleUserQuery(q);
    });
  });
}

// ==========================================================================
// 11. Page Initialization Router
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initBrowsePage();
  initDashboard();
  initRequestsPage();
  initListWasteForm();
  initImpactCalculator();
  setupAgriBot();
});


// ==========================================================================
// Theme Management (Light / Dark) & Options Menu
// ==========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem("agricycle_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeUI(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("agricycle_theme", newTheme);
  updateThemeUI(newTheme);
  if (typeof showToast === "function") {
    showToast(`Switched to ${newTheme === "dark" ? "Dark Mode 🌙" : "Light Mode ☀️"}`, "info");
  }
}

function updateThemeUI(theme) {
  const themeText = document.getElementById("themeText");
  const themeIcon = document.getElementById("themeIcon");
  if (themeText && themeIcon) {
    if (theme === "dark") {
      themeText.textContent = "Light Mode";
      themeIcon.textContent = "☀️";
    } else {
      themeText.textContent = "Dark Mode";
      themeIcon.textContent = "🌙";
    }
  }
}

function initOptionsMenu() {
  const optionsBtn = document.getElementById("optionsBtn");
  const optionsMenu = document.getElementById("optionsMenu");
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTheme();
    });
  }

  if (optionsBtn && optionsMenu) {
    optionsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = optionsMenu.classList.toggle("open");
      optionsBtn.classList.toggle("active", isOpen);
      optionsBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", (e) => {
      if (!optionsMenu.contains(e.target) && !optionsBtn.contains(e.target)) {
        optionsMenu.classList.remove("open");
        optionsBtn.classList.remove("active");
        optionsBtn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && optionsMenu.classList.contains("open")) {
        optionsMenu.classList.remove("open");
        optionsBtn.classList.remove("active");
        optionsBtn.setAttribute("aria-expanded", "false");
      }
    });
  }
}

initTheme();
initOptionsMenu();
