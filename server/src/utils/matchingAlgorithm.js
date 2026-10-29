import { calculateHaversineDistance } from './haversine.js';

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
 *   Distance   (closer  = better)  →  0.35
 *   Price      (cheaper = better)  →  0.25
 *   Quantity   (fits need = better) → 0.20
 *   Quality    (higher  = better)  →  0.10
 *   Freshness  (newer   = better)  →  0.10
 */

// ───────── Quality grade mapping ─────────
const QUALITY_SCORES = {
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
 * At 0 km  → 1.0
 * At 50 km → ~0.37  (with referenceKm=50)
 * At 100 km → ~0.14
 *
 * @param {number} distanceKm - actual distance in km
 * @param {number} referenceKm - decay reference (default 50 km)
 * @returns {number} score between 0 and 1
 */
export function calcDistanceScore(distanceKm, referenceKm = 50) {
  if (distanceKm <= 0) return 1.0;
  return Math.exp(-distanceKm / referenceKm);
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
  if (pricePerKg <= 0) return 1.0;
  return Math.max(0, 1 - pricePerKg / maxReasonablePrice);
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
  if (!neededKg || neededKg <= 0) return 0.8; // no preference → neutral
  if (availableKg >= neededKg) return 1.0;
  return availableKg / neededKg;
}

/**
 * Quality grade score from predefined mapping.
 *
 * @param {string} grade
 * @returns {number} score between 0 and 1
 */
export function calcQualityScore(grade) {
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
  const ageMs = Date.now() - new Date(createdAt).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  if (ageDays <= 0) return 1.0;
  return Math.pow(0.5, ageDays / halfLifeDays);
}

// ───────── Composite scoring function ─────────

/**
 * Computes a composite match score for a single listing.
 *
 * @param {Object} listing       - listing document (lean object)
 * @param {Object} preferences   - utilizer's search preferences
 * @param {number} preferences.lat           - user latitude
 * @param {number} preferences.lng           - user longitude
 * @param {number} [preferences.neededKg]    - desired quantity in kg
 * @param {number} [preferences.maxPricePerKg] - max acceptable ₹/kg
 * @param {string} [preferences.preferredWasteType] - preferred waste type
 * @param {Object} [weights]     - custom weights (overrides defaults)
 * @returns {Object} { ...listing, matchScore, scoreBreakdown, distanceKm }
 */
export function computeMatchScore(listing, preferences, weights = DEFAULT_WEIGHTS) {
  const { lat, lng, neededKg, maxPricePerKg, preferredWasteType } = preferences;

  // 1. Distance
  const itemLng = listing.location.coordinates[0];
  const itemLat = listing.location.coordinates[1];
  const distanceKm = calculateHaversineDistance(lat, lng, itemLat, itemLng);
  const distanceScore = calcDistanceScore(distanceKm);

  // 2. Price
  const priceScore = calcPriceScore(listing.pricePerKg, maxPricePerKg || 20);

  // 3. Quantity fit
  const quantityScore = calcQuantityScore(listing.availableQuantityKg, neededKg);

  // 4. Quality
  const qualityScore = calcQualityScore(listing.qualityGrade);

  // 5. Freshness
  const freshnessScore = calcFreshnessScore(listing.createdAt);

  // Weighted composite
  let matchScore =
    weights.distance * distanceScore +
    weights.price * priceScore +
    weights.quantity * quantityScore +
    weights.quality * qualityScore +
    weights.freshness * freshnessScore;

  // Bonus: +10% if waste type matches preference exactly
  if (preferredWasteType && listing.wasteType === preferredWasteType) {
    matchScore = Math.min(1.0, matchScore * 1.10);
  }

  // Hard penalty: if price exceeds user's max, halve the score
  if (maxPricePerKg && listing.pricePerKg > maxPricePerKg) {
    matchScore *= 0.5;
  }

  return {
    ...listing,
    distanceKm,
    matchScore: Number(matchScore.toFixed(4)),
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
 * @param {Array} listings      - array of listing documents (lean objects)
 * @param {Object} preferences  - utilizer's search preferences (see computeMatchScore)
 * @param {Object} [weights]    - custom scoring weights
 * @returns {Array} listings sorted by matchScore descending
 */
export function rankListings(listings, preferences, weights = DEFAULT_WEIGHTS) {
  return listings
    .map((listing) => computeMatchScore(listing, preferences, weights))
    .sort((a, b) => b.matchScore - a.matchScore);
}
