================================================================================
AgriCycle - Complete Frontend UI/UX & Responsive Dashboards
Frontend Lead: Tanisha (4CB24CS160)
================================================================================

PAGES & ARCHITECTURE:
1. index.html (First Page / Sign In Gateway):
   - Welcoming entry point for all users (Farmers and Customers)
   - Visual role picker: 🌾 I'm a Farmer vs 🛒 I'm a Customer
   - Phone or Email input field with helper tips
   - Password field with 👁 / 🙈 Show/Hide visibility toggle
   - Sign in button with automatic role routing (Farmer -> Dashboard, Customer -> Home)
   - ⚡ 1-Click Quick Demo Login buttons for fast evaluator testing
   - "Create account" and "Forgot password?" links
   - "Explore Platform as Guest ↗" button to view without signing in

2. home.html (Platform Showcase & Circular Overview):
   - Hero banner with circular mission statement
   - Live metrics summary strip (8,050 kg biomass listed, 6 Karnataka districts)
   - Featured residue cards with "AI Verified" badges
   - Real-time circular value propositions

3. browse.html (Biomass Marketplace & Leaflet Map):
   - Interactive Leaflet OpenStreetMap integration with custom markers and popups
   - View mode toggle: Cards View, Map View, Split View
   - Haversine proximity distance slider (10 km to 350 km)
   - Filter by transaction type (Sell, Barter/Exchange, Free) and "AI Verified Only"
   - Interactive Exchange Request modal with live unit price calculation

4. dashboard.html (Responsive Analytics Dashboard):
   - Role Switcher: 🌾 Farmer Perspective vs 🏭 Utilizer Perspective
   - KPI metrics cards: Biomass diverted, regional listings, pending approvals, CO2 saved
   - Crop residue inventory distribution bars (Paddy, Coconut, Bagasse, Areca, Cotton)
   - Circular fulfillment ratio donut chart
   - Farmer Control Panel: "My Active Listings" with delete and management controls
   - Utilizer Panel: Smart Proximity Recommendations ranked via the Haversine formula

5. list-waste.html (Farmer Residue Dispatch Portal):
   - Comprehensive form matching backend Listing schema
   - Karnataka district presets (Mandya, Udupi, Belagavi, Sirsi, Karwar, etc.)
   - One-click browser GPS location detector
   - Interactive AI CNN Quality Assessment simulator (evaluates purity, moisture & confidence)

6. requests.html (Circular Order Tracking):
   - Lifecycle tracker: Pending -> Accepted -> In Transit -> Completed
   - Filter tabs by status and keyword search
   - Interactive action buttons (Accept, Reject, Mark In-Transit, Complete)
   - Printable exchange receipt / transport gate pass generator

7. impact.html (Carbon Accounting & Environmental Metrics):
   - High-level metric counters (CO2e avoided, farmer revenue generated)
   - Interactive Stubble Burning & Carbon Offset Calculator with sliders
   - United Nations Sustainable Development Goals (SDG 12, SDG 13, SDG 8, SDG 15) alignment


RUNNING THE PROJECT:
1. Open the "AgriCycle-Multipage" folder in VS Code.
2. Right-click index.html -> "Open with Live Server".
3. The Sign In page will open FIRST!
   - You can test with 1-click demo login, or click "Explore Platform as Guest ↗" to browse directly.
================================================================================
