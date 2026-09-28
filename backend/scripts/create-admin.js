#!/usr/bin/env node
/**
 * Krishna Jewellers - create a NEW admin login and verify it works
 *
 * PUT IT AT:  backend/scripts/create-admin.js
 * RUN FROM:   the backend/ folder, with the backend server running
 *
 *   node scripts/create-admin.js --email new@example.com --password "MyPass@123"
 *
 * OPTIONS
 *   --email <e>      New admin email (required)
 *   --password <p>   New admin password, min 6 chars (required)
 *   --name <n>       Display name                      (default: "Admin")
 *   --role <r>       superadmin | admin                (default: superadmin)
 *   --api <url>      API base URL                      (default: http://localhost:3001/api/v1)
 *   --reset          If the email already exists, overwrite its password/role
 *                    (without this flag an existing user is NOT modified)
 *   --check-only     Do not touch the DB; only test login with this email/password
 *
 * After it prints "LOGIN WORKS", sign in to the admin dashboard with these
 * credentials and change the password from there (new password: 8+ chars).
 *
 * Needs Node 18+. Uses @prisma/client and bcrypt already in backend/node_modules.
 */

const fs = require('fs');
const path = require('path');

// ── args ──────────────────────────────────────────────
const args = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const k = argv[i].slice(2);
    const n = argv[i + 1];
    if (n === undefined || n.startsWith('--')) args[k] = true;
    else { args[k] = n; i++; }
}

const EMAIL = String(args.email || '').trim();
const PASSWORD = String(args.password || '');
const NAME = String(args.name || 'Admin');
const API = String(args.api || 'http://localhost:3001/api/v1').replace(/\/+$/, '');
const RESET = !!args.reset;
const CHECK_ONLY = !!args['check-only'];
const roleKey = String(args.role || 'superadmin').toLowerCase().replace(/[\s_-]/g, '');
const ROLE = roleKey === 'superadmin' ? 'SUPER_ADMIN' : roleKey === 'admin' ? 'ADMIN' : null;

const c = { g: '\x1b[32m', r: '\x1b[31m', y: '\x1b[33m', d: '\x1b[2m', x: '\x1b[0m' };
const ok = (m) => console.log(`  ${c.g}✔${c.x} ${m}`);
const bad = (m) => console.log(`  ${c.r}✘ ${m}${c.x}`);
const info = (m) => console.log(`  ${c.d}${m}${c.x}`);

if (!EMAIL || !PASSWORD || !ROLE) {
    console.error('Usage: node scripts/create-admin.js --email <email> --password <password> [--role superadmin|admin] [--name "Name"] [--reset] [--check-only] [--api URL]');
    if (!ROLE) console.error(`Unknown role "${args.role}". Use superadmin or admin.`);
    process.exit(1);
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EMAIL)) { console.error('That does not look like a valid email address.'); process.exit(1); }
if (PASSWORD.length < 6) { console.error('Password must be at least 6 characters (the API rejects shorter ones at login).'); process.exit(1); }

// ── .env ──────────────────────────────────────────────
function loadEnv() {
    const file = path.resolve(__dirname, '..', '.env');
    if (!fs.existsSync(file)) return false;
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
        if (line.trim().startsWith('#')) continue;
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)?\s*$/);
        if (!m) continue;
        let v = (m[2] || '').trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
        if (process.env[m[1]] === undefined) process.env[m[1]] = v;
    }
    return true;
}

// ── step 1: create user in DB ─────────────────────────
async function createUser() {
    console.log('\n1. Database');
    if (!loadEnv()) { bad('backend/.env not found - run this from inside the backend folder.'); return false; }
    if (!process.env.DATABASE_URL) { bad('DATABASE_URL is missing in backend/.env'); return false; }

    let PrismaClient, bcrypt;
    try {
        ({ PrismaClient } = require('@prisma/client'));
        bcrypt = require('bcrypt');
    } catch (e) {
        bad(`${e.message}\n      Run "npm install" and "npx prisma generate" inside backend/ first.`);
        return false;
    }

    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        ok('Connected to database');

        const existing = await prisma.adminUser.findUnique({ where: { email: EMAIL } });
        const passwordHash = await bcrypt.hash(PASSWORD, 10);

        if (existing && !RESET) {
            bad(`${EMAIL} already exists (role ${existing.role}) and was NOT changed.`);
            info('Use a different email, or add --reset to overwrite its password and role.');
            return false;
        }
        if (existing) {
            await prisma.adminUser.update({ where: { email: EMAIL }, data: { passwordHash, role: ROLE, name: NAME } });
            ok(`Existing user updated: password reset, role = ${ROLE}`);
        } else {
            await prisma.adminUser.create({ data: { email: EMAIL, passwordHash, role: ROLE, name: NAME } });
            ok(`New user created: ${EMAIL} (role = ${ROLE})`);
        }
        return true;
    } catch (e) {
        bad(`Database error: ${e.message.split('\n').slice(-3).join(' ').trim()}`);
        return false;
    } finally {
        await prisma.$disconnect().catch(() => { });
    }
}

// ── step 2: verify through the real API ───────────────
async function call(method, url, { body, token } = {}) {
    const headers = {};
    if (body) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(API + url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const text = await res.text();
    let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    return { status: res.status, data };
}

async function verify() {
    console.log('\n2. Login check (through the API)');
    let failures = 0;
    const check = (cond, good, badMsg) => { if (cond) ok(good); else { failures++; bad(badMsg); } return cond; };

    try {
        const h = await call('GET', '/health');
        if (!check(h.status === 200, 'Backend is running', `Backend answered ${h.status} on /health`)) return false;
    } catch (e) {
        bad(`Cannot reach ${API} - start the backend first (npm run start:dev). (${e.cause?.code || e.message})`);
        return false;
    }

    const wrong = await call('POST', '/auth/login', { body: { email: EMAIL, password: PASSWORD + '_wrong' } });
    check(wrong.status === 401, 'Wrong password is rejected', `Wrong password returned ${wrong.status}, expected 401`);

    const login = await call('POST', '/auth/login', { body: { email: EMAIL, password: PASSWORD } });
    if (!check(login.status === 200 && login.data?.accessToken, 'Login with your email + password succeeded',
        `Login failed (${login.status}): ${JSON.stringify(login.data?.message || login.data)}\n      -> The backend may be connected to a different database than backend/.env.`)) return false;

    const token = login.data.accessToken;

    const prof = await call('GET', '/auth/profile', { token });
    check(prof.status === 200 && prof.data?.email === EMAIL, `Profile loads: ${prof.data?.email} [${prof.data?.role}]`, `Profile returned ${prof.status}`);
    check(prof.data?.role === ROLE, `Role is ${ROLE}`, `Role is ${prof.data?.role}, expected ${ROLE}`);

    const refresh = await call('POST', '/auth/refresh', { body: { refreshToken: login.data.refreshToken } });
    check(refresh.status === 200 && refresh.data?.accessToken, 'Token refresh works', `Refresh returned ${refresh.status}`);

    const noToken = await call('GET', '/dashboard/stats');
    check(noToken.status === 401, 'Dashboard is locked without a token', `Dashboard without token returned ${noToken.status}`);

    // Every page of the admin dashboard needs these to load
    const pages = [
        ['/dashboard/stats', 'Dashboard stats'],
        ['/dashboard/recent-products', 'Dashboard recent products'],
        ['/dashboard/activity', 'Dashboard activity'],
        ['/products/admin?page=1&limit=5', 'Products list'],
        ['/categories/admin/all', 'Categories list'],
        ['/offers', 'Offers list'],
        ['/testimonials', 'Testimonials list'],
        ['/banners', 'Banners list'],
        ['/gallery', 'Gallery'],
        ['/rates', 'Gold rates'],
        ['/settings', 'Settings'],
    ];
    for (const [url, label] of pages) {
        const r = await call('GET', url, { token });
        check(r.status === 200, `${label} loads`, `${label} (${url}) returned ${r.status}`);
    }
    return failures === 0;
}

// ── main ──────────────────────────────────────────────
(async () => {
    console.log(`Krishna Jewellers - new admin check\n${c.d}API: ${API}${c.x}`);

    if (!CHECK_ONLY) {
        const created = await createUser();
        if (!created) process.exit(1);
    } else {
        console.log('\n1. Database\n  ' + c.y + '– skipped (--check-only)' + c.x);
    }

    const good = await verify();
    console.log('');
    if (good) {
        console.log(`${c.g}LOGIN WORKS.${c.x} Open the admin dashboard and sign in with:`);
        console.log(`   email:    ${EMAIL}`);
        console.log('   password: (the one you just passed)');
        console.log(`\nThen change the password in the dashboard (new password must be 8+ characters).`);
        process.exit(0);
    } else {
        console.log(`${c.r}Something failed - see the ✘ lines above.${c.x}`);
        process.exit(1);
    }
})().catch((e) => { console.error(`${c.r}Fatal:${c.x}`, e); process.exit(1); });