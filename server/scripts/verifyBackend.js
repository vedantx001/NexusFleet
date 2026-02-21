/* eslint-disable no-console */

/**
 * Backend verification script for hackathon/demo readiness.
 *
 * Runs a safe, end-to-end smoke test against the running server.
 *
 * Usage:
 *   npm run verify:backend
 *
 * Environment:
 *   - VERIFY_BASE_URL (optional) e.g. http://localhost:5000
 *   - PORT (optional) if VERIFY_BASE_URL not set
 *   - MONGO_URI (optional) for direct DB ping verification
 */

const path = require('path');

// Load server env vars if present
try {
  // scripts/verifyBackend.js -> server/.env
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch {
  // dotenv is a dependency in this repo; this is just extra safety.
}

let fetchFn = globalThis.fetch;
if (typeof fetchFn !== 'function') {
  try {
    // Node <18 fallback if node-fetch is present (it is not in this repo by default)
    // eslint-disable-next-line global-require
    fetchFn = require('node-fetch');
  } catch {
    // handled below
  }
}

const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function color(text, c) {
  const code = COLORS[c];
  if (!code) return text;
  return `${code}${text}${COLORS.reset}`;
}

function okMark(text) {
  return `${color('✔', 'green')} ${text}`;
}

function failMark(text) {
  return `${color('✖', 'red')} ${text}`;
}

function warnMark(text) {
  return `${color('!', 'yellow')} ${text}`;
}

function heading(text) {
  console.log(`\n${color(text, 'bold')}`);
}

function toJsonSafely(value) {
  if (value === null || value === undefined) return String(value);
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function withTimeout(ms) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return { controller, timeout };
}

function normalizeBaseUrl(rawBaseUrl) {
  const b = String(rawBaseUrl || '').trim();
  if (!b) return null;
  return b.endsWith('/') ? b.slice(0, -1) : b;
}

function joinUrl(baseUrl, relativePath) {
  const base = normalizeBaseUrl(baseUrl);
  const rel = String(relativePath || '');
  if (!base) throw new Error('Base URL missing');
  if (!rel) return base;
  if (rel.startsWith('http://') || rel.startsWith('https://')) return rel;
  if (rel.startsWith('/')) return `${base}${rel}`;
  return `${base}/${rel}`;
}

async function requestJson(baseUrl, method, relativePath, { token, body, timeoutMs = 10000 } = {}) {
  if (typeof fetchFn !== 'function') {
    throw new Error(
      'Global fetch is not available in this Node version. Use Node 18+ or add node-fetch and rerun.',
    );
  }

  const url = joinUrl(baseUrl, relativePath);
  const headers = {
    Accept: 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const { controller, timeout } = withTimeout(timeoutMs);
  try {
    const res = await fetchFn(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await res.text();
    let json;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }

    return {
      ok: res.ok,
      status: res.status,
      url,
      json,
      text,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function isSendSuccessShape(json) {
  return json && typeof json === 'object' && typeof json.success === 'boolean' && typeof json.message === 'string';
}

function extractToken(json) {
  if (!json || typeof json !== 'object') return null;
  const token = json?.data?.token;
  if (typeof token === 'string' && token.length > 10) return token;
  return null;
}

function extractId(obj) {
  if (!obj || typeof obj !== 'object') return null;
  return obj._id || obj.id || null;
}

async function dbPing() {
  // Direct DB ping to validate Mongo connectivity independent of HTTP routes.
  // Uses the same env var name as the server.
  const mongoose = require('mongoose');

  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Template';

  const conn = mongoose.createConnection(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  const opened = new Promise((resolve, reject) => {
    conn.once('open', resolve);
    conn.once('error', reject);
  });

  try {
    await opened;
    // Ping admin db
    if (conn.db?.admin) {
      await conn.db.admin().ping();
    }
    return { ok: true, mongoUri };
  } catch (e) {
    return { ok: false, mongoUri, error: e };
  } finally {
    try {
      await conn.close();
    } catch {
      // ignore
    }
  }
}

async function main() {
  const startedAt = Date.now();

  const baseUrl =
    normalizeBaseUrl(process.env.VERIFY_BASE_URL) || `http://localhost:${process.env.PORT || 5000}`;

  const apiBase = `${baseUrl}/api`;

  const runId = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

  const created = {
    user: null,
    vehicleId: null,
    driverId: null,
    tripId: null,
    maintenanceId: null,
    fuelLogId: null,
  };

  const results = [];
  let token = null;

  async function runStep(label, fn, { critical = false, requiresToken = false } = {}) {
    if (requiresToken && !token) {
      const msg = 'Skipped (missing JWT token)';
      console.log(warnMark(`${label} — ${msg}`));
      results.push({ label, ok: false, skipped: true, message: msg });
      return;
    }

    try {
      await fn();
      console.log(okMark(`${label} Passed`));
      results.push({ label, ok: true });
    } catch (e) {
      const message = e?.message || String(e);
      console.log(failMark(`${label} Failed: ${message}`));
      results.push({ label, ok: false, message });
      if (critical) {
        throw new Error(`${label} critical failure: ${message}`);
      }
    }
  }

  heading('NexusFleet Backend Verification');
  console.log(`${color('Base URL:', 'dim')} ${baseUrl}`);
  console.log(`${color('API URL:', 'dim')}  ${apiBase}`);

  // STEP 1 — Server Health
  await runStep(
    'Step 1 — Server Health',
    async () => {
      const res = await requestJson(apiBase, 'GET', '/health');
      assert(res.ok, `HTTP ${res.status} from ${res.url}`);
      assert(res.json, `Non-JSON response: ${res.text?.slice(0, 200) || '(empty)'}`);
      assert(isSendSuccessShape(res.json), `Unexpected response shape: ${toJsonSafely(res.json)}`);
      assert(res.json.success === true, `success=false: ${res.json.message}`);
      assert(res.json?.data?.status === 'ok', `Expected data.status='ok', got ${toJsonSafely(res.json?.data)}`);
    },
    { critical: true },
  );

  // STEP 2 — Database Connection
  await runStep(
    'Step 2 — Database Connection',
    async () => {
      const ping = await dbPing();
      assert(ping.ok, `Mongo ping failed (${ping.mongoUri}): ${ping.error?.message || ping.error}`);
    },
    { critical: false },
  );

  // STEP 3 — Authentication
  await runStep(
    'Step 3 — Authentication',
    async () => {
      const email = `hackathon.qa+${runId}@example.com`;
      const password = `HackathonQA!${runId}`;

      const registerRes = await requestJson(apiBase, 'POST', '/auth/register', {
        body: {
          name: `Hackathon QA ${runId}`,
          email,
          password,
          role: 'MANAGER',
        },
      });

      assert(registerRes.ok, `Register HTTP ${registerRes.status}: ${registerRes.json?.message || registerRes.text}`);
      assert(registerRes.json?.success === true, `Register failed: ${toJsonSafely(registerRes.json)}`);

      const loginRes = await requestJson(apiBase, 'POST', '/auth/login', {
        body: { email, password },
      });

      assert(loginRes.ok, `Login HTTP ${loginRes.status}: ${loginRes.json?.message || loginRes.text}`);
      assert(loginRes.json?.success === true, `Login failed: ${toJsonSafely(loginRes.json)}`);

      token = extractToken(loginRes.json);
      assert(token, `JWT token missing from login response: ${toJsonSafely(loginRes.json)}`);

      created.user = { email };

      // Optional sanity check: /auth/me
      const meRes = await requestJson(apiBase, 'GET', '/auth/me', { token });
      assert(meRes.ok, `Me HTTP ${meRes.status}: ${meRes.json?.message || meRes.text}`);
      assert(meRes.json?.success === true, `Me failed: ${toJsonSafely(meRes.json)}`);
      assert(meRes.json?.data?.user?.email === email, 'Me returned unexpected user');
    },
    { critical: true },
  );

  // STEP 4 — Vehicles
  await runStep(
    'Step 4 — Vehicles',
    async () => {
      const uniquePlate = `QA-${runId}`.slice(0, 12).toUpperCase();
      const createRes = await requestJson(apiBase, 'POST', '/vehicles', {
        token,
        body: {
          name: `HACKATHON_TEST_VEHICLE_${runId}`,
          model: 'QA',
          licensePlate: uniquePlate,
          vehicleType: 'VAN',
          maxCapacityKg: 1200,
          odometer: 100,
          acquisitionCost: 10000,
          status: 'AVAILABLE',
          region: 'hackathonTest',
        },
      });

      assert(createRes.ok, `Create vehicle HTTP ${createRes.status}: ${createRes.json?.message || createRes.text}`);
      assert(createRes.json?.success === true, `Create vehicle failed: ${toJsonSafely(createRes.json)}`);

      const vehicle = createRes.json?.data?.vehicle;
      const vehicleId = extractId(vehicle);
      assert(vehicleId, `Vehicle id missing: ${toJsonSafely(vehicle)}`);

      created.vehicleId = vehicleId;

      const listRes = await requestJson(apiBase, 'GET', '/vehicles', { token });
      assert(listRes.ok, `List vehicles HTTP ${listRes.status}`);
      assert(listRes.json?.success === true, `List vehicles failed: ${toJsonSafely(listRes.json)}`);

      const vehicles = listRes.json?.data?.vehicles;
      assert(Array.isArray(vehicles), `Expected vehicles array, got: ${toJsonSafely(listRes.json?.data)}`);

      const found = vehicles.find((v) => String(v?._id) === String(vehicleId) || v?.licensePlate === uniquePlate);
      assert(found, 'Created vehicle not found in list');
    },
    { critical: true },
  );

  // STEP 5 — Drivers
  await runStep(
    'Step 5 — Drivers',
    async () => {
      const licenseNumber = `LIC-${runId}`.slice(0, 16).toUpperCase();
      const createRes = await requestJson(apiBase, 'POST', '/drivers', {
        token,
        body: {
          name: `HACKATHON_TEST_DRIVER_${runId}`,
          licenseNumber,
          licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          licenseCategory: 'Van',
          status: 'OFF_DUTY',
        },
      });

      assert(createRes.ok, `Create driver HTTP ${createRes.status}: ${createRes.json?.message || createRes.text}`);
      assert(createRes.json?.success === true, `Create driver failed: ${toJsonSafely(createRes.json)}`);

      const driver = createRes.json?.data?.driver;
      const driverId = extractId(driver);
      assert(driverId, `Driver id missing: ${toJsonSafely(driver)}`);

      created.driverId = driverId;

      const listRes = await requestJson(apiBase, 'GET', '/drivers', { token });
      assert(listRes.ok, `List drivers HTTP ${listRes.status}`);
      assert(listRes.json?.success === true, `List drivers failed: ${toJsonSafely(listRes.json)}`);

      const drivers = listRes.json?.data?.drivers;
      assert(Array.isArray(drivers), `Expected drivers array, got: ${toJsonSafely(listRes.json?.data)}`);

      const found = drivers.find((d) => String(d?._id) === String(driverId) || d?.licenseNumber === licenseNumber);
      assert(found, 'Created driver not found in list');
    },
    { critical: true },
  );

  // STEP 6 — Trip Workflow
  await runStep(
    'Step 6 — Trip Workflow',
    async () => {
      assert(created.vehicleId, 'Missing created vehicleId');
      assert(created.driverId, 'Missing created driverId');

      const createTripRes = await requestJson(apiBase, 'POST', '/trips', {
        token,
        body: {
          vehicle: created.vehicleId,
          driver: created.driverId,
          cargoWeightKg: 200,
          origin: 'hackathonTest-origin',
          destination: 'hackathonTest-destination',
          distanceKm: 12,
          revenue: 50,
          startOdometer: 100,
        },
      });

      assert(createTripRes.ok, `Create trip HTTP ${createTripRes.status}: ${createTripRes.json?.message || createTripRes.text}`);
      assert(createTripRes.json?.success === true, `Create trip failed: ${toJsonSafely(createTripRes.json)}`);

      const trip = createTripRes.json?.data?.trip;
      const tripId = extractId(trip);
      assert(tripId, `Trip id missing: ${toJsonSafely(trip)}`);
      created.tripId = tripId;

      // Verify status changes
      const vehiclesRes = await requestJson(apiBase, 'GET', '/vehicles', { token });
      assert(vehiclesRes.ok && vehiclesRes.json?.success === true, 'Failed to fetch vehicles for status check');
      const vehicle = vehiclesRes.json?.data?.vehicles?.find((v) => String(v?._id) === String(created.vehicleId));
      assert(vehicle, 'Vehicle not found when verifying ON_TRIP');
      assert(vehicle.status === 'ON_TRIP', `Expected Vehicle.status=ON_TRIP, got ${vehicle.status}`);

      const driversRes = await requestJson(apiBase, 'GET', '/drivers', { token });
      assert(driversRes.ok && driversRes.json?.success === true, 'Failed to fetch drivers for status check');
      const driver = driversRes.json?.data?.drivers?.find((d) => String(d?._id) === String(created.driverId));
      assert(driver, 'Driver not found when verifying ON_DUTY');
      assert(driver.status === 'ON_DUTY', `Expected Driver.status=ON_DUTY, got ${driver.status}`);

      // Complete trip
      const completeRes = await requestJson(apiBase, 'PATCH', `/trips/${tripId}/complete`, {
        token,
        body: { endOdometer: 112 },
      });

      assert(completeRes.ok, `Complete trip HTTP ${completeRes.status}: ${completeRes.json?.message || completeRes.text}`);
      assert(completeRes.json?.success === true, `Complete trip failed: ${toJsonSafely(completeRes.json)}`);

      const vehiclesRes2 = await requestJson(apiBase, 'GET', '/vehicles', { token });
      assert(vehiclesRes2.ok && vehiclesRes2.json?.success === true, 'Failed to fetch vehicles for restore check');
      const vehicle2 = vehiclesRes2.json?.data?.vehicles?.find((v) => String(v?._id) === String(created.vehicleId));
      assert(vehicle2, 'Vehicle not found when verifying AVAILABLE');
      assert(vehicle2.status === 'AVAILABLE', `Expected Vehicle.status=AVAILABLE after completion, got ${vehicle2.status}`);

      const driversRes2 = await requestJson(apiBase, 'GET', '/drivers', { token });
      assert(driversRes2.ok && driversRes2.json?.success === true, 'Failed to fetch drivers for restore check');
      const driver2 = driversRes2.json?.data?.drivers?.find((d) => String(d?._id) === String(created.driverId));
      assert(driver2, 'Driver not found when verifying OFF_DUTY');
      assert(driver2.status === 'OFF_DUTY', `Expected Driver.status=OFF_DUTY after completion, got ${driver2.status}`);
    },
    { critical: true, requiresToken: true },
  );

  // STEP 7 — Maintenance Workflow
  await runStep(
    'Step 7 — Maintenance Workflow',
    async () => {
      assert(created.vehicleId, 'Missing created vehicleId');

      const res = await requestJson(apiBase, 'POST', '/maintenance', {
        token,
        body: {
          vehicle: created.vehicleId,
          description: `hackathonTest maintenance ${runId}`,
          cost: 123,
          serviceDate: new Date().toISOString(),
          status: 'OPEN',
        },
      });

      assert(res.ok, `Create maintenance HTTP ${res.status}: ${res.json?.message || res.text}`);
      assert(res.json?.success === true, `Create maintenance failed: ${toJsonSafely(res.json)}`);

      const maintenanceId = extractId(res.json?.data?.maintenance);
      if (maintenanceId) created.maintenanceId = maintenanceId;

      const vehicle = res.json?.data?.vehicle;
      assert(vehicle && String(vehicle?._id) === String(created.vehicleId), 'Maintenance response vehicle mismatch');
      assert(vehicle.status === 'IN_SHOP', `Expected Vehicle.status=IN_SHOP, got ${vehicle.status}`);

      // Cleanup-ish: move vehicle back to AVAILABLE so the demo DB isn’t left "in shop"
      const patchRes = await requestJson(apiBase, 'PATCH', `/vehicles/${created.vehicleId}`, {
        token,
        body: { status: 'AVAILABLE' },
      });
      assert(patchRes.ok, `Restore vehicle status HTTP ${patchRes.status}: ${patchRes.json?.message || patchRes.text}`);
      assert(patchRes.json?.success === true, `Restore vehicle status failed: ${toJsonSafely(patchRes.json)}`);
    },
    { critical: true },
  );

  // STEP 8 — Expenses
  await runStep(
    'Step 8 — Expenses',
    async () => {
      assert(created.vehicleId, 'Missing created vehicleId');

      const createRes = await requestJson(apiBase, 'POST', '/expenses', {
        token,
        body: {
          vehicle: created.vehicleId,
          ...(created.tripId ? { trip: created.tripId } : {}),
          liters: 10,
          cost: 40,
          date: new Date().toISOString(),
        },
      });

      assert(createRes.ok, `Create expense HTTP ${createRes.status}: ${createRes.json?.message || createRes.text}`);
      assert(createRes.json?.success === true, `Create expense failed: ${toJsonSafely(createRes.json)}`);

      const fuelLogId = extractId(createRes.json?.data);
      if (fuelLogId) created.fuelLogId = fuelLogId;

      const listRes = await requestJson(apiBase, 'GET', '/expenses', { token });
      assert(listRes.ok, `Get expenses HTTP ${listRes.status}`);
      assert(listRes.json?.success === true, `Get expenses failed: ${toJsonSafely(listRes.json)}`);

      const expenses = listRes.json?.data;
      assert(Array.isArray(expenses), `Expected expenses array, got: ${toJsonSafely(expenses)}`);

      if (fuelLogId) {
        const found = expenses.find((e) => String(e?._id) === String(fuelLogId));
        assert(found, 'Created fuel log not found in expenses list');
      }
    },
    { critical: true },
  );

  // STEP 9 — Dashboard
  await runStep(
    'Step 9 — Dashboard',
    async () => {
      const res = await requestJson(apiBase, 'GET', '/dashboard', { token });
      assert(res.ok, `Dashboard HTTP ${res.status}`);
      assert(res.json?.success === true, `Dashboard failed: ${toJsonSafely(res.json)}`);

      const d = res.json?.data;
      assert(d && typeof d === 'object', `Dashboard data missing: ${toJsonSafely(res.json)}`);
      for (const k of ['activeFleet', 'vehiclesInShop', 'idleVehicles', 'pendingTrips']) {
        assert(Number.isFinite(Number(d[k])), `Dashboard field ${k} missing/not numeric: ${toJsonSafely(d)}`);
      }
    },
    { critical: true },
  );

  // STEP 10 — Analytics
  await runStep(
    'Step 10 — Analytics',
    async () => {
      const res = await requestJson(apiBase, 'GET', '/analytics', { token });
      assert(res.ok, `Analytics HTTP ${res.status}`);
      assert(res.json?.success === true, `Analytics failed: ${toJsonSafely(res.json)}`);

      const a = res.json?.data;
      assert(a && typeof a === 'object', `Analytics data missing: ${toJsonSafely(res.json)}`);
      for (const k of ['fuelEfficiency', 'operationalCost', 'roi']) {
        assert(a[k] !== undefined, `Analytics field ${k} missing: ${toJsonSafely(a)}`);
      }
    },
    { critical: true },
  );

  heading('Summary');
  const failed = results.filter((r) => r.ok === false && !r.skipped);
  const skipped = results.filter((r) => r.skipped);

  for (const r of results) {
    if (r.ok) console.log(okMark(r.label));
    else if (r.skipped) console.log(warnMark(`${r.label} — ${r.message}`));
    else console.log(failMark(`${r.label} — ${r.message || 'Failed'}`));
  }

  heading('Created Test Data (for manual cleanup)');
  console.log(color(`runId: ${runId}`, 'dim'));
  if (created.user?.email) console.log(color(`user.email: ${created.user.email}`, 'dim'));
  if (created.vehicleId) console.log(color(`vehicleId: ${created.vehicleId} (region: hackathonTest)`, 'dim'));
  if (created.driverId) console.log(color(`driverId: ${created.driverId}`, 'dim'));
  if (created.tripId) console.log(color(`tripId: ${created.tripId}`, 'dim'));
  if (created.maintenanceId) console.log(color(`maintenanceId: ${created.maintenanceId}`, 'dim'));
  if (created.fuelLogId) console.log(color(`fuelLogId: ${created.fuelLogId}`, 'dim'));

  const durationMs = Date.now() - startedAt;
  console.log(`\n${color('Duration:', 'dim')} ${durationMs}ms`);

  if (failed.length) {
    console.log(`\n${color('Overall:', 'bold')} ${color('FAILED', 'red')} (${failed.length} failing step(s))`);
    process.exitCode = 1;
  } else {
    console.log(`\n${color('Overall:', 'bold')} ${color('PASSED', 'green')}${skipped.length ? color(` (with ${skipped.length} skipped)`, 'yellow') : ''}`);
    process.exitCode = 0;
  }
}

main().catch((e) => {
  console.error(failMark(`Fatal error: ${e?.message || e}`));
  process.exitCode = 1;
});
