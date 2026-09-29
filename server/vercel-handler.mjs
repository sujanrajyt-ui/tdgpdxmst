import { createHash, randomBytes } from 'node:crypto';
import { getAddress, verifyMessage } from 'ethers';
import { neon } from '@neondatabase/serverless';

// Marketplace integrations expose slightly different variable names. Prefer
// DATABASE_URL, while accepting common Postgres/Neon aliases as well.
const databaseUrl = process.env.DATABASE_URL
  || process.env.POSTGRES_URL
  || process.env.POSTGRES_PRISMA_URL
  || process.env.POSTGRES_URL_NON_POOLING
  || process.env.NEON_DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;
const sha256 = value => createHash('sha256').update(value).digest('hex');
const now = () => new Date().toISOString();
const cookieName = 'passport_session';
const admins = new Set((process.env.ADMIN_WALLETS || '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean));
const sessionHours = Number(process.env.SESSION_HOURS || 24);
const rateBuckets = new Map();
let schemaReady;

const schema = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, wallet_address TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'CONSUMER', seller_status TEXT NOT NULL DEFAULT 'NOT_APPLIED',
    created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS challenges (
    wallet_address TEXT PRIMARY KEY, nonce TEXT NOT NULL, expires_at BIGINT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at BIGINT NOT NULL, created_at TIMESTAMPTZ NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS passports (
    passport_id TEXT PRIMARY KEY, owner_wallet TEXT NOT NULL, identifier_hash TEXT NOT NULL UNIQUE,
    payload_json JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS listings (
    listing_id TEXT PRIMARY KEY, passport_id TEXT NOT NULL REFERENCES passports(passport_id),
    seller_wallet TEXT NOT NULL, status TEXT NOT NULL, payload_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS listings_status_created ON listings(status, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS seller_applications (
    wallet_address TEXT PRIMARY KEY, business_name TEXT NOT NULL, status TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL, reviewed_at TIMESTAMPTZ)`,
  `CREATE TABLE IF NOT EXISTS evidence (
    evidence_id TEXT PRIMARY KEY, owner_wallet TEXT NOT NULL, passport_id TEXT,
    content_type TEXT NOT NULL, file_name TEXT NOT NULL, file_data BYTEA NOT NULL,
    sha256 TEXT NOT NULL, byte_size INTEGER NOT NULL, created_at TIMESTAMPTZ NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY, listing_id TEXT NOT NULL REFERENCES listings(listing_id),
    buyer_wallet TEXT NOT NULL, seller_wallet TEXT NOT NULL, status TEXT NOT NULL,
    payment_reference TEXT, seller_transfer_tx TEXT, buyer_confirmation_tx TEXT,
    created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY, actor_wallet TEXT NOT NULL, action TEXT NOT NULL,
    target_id TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL)`,
];

async function ready() {
  if (!sql) throw Object.assign(new Error('No Postgres connection string is available to this deployment. Check the database integration’s environment variable name and Production/Preview scope, then redeploy.'), { status: 503 });
  if (!schemaReady) schemaReady = (async () => {
    for (const statement of schema) await sql.query(statement, []);
  })();
  try { await schemaReady; } catch (error) { schemaReady = undefined; throw error; }
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    ...headers,
  });
  res.end(JSON.stringify(body));
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map(part => part.trim().split(/=(.*)/s))
    .filter(([key, value]) => key && value !== undefined).map(([key, value]) => [key, decodeURIComponent(value)]));
}

function rateLimit(req, res, limit = 60, windowMs = 60_000) {
  const path = new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`).pathname;
  const key = `${req.headers['x-forwarded-for'] || 'unknown'}:${path}`;
  const time = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || time >= bucket.resetAt) rateBuckets.set(key, { count: 1, resetAt: time + windowMs });
  else bucket.count += 1;
  const current = rateBuckets.get(key);
  if (current.count <= limit) return true;
  send(res, 429, { error: 'rate_limited', message: 'Too many requests. Try again shortly.' }, {
    'retry-after': String(Math.ceil((current.resetAt - time) / 1000)),
  });
  return false;
}

async function readJson(req, maxBytes = 3 * 1024 * 1024) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { throw Object.assign(new Error('Request body must be valid JSON.'), { status: 400 }); }
  }
  const chunks = [];
  let length = 0;
  for await (const chunk of req) {
    length += chunk.length;
    if (length > maxBytes) throw Object.assign(new Error('Request body is too large.'), { status: 413 });
    chunks.push(chunk);
  }
  if (!length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw Object.assign(new Error('Request body must be valid JSON.'), { status: 400 }); }
}

function publicUser(row) {
  return { id: row.id, walletAddress: row.wallet_address, name: row.display_name, role: row.role, sellerStatus: row.seller_status, createdAt: row.created_at };
}

async function getSession(req) {
  const token = parseCookies(req.headers.cookie)[cookieName];
  if (!token) return null;
  const [row] = await sql.query(`SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id
    WHERE s.token_hash=$1 AND s.expires_at>$2 LIMIT 1`, [sha256(token), Date.now()]);
  return row || null;
}

function unauthorized(res) { send(res, 401, { error: 'authentication_required', message: 'Connect your wallet and sign in to continue.' }); }
function forbidden(res) { send(res, 403, { error: 'forbidden', message: 'Your account is not allowed to perform this action.' }); }

async function requireUser(req, res, roles) {
  const user = await getSession(req);
  if (!user) { unauthorized(res); return null; }
  if (roles && !roles.includes(user.role)) { forbidden(res); return null; }
  return user;
}

async function audit(user, action, targetId) {
  await sql.query('INSERT INTO audit_log(actor_wallet,action,target_id,created_at) VALUES($1,$2,$3,$4)', [user.wallet_address, action, targetId, now()]);
}

function validateText(value, label, maxLength) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw Object.assign(new Error(`${label} is required and must be at most ${maxLength} characters.`), { status: 400 });
  }
  return value.trim();
}

function cookie(value, maxAge) {
  return `${cookieName}=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}; Secure`;
}

async function route(req, res) {
  await ready();
  const url = new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`);
  const path = url.pathname;
  const method = req.method || 'GET';
  if (!rateLimit(req, res, path.includes('/auth/') ? 20 : 90)) return;
  if (method === 'OPTIONS') { res.writeHead(204, { allow: 'GET,POST,PATCH,DELETE,OPTIONS' }); res.end(); return; }

  if (method === 'GET' && path === '/api/health') {
    return send(res, 200, { status: 'ok', database: 'postgres', chainId: 91562037, payments: 'not_configured', contracts: Boolean(process.env.MST_PRODUCT_PASSPORT_REGISTRY && process.env.MST_OWNERSHIP_REGISTRY) });
  }

  if (method === 'POST' && path === '/api/auth/nonce') {
    const body = await readJson(req);
    let wallet;
    try { wallet = getAddress(body.walletAddress); } catch { return send(res, 400, { error: 'invalid_wallet_address' }); }
    const nonce = randomBytes(24).toString('hex');
    const expiresAt = Date.now() + 5 * 60_000;
    const message = `Product Passport Marketplace login\nDomain: ${req.headers.host || 'localhost'}\nWallet: ${wallet}\nNonce: ${nonce}\nIssued At: ${now()}\nThis signature will not send a blockchain transaction.`;
    await sql.query(`INSERT INTO challenges(wallet_address,nonce,expires_at) VALUES($1,$2,$3)
      ON CONFLICT(wallet_address) DO UPDATE SET nonce=EXCLUDED.nonce,expires_at=EXCLUDED.expires_at`, [wallet, JSON.stringify({ nonce, message, expiresAt }), expiresAt]);
    return send(res, 200, { message, expiresAt: new Date(expiresAt).toISOString() });
  }

  if (method === 'POST' && path === '/api/auth/verify') {
    const body = await readJson(req);
    let wallet;
    try { wallet = getAddress(body.walletAddress); } catch { return send(res, 400, { error: 'invalid_wallet_address' }); }
    const [challenge] = await sql.query('SELECT nonce,expires_at FROM challenges WHERE wallet_address=$1 LIMIT 1', [wallet]);
    if (!challenge || Number(challenge.expires_at) <= Date.now()) return send(res, 401, { error: 'challenge_expired', message: 'Request a fresh sign-in challenge.' });
    const parsed = JSON.parse(challenge.nonce);
    if (body.message !== parsed.message) return send(res, 401, { error: 'challenge_mismatch' });
    let signer;
    try { signer = getAddress(verifyMessage(body.message, body.signature)); } catch { return send(res, 401, { error: 'invalid_signature' }); }
    if (signer !== wallet) return send(res, 401, { error: 'wallet_signature_mismatch' });
    await sql.query('DELETE FROM challenges WHERE wallet_address=$1', [wallet]);
    const timestamp = now();
    const id = `wallet:${wallet.toLowerCase()}`;
    const initialRole = admins.has(wallet.toLowerCase()) ? 'ADMIN' : 'CONSUMER';
    await sql.query(`INSERT INTO users(id,wallet_address,role,created_at,updated_at) VALUES($1,$2,$3,$4,$4)
      ON CONFLICT(wallet_address) DO UPDATE SET role=CASE WHEN EXCLUDED.role='ADMIN' THEN 'ADMIN' ELSE users.role END,updated_at=EXCLUDED.updated_at`, [id, wallet, initialRole, timestamp]);
    const [user] = await sql.query('SELECT * FROM users WHERE wallet_address=$1 LIMIT 1', [wallet]);
    const token = randomBytes(32).toString('base64url');
    const expiresAt = Date.now() + sessionHours * 60 * 60_000;
    await sql.query('INSERT INTO sessions(token_hash,user_id,expires_at,created_at) VALUES($1,$2,$3,$4)', [sha256(token), user.id, expiresAt, timestamp]);
    return send(res, 200, { user: publicUser(user) }, { 'set-cookie': cookie(encodeURIComponent(token), sessionHours * 3600) });
  }

  if (method === 'POST' && path === '/api/auth/logout') {
    const token = parseCookies(req.headers.cookie)[cookieName];
    if (token) await sql.query('DELETE FROM sessions WHERE token_hash=$1', [sha256(token)]);
    return send(res, 200, { ok: true }, { 'set-cookie': cookie('', 0) });
  }

  if (method === 'GET' && path === '/api/me') {
    const user = await getSession(req);
    return user ? send(res, 200, { user: publicUser(user) }) : unauthorized(res);
  }

  if (method === 'PATCH' && path === '/api/me') {
    const user = await requireUser(req, res); if (!user) return;
    const name = validateText((await readJson(req)).name, 'Name', 80);
    const [updated] = await sql.query('UPDATE users SET display_name=$1,updated_at=$2 WHERE id=$3 RETURNING *', [name, now(), user.id]);
    return send(res, 200, { user: publicUser(updated) });
  }

  if (method === 'POST' && path === '/api/seller-applications') {
    const user = await requireUser(req, res); if (!user) return;
    const business = validateText((await readJson(req)).businessName, 'Business name', 120);
    await sql.query(`INSERT INTO seller_applications(wallet_address,business_name,status,submitted_at) VALUES($1,$2,'PENDING',$3)
      ON CONFLICT(wallet_address) DO UPDATE SET business_name=EXCLUDED.business_name,status='PENDING',submitted_at=EXCLUDED.submitted_at,reviewed_at=NULL`, [user.wallet_address, business, now()]);
    await sql.query('UPDATE users SET seller_status=$1,updated_at=$2 WHERE id=$3', ['PENDING', now(), user.id]);
    await audit(user, 'SELLER_APPLICATION_SUBMITTED', user.wallet_address);
    return send(res, 201, { status: 'PENDING' });
  }

  if (method === 'GET' && path === '/api/listings') {
    const rows = await sql.query(`SELECT payload_json FROM listings WHERE status='ACTIVE' ORDER BY created_at DESC LIMIT 200`, []);
    return send(res, 200, { listings: rows.map(row => row.payload_json) });
  }

  if (method === 'GET' && path === '/api/my/marketplace') {
    const user = await requireUser(req, res); if (!user) return;
    const passports = await sql.query('SELECT payload_json FROM passports WHERE owner_wallet=$1 ORDER BY created_at DESC', [user.wallet_address]);
    const listings = await sql.query('SELECT payload_json FROM listings WHERE seller_wallet=$1 ORDER BY created_at DESC', [user.wallet_address]);
    return send(res, 200, { passports: passports.map(row => row.payload_json), listings: listings.map(row => row.payload_json) });
  }

  if (method === 'POST' && path === '/api/passports') {
    const user = await requireUser(req, res); if (!user) return;
    const body = await readJson(req);
    const identifierHash = String(body.identifierHash || '').toLowerCase();
    if (!/^0x[0-9a-f]{64}$/.test(identifierHash)) return send(res, 400, { error: 'invalid_identifier_hash', message: 'Send only a 32-byte hash, never a serial number or IMEI.' });
    if (!['SMARTPHONE', 'LAPTOP', 'CAMERA', 'FURNITURE', 'OTHER'].includes(body.category)) return send(res, 400, { error: 'invalid_category' });
    const brand = validateText(body.brand, 'Brand', 80);
    const model = validateText(body.model, 'Model', 140);
    const releaseYear = Number(body.releaseYear);
    if (!Number.isInteger(releaseYear) || releaseYear < 1970 || releaseYear > new Date().getFullYear() + 1) return send(res, 400, { error: 'invalid_release_year' });
    const passportTxHash = String(body.passportTxHash || '');
    const ownershipTxHash = String(body.ownershipTxHash || '');
    const attestationTxHash = String(body.attestationTxHash || '');
    if (![passportTxHash, ownershipTxHash, attestationTxHash].every(hash => /^0x[0-9a-fA-F]{64}$/.test(hash))) return send(res, 400, { error: 'missing_mst_transactions', message: 'Confirm passport, ownership, and seller-claim transactions on MST Testnet first.' });
    const [existing] = await sql.query('SELECT passport_id FROM passports WHERE identifier_hash=$1 LIMIT 1', [identifierHash]);
    if (existing) return send(res, 409, { error: 'product_already_registered', passportId: existing.passport_id });
    const passportId = body.passportId ? String(body.passportId).trim().toUpperCase() : `PP-${randomBytes(4).readUInt32BE() % 900000 + 100000}`;
    if (!/^PP-[A-Z0-9-]{3,32}$/.test(passportId)) return send(res, 400, { error: 'invalid_passport_id' });
    const createdAt = now();
    const payload = {
      passportId, category: body.category, brand, model, releaseYear,
      imageUrl: typeof body.imageUrl === 'string' && body.imageUrl.startsWith('https://') ? body.imageUrl.slice(0, 800) : '',
      additionalImages: [], identifier: { category: body.category, model, brand, hashedIdentifier: identifierHash },
      verificationLevel: 'SELLER_REPORTED', currentStatus: 'ACTIVE', currentOwnerId: user.id,
      currentOwnerName: user.display_name || `MST user ${user.wallet_address.slice(-4)}`,
      currentOwnerDid: `did:mst:wallet:${user.wallet_address.toLowerCase()}`,
      riskLevel: 'REVIEW_REQUIRED', riskScore: 50, riskSignals: ['Backend record created; identity anchor not independently confirmed.'],
      createdAt, updatedAt: createdAt,
      ownershipHistory: [{ id: `OWN-${passportId}`, passportId, ownerId: user.id, ownerName: user.display_name || `MST user ${user.wallet_address.slice(-4)}`, ownerDid: `did:mst:wallet:${user.wallet_address.toLowerCase()}`, acquiredAt: createdAt, transferTxHash: ownershipTxHash, verificationLevelAtTransfer: 'OWNERSHIP_VERIFIED' }],
      attestations: [{ id: `ATT-${passportId}`, passportId, claim: 'SELLER_REPORTED', issuerId: user.id, issuerName: user.display_name || `MST user ${user.wallet_address.slice(-4)}`, issuerRole: user.role, issuerDid: `did:mst:wallet:${user.wallet_address.toLowerCase()}`, evidenceHash: identifierHash, evidenceSummary: 'Seller-reported product identifier hash.', timestamp: createdAt, mstTxHash: attestationTxHash, status: 'VALID' }], serviceRecords: [], inspectionRecords: [],
      lifecycleHistory: [], disputes: [], chainStatus: 'ANCHORED', passportTxHash, ownershipTxHash, attestationTxHash,
      conditionReport: { display: 'GOOD', body: 'GOOD', batteryHealthPct: 0, keyboardPorts: 'GOOD', aiObservationNotes: [] },
    };
    await sql.query('INSERT INTO passports(passport_id,owner_wallet,identifier_hash,payload_json,created_at,updated_at) VALUES($1,$2,$3,$4::jsonb,$5,$5)', [passportId, user.wallet_address, identifierHash, JSON.stringify(payload), createdAt]);
    await audit(user, 'PASSPORT_CREATED', passportId);
    return send(res, 201, { passport: payload });
  }

  if (method === 'GET' && path === '/api/passports') {
    const rows = await sql.query('SELECT payload_json FROM passports ORDER BY created_at DESC LIMIT 200', []);
    return send(res, 200, { passports: rows.map(row => row.payload_json) });
  }

  const passportMatch = path.match(/^\/api\/passports\/([A-Za-z0-9_-]+)$/);
  if (method === 'GET' && passportMatch) {
    const [row] = await sql.query('SELECT payload_json FROM passports WHERE passport_id=$1 LIMIT 1', [passportMatch[1]]);
    return row ? send(res, 200, { passport: row.payload_json }) : send(res, 404, { error: 'passport_not_found' });
  }

  if (method === 'POST' && path === '/api/listings') {
    const user = await requireUser(req, res); if (!user) return;
    if (!['SELLER', 'ADMIN'].includes(user.role)) return forbidden(res);
    const body = await readJson(req);
    const passportId = validateText(body.passportId, 'Passport ID', 40);
    const [product] = await sql.query('SELECT * FROM passports WHERE passport_id=$1 LIMIT 1', [passportId]);
    if (!product) return send(res, 404, { error: 'passport_not_found' });
    if (product.owner_wallet.toLowerCase() !== user.wallet_address.toLowerCase()) return forbidden(res);
    const [active] = await sql.query("SELECT 1 FROM listings WHERE passport_id=$1 AND status IN ('ACTIVE','PENDING_REVIEW','RESERVED') LIMIT 1", [passportId]);
    if (active) return send(res, 409, { error: 'active_listing_exists' });
    const price = Number(body.price);
    if (!Number.isSafeInteger(price) || price < 1 || price > 10_000_000_000) return send(res, 400, { error: 'invalid_price', message: 'Price must be an integer number of rupees.' });
    const listingId = `LST-${randomBytes(5).toString('hex').toUpperCase()}`;
    const createdAt = now();
    const listing = {
      id: listingId, passportId, sellerId: user.id, sellerWallet: user.wallet_address,
      sellerName: user.display_name || `MST user ${user.wallet_address.slice(-4)}`, sellerReputation: 0,
      sellerDid: `did:mst:wallet:${user.wallet_address.toLowerCase()}`,
      title: validateText(body.title, 'Title', 160), description: String(body.description || '').trim().slice(0, 4000),
      price, currency: 'INR', location: validateText(body.location, 'Location', 120), status: 'PENDING_REVIEW', listedAt: createdAt, createdAt,
      mstTxHash: /^0x[0-9a-fA-F]{64}$/.test(String(body.mstTxHash || '')) ? body.mstTxHash : '',
    };
    await sql.query('INSERT INTO listings(listing_id,passport_id,seller_wallet,status,payload_json,created_at,updated_at) VALUES($1,$2,$3,$4,$5::jsonb,$6,$6)', [listingId, passportId, user.wallet_address, listing.status, JSON.stringify(listing), createdAt]);
    await audit(user, 'LISTING_SUBMITTED', listingId);
    return send(res, 201, { listing });
  }

  if (method === 'GET' && path === '/api/admin/review-queue') {
    const user = await requireUser(req, res, ['ADMIN']); if (!user) return;
    const listings = await sql.query("SELECT payload_json FROM listings WHERE status='PENDING_REVIEW' ORDER BY created_at ASC LIMIT 100", []);
    const sellers = await sql.query("SELECT * FROM seller_applications WHERE status='PENDING' ORDER BY submitted_at ASC LIMIT 100", []);
    return send(res, 200, { listings: listings.map(row => row.payload_json), sellerApplications: sellers });
  }

  const reviewSeller = path.match(/^\/api\/admin\/sellers\/(0x[0-9a-fA-F]{40})$/);
  if (method === 'PATCH' && reviewSeller) {
    const user = await requireUser(req, res, ['ADMIN']); if (!user) return;
    const body = await readJson(req);
    if (!['APPROVE', 'REJECT'].includes(body.decision)) return send(res, 400, { error: 'invalid_decision' });
    const wallet = getAddress(reviewSeller[1]);
    const [application] = await sql.query('SELECT * FROM seller_applications WHERE wallet_address=$1 LIMIT 1', [wallet]);
    if (!application) return send(res, 404, { error: 'seller_application_not_found' });
    const status = body.decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    const role = body.decision === 'APPROVE' ? 'SELLER' : 'CONSUMER';
    const reviewedAt = now();
    await sql.query('UPDATE seller_applications SET status=$1,reviewed_at=$2 WHERE wallet_address=$3', [status, reviewedAt, wallet]);
    await sql.query('UPDATE users SET role=$1,seller_status=$2,updated_at=$3 WHERE wallet_address=$4', [role, status, reviewedAt, wallet]);
    await audit(user, `SELLER_${body.decision}`, wallet);
    return send(res, 200, { walletAddress: wallet, status, role });
  }

  const reviewListing = path.match(/^\/api\/admin\/listings\/([A-Za-z0-9_-]+)$/);
  if (method === 'PATCH' && reviewListing) {
    const user = await requireUser(req, res, ['ADMIN']); if (!user) return;
    const body = await readJson(req);
    if (!['APPROVE', 'REJECT'].includes(body.decision)) return send(res, 400, { error: 'invalid_decision' });
    const [row] = await sql.query('SELECT payload_json,status FROM listings WHERE listing_id=$1 LIMIT 1', [reviewListing[1]]);
    if (!row) return send(res, 404, { error: 'listing_not_found' });
    if (row.status !== 'PENDING_REVIEW') return send(res, 409, { error: 'listing_not_pending_review' });
    const listing = row.payload_json;
    listing.status = body.decision === 'APPROVE' ? 'ACTIVE' : 'REJECTED';
    listing.reviewedAt = now();
    listing.reviewNote = String(body.note || '').trim().slice(0, 500);
    await sql.query('UPDATE listings SET status=$1,payload_json=$2::jsonb,updated_at=$3 WHERE listing_id=$4', [listing.status, JSON.stringify(listing), now(), reviewListing[1]]);
    await audit(user, `LISTING_${body.decision}`, reviewListing[1]);
    return send(res, 200, { listing });
  }

  if (method === 'POST' && path === '/api/orders') {
    const user = await requireUser(req, res); if (!user) return;
    return send(res, 503, { error: 'payments_not_configured', message: 'Checkout is unavailable until a payment provider is configured.' });
  }

  if (method === 'POST' && path === '/api/evidence') {
    const user = await requireUser(req, res); if (!user) return;
    const body = await readJson(req, 3 * 1024 * 1024);
    const type = String(body.contentType || '');
    const allowed = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);
    if (!allowed.has(type)) return send(res, 415, { error: 'unsupported_evidence_type' });
    if (typeof body.base64 !== 'string') return send(res, 400, { error: 'missing_file_data' });
    const bytes = Buffer.from(body.base64, 'base64');
    if (!bytes.length || bytes.length > 1_500_000) return send(res, 413, { error: 'evidence_size_limit', message: 'For this Vercel upload path, evidence must be under 1.5 MB.' });
    const signatures = {
      'application/pdf': bytes.subarray(0, 5).toString('ascii') === '%PDF-',
      'image/jpeg': bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
      'image/png': bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
      'image/webp': bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP',
    };
    if (!signatures[type]) return send(res, 415, { error: 'file_content_type_mismatch' });
    const evidenceId = randomBytes(16).toString('hex');
    const digest = createHash('sha256').update(bytes).digest('hex');
    const name = String(body.fileName || 'evidence').replace(/[\r\n"/\\]/g, '_').slice(0, 120);
    await sql.query(`INSERT INTO evidence(evidence_id,owner_wallet,passport_id,content_type,file_name,file_data,sha256,byte_size,created_at)
      VALUES($1,$2,$3,$4,$5,decode($6,'hex'),$7,$8,$9)`, [evidenceId, user.wallet_address, body.passportId || null, type, name, bytes.toString('hex'), digest, bytes.length, now()]);
    return send(res, 201, { evidenceId, sha256: `0x${digest}`, byteSize: bytes.length });
  }

  const evidenceMatch = path.match(/^\/api\/evidence\/([a-f0-9]{32})$/);
  if (method === 'GET' && evidenceMatch) {
    const user = await requireUser(req, res); if (!user) return;
    const [evidence] = await sql.query("SELECT owner_wallet,content_type,file_name,encode(file_data,'base64') AS base64_data FROM evidence WHERE evidence_id=$1 LIMIT 1", [evidenceMatch[1]]);
    if (!evidence) return send(res, 404, { error: 'evidence_not_found' });
    if (user.role !== 'ADMIN' && evidence.owner_wallet.toLowerCase() !== user.wallet_address.toLowerCase()) return forbidden(res);
    const bytes = Buffer.from(evidence.base64_data, 'base64');
    res.writeHead(200, { 'content-type': evidence.content_type, 'content-length': bytes.length, 'content-disposition': `attachment; filename="${evidence.file_name}"`, 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff' });
    return res.end(bytes);
  }

  if (method === 'GET' && path === '/api/admin/audit-log') {
    const user = await requireUser(req, res, ['ADMIN']); if (!user) return;
    const events = await sql.query('SELECT actor_wallet,action,target_id,created_at FROM audit_log ORDER BY id DESC LIMIT 200', []);
    return send(res, 200, { events });
  }

  return send(res, 404, { error: 'not_found' });
}

export async function handleVercelApi(req, res) {
  try { await route(req, res); }
  catch (error) {
    console.error('Vercel API request failed:', error?.message || error);
    if (!res.headersSent) send(res, error.status || 500, {
      error: error.status ? 'invalid_request' : 'internal_error',
      message: error.status ? error.message : 'The server could not complete the request.',
    });
    else res.destroy();
  }
}
