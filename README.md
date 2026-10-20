# AgriCycle 🌾♻️
> **Turning Agricultural Waste into Valuable Resources**

AgriCycle is a location-aware web exchange connecting agricultural waste generators (farmers) with waste utilizers (industries, mushroom growers, composting units). The platform leverages proximity-based matching, deep learning verification, and conversational AI guidance to promote a sustainable circular economy.

---

## 👥 Project Team (CEC/CSE/2026-27/ P-44)
* **Thanush (4CB24CS164)** — Backend Architecture, Database, Authentication (Lead)
* **Shreya (4CB24CS141)** — Matching Algorithms & Geospatial Proximity (Haversine)
* **Samarth (4CB24CS126)** — AI Chatbot & CNN Image Verification
* **Tanisha (4CB24CS160)** — Frontend UI/UX & Responsive Dashboards 
* **Faculty Guide:** Ms. Verdine Saviola Noronha

---

## 🛠️ Technology Stack
* **Frontend:** React.js, Tailwind CSS / Vanilla CSS, Leaflet (Maps)
* **Backend:** Node.js, Express.js, JWT (Authentication)
* **Database & Cloud:** MongoDB (Mongoose), Cloudinary (Image storage)
* **AI & Algorithms:** Python, TensorFlow / PyTorch (CNN Quality Verification), Haversine Formula

---

## 📂 Project Architecture
```text
agricycle/
├── client/          # React Frontend application
├── server/          # Node.js + Express REST API
└── ai-service/      # Python AI services (CNN + Chatbot)
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js (v18+)](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/) (Atlas or local instance)
* [Python (v3.10+)](https://www.python.org/)

### 1. Setup Backend (`server`)
```bash
cd server
npm install
cp .env.example .env   # Configure your MONGO_URI and JWT_SECRET
npm run dev
```

### 2. Setup Frontend (`client`)
```bash
cd client
npm install
npm run dev
```

---

## 🌿 Contribution & Git Guidelines
1. **Never commit directly to `main`**.
2. Create a feature branch for your work: `git checkout -b feature/<feature-name>`.
3. Open a Pull Request on GitHub and request review before merging.
4. Keep `.env` files untracked.
