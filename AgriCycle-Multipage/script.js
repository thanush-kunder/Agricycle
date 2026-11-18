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

// Setup Role Switcher in Topbar
function setupRoleSwitcher() {
  const roleBtn = document.getElementById("roleSwitcherBtn");
  if (!roleBtn) return;

  function updateRoleDisplay() {
    roleBtn.innerHTML = `<span class="role-dot"></span><span>${currentUser.label}</span>`;
  }
  updateRoleDisplay();

  roleBtn.addEventListener("click", () => {
    const displayName = currentUser.name && currentUser.name !== "Farmer" && currentUser.name !== "Customer" 
      ? ` (${currentUser.name})` 
      : "";

    if (currentUser.role === "generator") {
      currentUser.role = "utilizer";
      currentUser.label = `🛒 Customer${displayName}`;
      showToast(`Switched to Customer Perspective${displayName}`, "info");
    } else {
      currentUser.role = "generator";
      currentUser.label = `🌾 Farmer${displayName}`;
      showToast(`Switched to Farmer Perspective${displayName}`, "info");
    }
    saveData("agricycle_active_user", currentUser);
    updateRoleDisplay();

    // Re-calculate distances
    listings.forEach(item => {
      item.distanceKm = calculateDistanceKm(currentUser.lat, currentUser.lng, item.lat, item.lng);
    });

    // Re-render if on browse, dashboard, or requests
    if (typeof renderListings === "function") renderListings();
    if (typeof renderDashboard === "function") renderDashboard();
    if (typeof renderRequests === "function") renderRequests();
  });
}
setupRoleSwitcher();

// Setup Auth (Sign In / Sign Out) in Topbar
function setupAuthButton() {
  const token = localStorage.getItem("agricycle_token");
  const user = JSON.parse(localStorage.getItem("agricycle_active_user") || "null");
  const isSignedIn = !!(token || (user && user.name));

  const authBtns = document.querySelectorAll(".topbar-actions a, #authNavBtn");
  authBtns.forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();
    if (text === "sign in" || text === "sign out" || btn.id === "authNavBtn") {
      btn.id = "authNavBtn";
      if (isSignedIn) {
        // User IS signed in: remove "Sign In" option and replace with "Sign Out"
        btn.textContent = "Sign Out";
        btn.href = "#";
        btn.title = `Signed in as ${user?.name || "User"}. Click to Sign Out`;
        btn.classList.add("btn-signout");
        btn.onclick = function(e) {
          e.preventDefault();
          localStorage.removeItem("agricycle_token");
          localStorage.removeItem("agricycle_active_user");
          showToast("Signed out successfully.", "info");
          setTimeout(() => {
            window.location.href = "index.html";
          }, 350);
        };
      } else {
        // Not signed in: show "Sign In"
        btn.textContent = "Sign In";
        btn.href = "index.html";
        btn.classList.remove("btn-signout");
        btn.onclick = null;
      }
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
// 10. AI Chatbot Assistant ("AgriBot")
// ==========================================================================
function setupAgriBot() {
  const bubble = document.getElementById("agriBotBubble");
  const windowEl = document.getElementById("agriBotWindow");
  const closeBtn = document.getElementById("agriBotClose");
  const sendBtn = document.getElementById("agriBotSend");
  const input = document.getElementById("agriBotInput");
  const msgContainer = document.getElementById("agriBotMessages");
  const pills = document.querySelectorAll(".chat-pill");

  if (!windowEl) return;

  window.openAgriBot = function() {
    windowEl.classList.remove("hidden");
    if (input) {
      setTimeout(() => input.focus(), 150);
    }
  };

  window.toggleAgriBot = function() {
    windowEl.classList.toggle("hidden");
    if (!windowEl.classList.contains("hidden") && input) {
      setTimeout(() => input.focus(), 150);
    }
  };

  bubble?.addEventListener("click", window.toggleAgriBot);

  // Bind any topbar or header chatbot trigger buttons
  document.querySelectorAll("#topbarChatbotBtn, [data-open-chatbot]").forEach(btn => {
    btn.addEventListener("click", window.openAgriBot);
  });

  closeBtn?.addEventListener("click", () => windowEl.classList.add("hidden"));

  const botResponses = {
    paddy: "Paddy Straw is in high demand for mushroom cultivation (oyster/milky mushrooms), packaging material, and compressed biomass pellets for boilers. You can sell it around ₹1.5 - ₹2.5/kg on AgriCycle!",
    coconut: "Coconut Husk can be converted to coir fibre, potting peat for nurseries, and geo-textiles for soil erosion control. Many buyers in coastal Karnataka take it via exchange!",
    stubble: "Burning agricultural residue causes severe smog, loss of soil nitrogen, and carbon pollution. AgriCycle connects you directly with nearby bio-composters and power plants to turn that waste into profit.",
    verify: "AgriCycle features AI CNN Quality Verification. Simply upload a photo of your harvest residue on the 'List Waste' page to verify fiber density and receive a Grade A badge with higher search priority!",
    proximity: "Our matching algorithm uses the Haversine formula to compute geodesic distances between farms and utilizers, keeping transport costs low and minimizing transit emissions."
  };

  function appendMsg(text, sender) {
    if (!msgContainer) return;
    const msg = document.createElement("div");
    msg.className = `chat-msg ${sender}`;
    msg.textContent = text;
    msgContainer.appendChild(msg);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function handleUserQuery(q) {
    appendMsg(q, "user");
    const lower = q.toLowerCase();

    let reply = "I can help with crop residue repurposing, AI CNN verification, or Karnataka pricing. Ask about Paddy Straw, Coconut Husk, Stubble Burning, or Proximity Matching!";
    if (lower.includes("paddy") || lower.includes("straw")) reply = botResponses.paddy;
    else if (lower.includes("coconut") || lower.includes("husk")) reply = botResponses.coconut;
    else if (lower.includes("stubble") || lower.includes("burn") || lower.includes("smoke")) reply = botResponses.stubble;
    else if (lower.includes("verify") || lower.includes("ai") || lower.includes("cnn") || lower.includes("grade")) reply = botResponses.verify;
    else if (lower.includes("distance") || lower.includes("proximity") || lower.includes("match") || lower.includes("haversine")) reply = botResponses.proximity;

    setTimeout(() => appendMsg(reply, "bot"), 400);
  }

  sendBtn?.addEventListener("click", () => {
    const val = input.value.trim();
    if (!val) return;
    input.value = "";
    handleUserQuery(val);
  });

  input?.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      const val = input.value.trim();
      if (!val) return;
      input.value = "";
      handleUserQuery(val);
    }
  });

  pills.forEach(p => {
    p.addEventListener("click", () => {
      handleUserQuery(p.dataset.query || p.textContent);
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
