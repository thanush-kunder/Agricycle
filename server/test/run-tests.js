/**
 * Automated Test Suite for AgriCycle Backend
 * Tests:
 * 1. Health check & Express route registration
 * 2. Haversine geospatial proximity & coordinate validation (Member 2)
 * 3. Multi-criteria matching & ranking algorithm (Member 2)
 * 4. Image upload validation & Multer configuration (Member 4)
 * 5. AI integration & agricultural advisory engine (Member 4)
 *
 * Author: Samarth (Member 4 - AI + Images + Testing)
 */

import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Set test environment
process.env.NODE_ENV = 'test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import application and modules
import app from '../src/server.js';
import { calculateHaversineDistance, isValidCoordinates } from '../src/utils/haversine.js';
import {
  calcDistanceScore,
  calcPriceScore,
  calcQuantityScore,
  calcQualityScore,
  calcFreshnessScore,
  computeMatchScore,
  rankListings,
} from '../src/utils/matchingAlgorithm.js';

let passed = 0;
let failed = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

async function itAsync(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

/**
 * Lightweight in-memory HTTP dispatcher for Express
 * Allows running complete end-to-end route tests without binding to a network port.
 */
function dispatch(appInstance, { method = 'GET', url = '/', headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    let statusCode = 200;
    const resHeaders = {};
    let buffer = '';

    const payload = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;

    const req = new Readable({
      read() {
        if (payload) {
          this.push(Buffer.from(payload));
        }
        this.push(null);
      },
    });

    req.method = method;
    req.url = url;
    req.originalUrl = url;
    req.headers = {
      'content-type': 'application/json',
      ...headers,
    };
    if (payload) {
      req.headers['content-length'] = Buffer.byteLength(payload).toString();
    }

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      setHeader(k, v) {
        resHeaders[k.toLowerCase()] = v;
      },
      getHeader(k) {
        return resHeaders[k.toLowerCase()];
      },
      json(obj) {
        resolve({ status: statusCode, data: obj, headers: resHeaders });
      },
      send(data) {
        try {
          resolve({ status: statusCode, data: JSON.parse(data), headers: resHeaders });
        } catch {
          resolve({ status: statusCode, raw: data, headers: resHeaders });
        }
      },
      end(chunk) {
        if (chunk) buffer += chunk;
        try {
          resolve({ status: statusCode, data: JSON.parse(buffer), headers: resHeaders });
        } catch {
          resolve({ status: statusCode, raw: buffer, headers: resHeaders });
        }
      },
    };

    try {
      appInstance(req, res);
    } catch (e) {
      reject(e);
    }
  });
}

console.log('\n=============================================');
console.log('🧪 Running AgriCycle Test Suite');
console.log('=============================================\n');

// ── 1. Geospatial & Haversine Distance Tests ──
console.log('📐 [1/5] Testing Haversine Proximity & Coordinate Validation:');

it('should correctly calculate distance between Bangalore and Mangalore (~300-360 km)', () => {
  const dist = calculateHaversineDistance(12.9716, 77.5946, 12.9141, 74.856);
  assert.ok(dist >= 290 && dist <= 360, `Distance was ${dist} km, expected ~300-360 km`);
});

it('should return 0 km for identical coordinates', () => {
  const dist = calculateHaversineDistance(13.0827, 80.2707, 13.0827, 80.2707);
  assert.equal(dist, 0);
});

it('should validate geographical coordinates within bounds', () => {
  assert.equal(isValidCoordinates(12.9716, 77.5946), true);
  assert.equal(isValidCoordinates(91, 77.5946), false); // Lat > 90
  assert.equal(isValidCoordinates(-91, 77.5946), false); // Lat < -90
  assert.equal(isValidCoordinates(12.9716, 185), false); // Lng > 180
  assert.equal(isValidCoordinates('invalid', 77.5946), false);
});

// ── 2. Matching Algorithm Tests ──
console.log('\n🎯 [2/5] Testing Multi-Criteria Matching Algorithm:');

it('should score distance using exponential decay: 0 km -> 1.0, closer is higher', () => {
  assert.equal(calcDistanceScore(0, 50), 1.0);
  const score50 = calcDistanceScore(50, 50);
  const score100 = calcDistanceScore(100, 50);
  assert.ok(score50 > score100, 'Closer distance must produce higher score');
  assert.ok(score50 > 0.35 && score50 < 0.40, '50km decay should be approx 1/e (~0.37)');
});

it('should score prices appropriately (cheaper = higher score)', () => {
  assert.equal(calcPriceScore(0), 1.0); // Free = max score
  const scoreLow = calcPriceScore(5, 20);
  const scoreHigh = calcPriceScore(15, 20);
  assert.ok(scoreLow > scoreHigh, 'Lower price should have higher score');
});

it('should map quality grades according to standard hierarchy', () => {
  assert.equal(calcQualityScore('Grade A (High)'), 1.0);
  assert.equal(calcQualityScore('Grade B (Medium)'), 0.7);
  assert.equal(calcQualityScore('Grade C (Low)'), 0.4);
  assert.equal(calcQualityScore('Pending Assessment'), 0.2);
});

it('should compute composite match score and rank listings accurately', () => {
  const userPref = {
    lat: 12.9716,
    lng: 77.5946,
    neededKg: 1000,
    maxPricePerKg: 5,
    preferredWasteType: 'Paddy Straw',
  };

  const listings = [
    {
      _id: '1',
      title: 'Distant Straw',
      wasteType: 'Paddy Straw',
      pricePerKg: 2,
      availableQuantityKg: 1000,
      qualityGrade: 'Grade A (High)',
      location: { coordinates: [75.0, 13.0] }, // far
      createdAt: new Date(),
    },
    {
      _id: '2',
      title: 'Nearby Straw',
      wasteType: 'Paddy Straw',
      pricePerKg: 2,
      availableQuantityKg: 1000,
      qualityGrade: 'Grade A (High)',
      location: { coordinates: [77.594, 12.971] }, // very close
      createdAt: new Date(),
    },
  ];

  const ranked = rankListings(listings, userPref);
  assert.equal(ranked.length, 2);
  assert.equal(ranked[0]._id, '2', 'Nearby listing must rank first');
  assert.ok(ranked[0].matchScore > ranked[1].matchScore);
});

// ── 3. Image Upload Middleware Tests ──
console.log('\n📸 [3/5] Testing Image Upload & Validation Infrastructure:');

it('should have uploads directory created on the filesystem', () => {
  const uploadDir = path.join(__dirname, '../uploads');
  assert.ok(fs.existsSync(uploadDir), 'Uploads directory must exist');
});

it('should ensure gitkeep file exists in uploads directory', () => {
  const gitkeepPath = path.join(__dirname, '../uploads/.gitkeep');
  assert.ok(fs.existsSync(gitkeepPath), '.gitkeep must be present');
});

// ── 4. Express Routes & Health Endpoint Tests ──
console.log('\n🌐 [4/5] Testing Express App & Health Endpoints:');

await itAsync('should return 200 OK from /api/health', async () => {
  const res = await dispatch(app, {
    url: '/api/health',
    method: 'GET',
  });
  assert.equal(res.status, 200);
  assert.equal(res.data.status, 'ok');
  assert.equal(res.data.service, 'AgriCycle Backend API');
});

await itAsync('should return 200 OK from /api/ai/health', async () => {
  const res = await dispatch(app, {
    url: '/api/ai/health',
    method: 'GET',
  });
  assert.equal(res.status, 200);
  assert.equal(res.data.success, true);
});

await itAsync('should reject empty message at /api/ai/chat with 400', async () => {
  const res = await dispatch(app, {
    url: '/api/ai/chat',
    method: 'POST',
    body: { message: '   ' },
  });
  assert.equal(res.status, 400);
  assert.equal(res.data.success, false);
});

await itAsync('should provide circular economy advisory from /api/ai/chat', async () => {
  const res = await dispatch(app, {
    url: '/api/ai/chat',
    method: 'POST',
    body: { message: 'What can I do with surplus paddy straw?' },
  });
  assert.equal(res.status, 200);
  assert.equal(res.data.success, true);
  assert.ok(res.data.reply.length > 20);
});

await itAsync('should return 404 JSON for unknown routes', async () => {
  const res = await dispatch(app, {
    url: '/api/unknown-endpoint-xyz',
    method: 'GET',
  });
  assert.equal(res.status, 404);
  assert.equal(res.data.success, false);
});

// ── 5. AI Service Specification Verification ──
console.log('\n🤖 [5/5] Testing AI Microservice Specification:');

it('should verify that AI service main.py and test_ai_service.py exist', () => {
  const mainPy = path.join(__dirname, '../../ai-service/main.py');
  const testPy = path.join(__dirname, '../../ai-service/test_ai_service.py');
  assert.ok(fs.existsSync(mainPy), 'ai-service/main.py must exist');
  assert.ok(fs.existsSync(testPy), 'ai-service/test_ai_service.py must exist');
});

// ── Summary ──
console.log('\n=============================================');
console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
console.log('=============================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All test suites passed successfully!\n');
  process.exit(0);
}
