import { calculateHaversineDistance, extractCoordinates } from './haversine.js';

/**
 * =====================================================
 * AgriCycle — Matching & Scoring Algorithm
 * Author: Shreya (4CB24CS141)
 * Scope : Matching Algorithms & Geospatial Proximity
 * =====================================================
 *
 * Computes a weighted relevance score for each listing
 * relative to a utilizer's preferences, then returns
 * listings ranked from best match to worst.
 *
 * Scoring Factors & Default Weights:
 *   Distance   (closer  = better)   →  0.35
 *   Price      (cheaper = better)   →  0.25
 *   Quantity   (fits need = better) →  0.20
 *   Quality    (higher  = better)   →  0.10
 *   Freshness  (newer   = better)   →  0.10
 */

// ───────── Quality grade mapping ─────────
export const QUALITY_SCORES = {
  'Grade A (High)': 1.0,
  'Grade B (Medium)': 0.7,
  'Grade C (Low)': 0.4,
  'Pending Assessment': 0.2,
};

// ───────── Scoring weights & presets ─────────
export const DEFAULT_WEIGHTS = {
  distance: 0.35,
  price: 0.25,
  quantity: 0.20,
  quality: 0.10,
  freshness: 0.10,
};

export const WEIGHT_PROFILES = {
  balanced: DEFAULT_WEIGHTS,
  proximity: { distance: 0.55, price: 0.15, quantity: 0.15, quality: 0.08, freshness: 0.07 },
  budget: { distance: 0.15, price: 0.50, quantity: 0.15, quality: 0.10, freshness: 0.10 },
  quality: { distance: 0.20, price: 0.15, quantity: 0.15, quality: 0.40, freshness: 0.10 },
};

// ───────── Individual score calculators ─────────

/**
 * Distance score using exponential decay.
 * Score = exp(-distance / referenceKm)
 *
 * At 0 km   → 1.0
 * At 50 km  → ~0.37  (with referenceKm=50)
 * At 100 km → ~0.14
 *
 * @param {number} distanceKm - actual distance in km
 * @param {number} referenceKm - decay reference (default 50 km)
 * @returns {number} score between 0 and 1
 */
export function calcDistanceScore(distanceKm, referenceKm = 50) {
  const dist = Number(distanceKm);
  const ref = Number(referenceKm) || 50;
  if (isNaN(dist) || dist <= 0) return 1.0;
  return Math.min(1.0, Math.max(0.0, Math.exp(-dist / ref)));
}

/**
 * Price score — free listings get 1.0, otherwise linear decay.
 * Score = max(0, 1 - pricePerKg / maxReasonablePrice)
 *
 * @param {number} pricePerKg
 * @param {number} maxReasonablePrice - upper bound for normalization (default ₹20/kg)
 * @returns {number} score between 0 and 1
 */
export function calcPriceScore(pricePerKg, maxReasonablePrice = 20) {
  const price = Number(pricePerKg);
  const maxPrice = Number(maxReasonablePrice) || 20;
  if (isNaN(price) || price <= 0) return 1.0;
  return Math.min(1.0, Math.max(0.0, 1 - price / maxPrice));
}

/**
 * Quantity fit score — how well the available quantity meets the need.
 *
 * If available >= needed → 1.0 (full match)
 * If available < needed  → available / needed (partial match)
 * If no quantity preference given → 0.8 (neutral)
 *
 * @param {number} availableKg
 * @param {number|null} neededKg
 * @returns {number} score between 0 and 1
 */
export function calcQuantityScore(availableKg, neededKg = null) {
  const avail = Number(availableKg);
  const needed = Number(neededKg);

  if (isNaN(needed) || needed <= 0) return 0.8; // no preference → neutral
  if (isNaN(avail) || avail <= 0) return 0.0;   // out of stock → 0
  if (avail >= needed) return 1.0;
  return Math.min(1.0, Math.max(0.0, avail / needed));
}

/**
 * Quality grade score from predefined mapping.
 *
 * @param {string} grade
 * @returns {number} score between 0 and 1
 */
export function calcQualityScore(grade) {
  if (!grade || typeof grade !== 'string') return 0.2;
  return QUALITY_SCORES[grade] || 0.2;
}

/**
 * Freshness score — exponential decay over days since creation.
 *
 * Within 1 day → ~1.0
 * 7 days old   → ~0.5
 * 30 days old  → ~0.05
 *
 * @param {Date|string} createdAt
 * @param {number} halfLifeDays - days for score to halve (default 7)
 * @returns {number} score between 0 and 1
 */
export function calcFreshnessScore(createdAt, halfLifeDays = 7) {
  if (!createdAt) return 0.8;
  const time = new Date(createdAt).getTime();
  if (isNaN(time)) return 0.8;

  const ageMs = Date.now() - time;
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  if (ageDays <= 0) return 1.0;

  const halfLife = Number(halfLifeDays) || 7;
  return Math.min(1.0, Math.max(0.0, Math.pow(0.5, ageDays / halfLife)));
}

// ───────── Composite scoring function ─────────

/**
 * Computes a composite match score for a single listing.
 *
 * @param {Object} listing       - listing document (plain or lean object)
 * @param {Object} preferences   - utilizer's search preferences
 * @param {number} preferences.lat           - user latitude
 * @param {number} preferences.lng           - user longitude
 * @param {number} [preferences.neededKg]    - desired quantity in kg
 * @param {number} [preferences.maxPricePerKg] - max acceptable ₹/kg
 * @param {string} [preferences.preferredWasteType] - preferred waste type
 * @param {Object} [weights]     - custom weights (overrides defaults)
 * @returns {Object} { ...listing, matchScore, scoreBreakdown, distanceKm }
 */
export function computeMatchScore(listing, preferences = {}, weights = DEFAULT_WEIGHTS) {
  if (!listing || typeof listing !== 'object') {
    return {
      matchScore: 0,
      distanceKm: null,
      scoreBreakdown: { distance: 0, price: 0, quantity: 0, quality: 0, freshness: 0 },
    };
  }

  const { lat, lng, neededKg, maxPricePerKg, preferredWasteType } = preferences;

  // 1. Distance Calculation (supports GeoJSON & direct lat/lng)
  let distanceKm = null;
  let distanceScore = 0.5; // Neutral fallback if coordinates are missing

  if (lat !== undefined && lng !== undefined) {
    const coords = extractCoordinates(listing.location);
    if (coords) {
      try {
        distanceKm = calculateHaversineDistance(lat, lng, coords.lat, coords.lng);
        distanceScore = calcDistanceScore(distanceKm);
      } catch {
        distanceKm = null;
        distanceScore = 0.5;
      }
    }
  }

  // 2. Price Score
  const price = listing.pricePerKg !== undefined
    ? Number(listing.pricePerKg)
    : (Number(listing.price) || 0);
  const maxPrice = maxPricePerKg ? Number(maxPricePerKg) : 20;
  const priceScore = calcPriceScore(price, maxPrice);

  // 3. Quantity Fit Score
  const availQty = listing.availableQuantityKg !== undefined
    ? Number(listing.availableQuantityKg)
    : (Number(listing.quantityKg || listing.quantity) || 0);
  const quantityScore = calcQuantityScore(availQty, neededKg);

  // 4. Quality Grade Score
  const qualityScore = calcQualityScore(listing.qualityGrade);

  // 5. Freshness Score
  const freshnessScore = calcFreshnessScore(listing.createdAt);

  // Active weights resolution
  const activeWeights = {
    distance: weights.distance !== undefined ? Number(weights.distance) : DEFAULT_WEIGHTS.distance,
    price: weights.price !== undefined ? Number(weights.price) : DEFAULT_WEIGHTS.price,
    quantity: weights.quantity !== undefined ? Number(weights.quantity) : DEFAULT_WEIGHTS.quantity,
    quality: weights.quality !== undefined ? Number(weights.quality) : DEFAULT_WEIGHTS.quality,
    freshness: weights.freshness !== undefined ? Number(weights.freshness) : DEFAULT_WEIGHTS.freshness,
  };

  // Weighted composite sum
  let matchScore =
    activeWeights.distance * distanceScore +
    activeWeights.price * priceScore +
    activeWeights.quantity * quantityScore +
    activeWeights.quality * qualityScore +
    activeWeights.freshness * freshnessScore;

  // Bonus: +10% boost if waste type exactly matches preference
  const itemWasteType = (listing.wasteType || listing.name || '').trim().toLowerCase();
  if (preferredWasteType && itemWasteType === preferredWasteType.trim().toLowerCase()) {
    matchScore = Math.min(1.0, matchScore * 1.10);
  }

  // Hard penalty: if price exceeds user's stated maximum budget, apply a 50% penalty
  if (maxPricePerKg && price > Number(maxPricePerKg)) {
    matchScore *= 0.5;
  }

  // Ensure score is bounded strictly between 0 and 1, rounded to 4 decimals
  const finalScore = Number(Math.min(1.0, Math.max(0.0, matchScore)).toFixed(4));

  return {
    ...listing,
    distanceKm,
    matchScore: finalScore,
    scoreBreakdown: {
      distance: Number(distanceScore.toFixed(4)),
      price: Number(priceScore.toFixed(4)),
      quantity: Number(quantityScore.toFixed(4)),
      quality: Number(qualityScore.toFixed(4)),
      freshness: Number(freshnessScore.toFixed(4)),
    },
  };
}

/**
 * Scores and ranks an array of listings against user preferences.
 *
 * @param {Array} listings      - array of listing documents
 * @param {Object} preferences  - utilizer's search preferences
 * @param {Object} [weights]    - custom scoring weights
 * @returns {Array} listings sorted by matchScore descending
 */
export function rankListings(listings, preferences = {}, weights = DEFAULT_WEIGHTS) {
  if (!Array.isArray(listings)) return [];

  return listings
    .map((listing) => computeMatchScore(listing, preferences, weights))
    .sort((a, b) => {
      const scoreA = Number(a.matchScore) || 0;
      const scoreB = Number(b.matchScore) || 0;
      return scoreB - scoreA;
    });
}

export default {
  computeMatchScore,
  rankListings,
  calcDistanceScore,
  calcPriceScore,
  calcQuantityScore,
  calcQualityScore,
  calcFreshnessScore,
  DEFAULT_WEIGHTS,
  WEIGHT_PROFILES,
  QUALITY_SCORES,
};
