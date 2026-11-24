/**
 * =====================================================================
 * AgriCycle — Geospatial Proximity Utility (Haversine Formula)
 * Author: Shreya (4CB24CS141)
 * Scope : Matching Algorithms & Geospatial Proximity
 * =====================================================================
 */

// Mean Earth radius in kilometers (IUGG recommended value)
export const EARTH_RADIUS_KM = 6371.0;

/**
 * Converts degrees to radians.
 *
 * @param {number} degrees
 * @returns {number} radians
 */
export function degreesToRadians(degrees) {
  return (Number(degrees) * Math.PI) / 180;
}

/**
 * Validates geographic latitude and longitude coordinates.
 * Accepts numbers or valid numeric strings.
 * - Latitude must be a finite number between -90 and +90 degrees.
 * - Longitude must be a finite number between -180 and +180 degrees.
 *
 * @param {number|string} lat - Latitude
 * @param {number|string} lng - Longitude
 * @returns {boolean} true if valid
 */
export function isValidCoordinates(lat, lng) {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return false;
  }
  const nLat = Number(lat);
  const nLng = Number(lng);

  if (isNaN(nLat) || isNaN(nLng) || !Number.isFinite(nLat) || !Number.isFinite(nLng)) {
    return false;
  }
  if (nLat < -90 || nLat > 90) return false;
  if (nLng < -180 || nLng > 180) return false;
  return true;
}

/**
 * Extracts normalized { lat, lng } from different location formats:
 * - GeoJSON Point: { type: 'Point', coordinates: [lng, lat] }
 * - Object format: { lat, lng } or { latitude, longitude }
 *
 * @param {Object} location
 * @returns {{ lat: number, lng: number }|null}
 */
export function extractCoordinates(location) {
  if (!location) return null;

  // 1. GeoJSON Point format: coordinates: [longitude, latitude]
  if (Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
    const lng = Number(location.coordinates[0]);
    const lat = Number(location.coordinates[1]);
    if (isValidCoordinates(lat, lng)) {
      return { lat, lng };
    }
  }

  // 2. Direct lat / lng properties
  const latVal = location.lat !== undefined ? location.lat : location.latitude;
  const lngVal = location.lng !== undefined ? location.lng : location.longitude;
  if (latVal !== undefined && lngVal !== undefined) {
    const lat = Number(latVal);
    const lng = Number(lngVal);
    if (isValidCoordinates(lat, lng)) {
      return { lat, lng };
    }
  }

  return null;
}

/**
 * Calculates the great-circle distance between two geographic points
 * on the surface of a sphere using the Haversine formula.
 *
 * Formula:
 *   a = sin²(Δφ/2) + cos(φ1) · cos(φ2) · sin²(Δλ/2)
 *   c = 2 · atan2(√a, √(1−a))
 *   d = R · c
 *
 * Where:
 *   φ is latitude, λ is longitude, R is Earth's mean radius (6371 km).
 *
 * @param {number|string} lat1 - Latitude of Point 1 in decimal degrees
 * @param {number|string} lon1 - Longitude of Point 1 in decimal degrees
 * @param {number|string} lat2 - Latitude of Point 2 in decimal degrees
 * @param {number|string} lon2 - Longitude of Point 2 in decimal degrees
 * @returns {number} Distance in kilometers, rounded to 2 decimal places
 * @throws {Error} If any coordinate is invalid or non-numeric
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const nLat1 = Number(lat1);
  const nLon1 = Number(lon1);
  const nLat2 = Number(lat2);
  const nLon2 = Number(lon2);

  if (!isValidCoordinates(nLat1, nLon1) || !isValidCoordinates(nLat2, nLon2)) {
    throw new Error(
      `Invalid coordinates provided to calculateHaversineDistance: [${lat1}, ${lon1}], [${lat2}, ${lon2}]`
    );
  }

  // Exact same point shortcut
  if (nLat1 === nLat2 && nLon1 === nLon2) {
    return 0.0;
  }

  const phi1 = degreesToRadians(nLat1);
  const phi2 = degreesToRadians(nLat2);
  const deltaPhi = degreesToRadians(nLat2 - nLat1);
  const deltaLambda = degreesToRadians(nLon2 - nLon1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  // Guard against slight floating-point precision overflow
  const clampedA = Math.min(1.0, Math.max(0.0, a));
  const c = 2 * Math.atan2(Math.sqrt(clampedA), Math.sqrt(1 - clampedA));
  const distance = EARTH_RADIUS_KM * c;

  return Number(distance.toFixed(2));
}

/**
 * Calculates a bounding box [minLat, minLng, maxLat, maxLng] given a center
 * point and a search radius in kilometers.
 * Useful for fast coarse pre-filtering before fine Haversine calculation.
 *
 * @param {number|string} lat - Center latitude
 * @param {number|string} lng - Center longitude
 * @param {number|string} radiusKm - Search radius in km
 * @returns {{ minLat: number, maxLat: number, minLng: number, maxLng: number }}
 */
export function calculateBoundingBox(lat, lng, radiusKm) {
  const nLat = Number(lat);
  const nLng = Number(lng);
  const nRadius = Number(radiusKm);

  if (!isValidCoordinates(nLat, nLng) || isNaN(nRadius) || nRadius <= 0) {
    throw new Error('Invalid arguments to calculateBoundingBox');
  }

  // 1 degree latitude is approximately 111.045 km
  const deltaLat = nRadius / 111.045;
  // 1 degree longitude depends on latitude (cosine scaling)
  const cosLat = Math.cos(degreesToRadians(nLat));
  const deltaLng = cosLat === 0 ? 180 : nRadius / (111.045 * Math.abs(cosLat));

  return {
    minLat: Math.max(-90, Number((nLat - deltaLat).toFixed(6))),
    maxLat: Math.min(90, Number((nLat + deltaLat).toFixed(6))),
    minLng: Math.max(-180, Number((nLng - deltaLng).toFixed(6))),
    maxLng: Math.min(180, Number((nLng + deltaLng).toFixed(6))),
  };
}

/**
 * Formats a distance in kilometers into a human-readable string.
 * e.g., 0.45 km -> "450 m", 12.34 km -> "12.3 km"
 *
 * @param {number} distanceKm
 * @returns {string} Formatted distance
 */
export function formatDistance(distanceKm) {
  const dist = Number(distanceKm);
  if (isNaN(dist) || dist < 0) {
    return '0 m';
  }
  if (dist < 1) {
    return `${Math.round(dist * 1000)} m`;
  }
  return `${dist.toFixed(1)} km`;
}

export default {
  calculateHaversineDistance,
  isValidCoordinates,
  extractCoordinates,
  calculateBoundingBox,
  degreesToRadians,
  formatDistance,
  EARTH_RADIUS_KM,
};
