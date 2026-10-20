/**
 * Mock listings for frontend development without waiting for live backend.
 */
export const MOCK_LISTINGS = [
  {
    id: 'lst_001',
    wasteType: 'Paddy Straw',
    quantityKg: 1200,
    pricePerKg: 1.5,
    location: {
      address: 'Mandya, Karnataka',
      lat: 12.5242,
      lng: 76.8958,
    },
    farmerName: 'Ramesh Gowda',
    contact: '+91 98765 43210',
    availableUntil: '2026-11-15',
    verified: true,
  },
  {
    id: 'lst_002',
    wasteType: 'Coconut Husk',
    quantityKg: 800,
    pricePerKg: 0, // Free exchange
    location: {
      address: 'Udupi, Karnataka',
      lat: 13.3409,
      lng: 74.7421,
    },
    farmerName: 'Suresh Shetty',
    contact: '+91 91234 56789',
    availableUntil: '2026-11-20',
    verified: false,
  },
  {
    id: 'lst_003',
    wasteType: 'Sugarcane Bagasse',
    quantityKg: 3500,
    pricePerKg: 2.0,
    location: {
      address: 'Belagavi, Karnataka',
      lat: 15.8497,
      lng: 74.4977,
    },
    farmerName: 'Anand Patil',
    contact: '+91 94481 23456',
    availableUntil: '2026-11-30',
    verified: true,
  },
];
