#!/usr/bin/env node
/**
 * Krishna Jewellers - reset the password for an EXISTING admin email
 *
 * PUT IT AT:  backend/scripts/reset-password.js
 * RUN FROM:   the backend/ folder (backend does NOT need to be running for this part)
 *
 *   node scripts/reset-password.js --email admin@krishnajewellersjajpur.com --password "NewPass@123"
 *
 * OPTIONS
 *   --email <e>      Existing admin email (required)
 *   --password <p>   New password, min 6 chars (required)
 *   --api <url>      Also verify login through the API after resetting
 *                     (default: http://localhost:3001/api/v1 ; pass --no-verify to skip)
 *   --no-verify      Skip the login check, just reset the password in the DB
 *
 * This only updates the password for an email that ALREADY EXISTS. It does not
 * create new users and does not change the role. Use create-admin.js for a new user.
 */

const fs = require('fs');
const path = require('path');

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
const API = String(args.api || 'http://localhost:3001/api/v1').replace(/\/+$/, '');
const NO_VERIFY = !!args['no-verify'];

const c = { g: '\x1b[32m', r: '\x1b[31m', y: '\x1b[33m', d: '\x1b[2m', x: '\x1b[0m' };
const ok = (m) => console.log(`  ${c.g}✔${c.x} ${m}`);
const bad = (m) => console.log(`  ${c.r}✘ ${m}${c.x}`);
const info = (m) => console.log(`  ${c.d}${m}${c.x}`);

if (!EMAIL || !PASSWORD) {
    console.error('Usage: node scripts/reset-password.js --email <existing-email> --password <new-password> [--no-verify] [--api URL]');
    process.exit(1);
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EMAIL)) { console.error('That does not look like a valid email address.'); process.exit(1); }
if (PASSWORD.length < 6) { console.error('Password must be at least 6 characters (the API rejects shorter ones at login).'); process.exit(1); }

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

async function call(method, url, { body, token } = {}) {
    const headers = {};
    if (body) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(API + url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const text = await res.text();
    let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    return { status: res.status, data };
}

(async () => {
    console.log('Krishna Jewellers - reset password\n1. Database');

    if (!loadEnv()) { bad('backend/.env not found - run this from inside the backend folder.'); process.exit(1); }
    if (!process.env.DATABASE_URL) { bad('DATABASE_URL is missing in backend/.env'); process.exit(1); }

    let PrismaClient, bcrypt;
    try {
        ({ PrismaClient } = require('@prisma/client'));
        bcrypt = require('bcrypt');
    } catch (e) {
        bad(`${e.message}\n      Run "npm install" and "npx prisma generate" inside backend/ first.`);
        process.exit(1);
    }

    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        ok('Connected to database');

        const user = await prisma.adminUser.findUnique({ where: { email: EMAIL } });
        if (!user) {
            bad(`No admin user with email ${EMAIL}`);
            const all = await prisma.adminUser.findMany({ select: { email: true, role: true } });
            if (all.length) info('Existing admin emails: ' + all.map((u) => u.email).join(', '));
            else info('There are no admin users in this database at all.');
            process.exit(1);
        }

        const passwordHash = await bcrypt.hash(PASSWORD, 10);
        await prisma.adminUser.update({ where: { email: EMAIL }, data: { passwordHash } });
        ok(`Password updated for ${EMAIL} (role stays ${user.role})`);
    } catch (e) {
        bad(`Database error: ${e.message.split('\n').slice(-3).join(' ').trim()}`);
        process.exit(1);
    } finally {
        await prisma.$disconnect().catch(() => { });
    }

    if (NO_VERIFY) {
        console.log(`\nDone. Sign in at the admin dashboard with:\n   email:    ${EMAIL}\n   password: (the one you just set)`);
        return;
    }

    console.log('\n2. Login check (through the API)');
    try {
        const login = await call('POST', '/auth/login', { body: { email: EMAIL, password: PASSWORD } });
        if (login.status === 200 && login.data?.accessToken) {
            ok('Login with the new password succeeded');
            console.log(`\n${c.g}PASSWORD RESET AND VERIFIED.${c.x} Sign in with:\n   email:    ${EMAIL}\n   password: (the one you just set)`);
        } else {
            bad(`Login returned ${login.status}: ${JSON.stringify(login.data?.message || login.data)}`);
            info('The password WAS updated in the database - this failure means the running backend is likely pointed at a different database than backend/.env.');
            process.exit(1);
        }
    } catch (e) {
        bad(`Could not reach ${API} (${e.cause?.code || e.message})`);
        info('The password WAS updated in the database. Start the backend and try logging in, or re-run with --no-verify.');
    }
})();