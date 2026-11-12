import React, { useState, useEffect } from 'react';
import { MOCK_LISTINGS } from './mockData.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [role, setRole] = useState('farmer'); // 'farmer' | 'utilizer'
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('agricycle_listings');
    return saved ? JSON.parse(saved) : MOCK_LISTINGS;
  });
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('agricycle_requests');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('agricycle_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('agricycle_requests', JSON.stringify(requests));
  }, [requests]);

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <header style={{
        height: '75px',
        padding: '0 5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        borderBottom: '1px solid var(--line)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, fontSize: '22px', color: 'var(--forest)' }}>
          <span style={{ background: 'var(--lime)', borderRadius: '50%', width: '36px', height: '36px', display: 'grid', placeItems: 'center' }}>↻</span>
          <span>Agri<span style={{ color: 'var(--green-bright)' }}>Cycle</span></span>
        </div>

        <nav style={{ display: 'flex', gap: '18px' }}>
          {['home', 'browse', 'list', 'requests', 'dashboard', 'impact'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'var(--lime-soft)' : 'transparent',
                border: 0,
                color: activeTab === tab ? 'var(--green)' : 'var(--muted)',
                fontWeight: 700,
                fontSize: '13px',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'list' ? 'List Waste' : tab}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setRole(r => r === 'farmer' ? 'utilizer' : 'farmer')}
            className="btn btn-outline"
            style={{ fontSize: '11px', padding: '6px 12px' }}
          >
            {role === 'farmer' ? '🌾 Farmer View' : '🏭 Utilizer View'}
          </button>
          <button onClick={() => setActiveTab('list')} className="btn btn-green" style={{ fontSize: '11px', padding: '6px 14px' }}>
            + List Waste
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '30px 0' }}>
        <div className="container">
          {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} />}
          {activeTab === 'browse' && <BrowseView listings={listings} setRequests={setRequests} />}
          {activeTab === 'list' && <ListWasteView setListings={setListings} setActiveTab={setActiveTab} />}
          {activeTab === 'requests' && <RequestsView requests={requests} setRequests={setRequests} />}
          {activeTab === 'dashboard' && <DashboardView listings={listings} requests={requests} role={role} />}
          {activeTab === 'impact' && <ImpactView />}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '24px 5%', background: '#fff', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)' }}>
        <span>AgriCycle React Client — Circular Biomass Exchange</span>
        <span>Team CEC/CSE/2026-27/P-44</span>
      </footer>
    </div>
  );
}

// ----------------- Sub-Views -----------------
function HomeView({ setActiveTab }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>Turn agricultural waste into <em style={{ color: 'var(--green-bright)', fontStyle: 'normal' }}>real worth.</em></h1>
      <p style={{ maxWidth: '600px', margin: '0 auto 30px', color: 'var(--muted)', fontSize: '16px' }}>
        A location-aware circular web platform connecting Karnataka crop residue generators with bio-industries, mushroom cultivators, and composting units.
      </p>
      <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
        <button onClick={() => setActiveTab('browse')} className="btn btn-green">Explore Biomass Marketplace ↗</button>
        <button onClick={() => setActiveTab('dashboard')} className="btn btn-outline">Open Live Dashboard 📊</button>
      </div>
    </div>
  );
}

function BrowseView({ listings, setRequests }) {
  const [search, setSearch] = useState('');
  const filtered = listings.filter(l => (l.wasteType || l.name || '').toLowerCase().includes(search.toLowerCase()));

  const handleRequest = (item) => {
    const newReq = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      material: item.wasteType || item.name,
      quantity: 200,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    setRequests(prev => [newReq, ...prev]);
    alert(`Created request for ${item.wasteType || item.name}!`);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '14px' }}>Browse Waste Materials</h2>
      <input
        type="text"
        placeholder="Filter by crop residue (e.g. Paddy Straw, Coconut Husk)..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)', marginBottom: '24px' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filtered.map((item, idx) => (
          <div key={item.id || idx} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '16px', padding: '18px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>🌾 {item.wasteType || item.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>
              Quantity: <b>{item.quantityKg || item.quantity} kg</b> • {item.location?.address || item.location || 'Karnataka'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>₹{item.pricePerKg || item.price || 0}/kg</strong>
              <button onClick={() => handleRequest(item)} className="btn btn-green" style={{ fontSize: '11px', padding: '6px 12px' }}>Request ↗</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListWasteView({ setListings, setActiveTab }) {
  const [title, setTitle] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [loc, setLoc] = useState('Mandya, Karnataka');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: `lst_${Date.now()}`,
      wasteType: title,
      quantityKg: Number(qty),
      pricePerKg: Number(price),
      location: { address: loc }
    };
    setListings(prev => [newItem, ...prev]);
    alert('Listing created successfully!');
    setActiveTab('browse');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid var(--line)' }}>
      <h2 style={{ marginBottom: '18px' }}>List Crop Waste</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <input placeholder="Residue Name (e.g. Paddy Straw)" value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }} />
        <input type="number" placeholder="Quantity (kg)" value={qty} onChange={e => setQty(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }} />
        <input type="number" placeholder="Price per kg (₹)" value={price} onChange={e => setPrice(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }} />
        <input placeholder="Location" value={loc} onChange={e => setLoc(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }} />
        <button type="submit" className="btn btn-green" style={{ padding: '12px' }}>Publish Listing ↗</button>
      </form>
    </div>
  );
}

function RequestsView({ requests, setRequests }) {
  return (
    <div>
      <h2 style={{ marginBottom: '18px' }}>Exchange Requests Tracking</h2>
      {requests.length === 0 ? (
        <p className="muted">No requests placed yet. Go to Browse to send a request!</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--line)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--lime-soft)' }}>
                <th style={{ padding: '12px 16px' }}>Request ID</th>
                <th style={{ padding: '12px 16px' }}>Material</th>
                <th style={{ padding: '12px 16px' }}>Quantity</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '12px 16px' }}><b>{r.id}</b></td>
                  <td style={{ padding: '12px 16px' }}>{r.material}</td>
                  <td style={{ padding: '12px 16px' }}>{r.quantity} kg</td>
                  <td style={{ padding: '12px 16px' }}><span className="pill">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DashboardView({ listings, requests, role }) {
  const totalKg = listings.reduce((sum, l) => sum + (Number(l.quantityKg || l.quantity) || 0), 0);
  return (
    <div>
      <h2 style={{ marginBottom: '18px' }}>{role === 'farmer' ? '🌾 Farmer Analytics Dashboard' : '🏭 Utilizer Dashboard'}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--forest)' }}>{totalKg.toLocaleString()} kg</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Total Biomass Registered</div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--forest)' }}>{listings.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Active Listings</div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--forest)' }}>{requests.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Exchange Transactions</div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--forest)' }}>{Math.round(totalKg * 1.45)} kg</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Estimated CO₂e Saved</div>
        </div>
      </div>
    </div>
  );
}

function ImpactView() {
  const [kg, setKg] = useState(5000);
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid var(--line)' }}>
      <h2>Stubble Burning & Carbon Calculator</h2>
      <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '10px 0 20px' }}>
        Estimate greenhouse emissions avoided by recycling agricultural residues instead of open-field burning.
      </p>
      <input type="range" min="500" max="50000" step="500" value={kg} onChange={e => setKg(Number(e.target.value))} style={{ width: '100%', marginBottom: '20px' }} />
      <div style={{ background: 'var(--forest)', color: '#fff', padding: '24px', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--lime)' }}>{Math.round(kg * 1.45).toLocaleString()} kg</div>
          <div style={{ fontSize: '11px', color: '#cbd8cf' }}>CO₂ Emissions Prevented</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--lime)' }}>{(kg * 0.008).toFixed(1)} kg</div>
          <div style={{ fontSize: '11px', color: '#cbd8cf' }}>Toxic PM2.5 Smog Averted</div>
        </div>
      </div>
    </div>
  );
}
