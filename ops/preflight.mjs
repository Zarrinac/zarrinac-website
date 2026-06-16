#!/usr/bin/env node
// Server-side deploy preflight for zarrinac.com.
// Validates production identity without printing secret values.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';

const APP_DIR = process.env.ZARRINAC_APP_DIR || process.cwd();
const ENV_FILE = process.env.ZARRINAC_ENV_FILE || path.join(APP_DIR, '.env');
const ALLOWED_DB_HOSTS = new Set(['172.17.0.10', 'nexzarrin']);
const ALLOWED_SSL_MODES = new Set(['require', 'verify-full', 'no-verify']);
const EXPECTED_DB_NAME = 'zarrin';
const EXPECTED_SITE_ID = 'zarrinac';
const EXPECTED_SITE_URL = 'https://zarrinac.com';

const errors = [];
const warnings = [];

function parseEnvFile(filePath) {
  const env = {};
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    let value = match[2].trim();
    const quote = value[0];
    if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }

  return env;
}

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function checkFile(label, filePath) {
  if (!existsSync(filePath)) addError(`${label} missing: ${filePath}`);
}

function parseDatabaseUrl(value) {
  try {
    return new URL(value);
  } catch {
    addError('DATABASE_URL is not a valid URL');
    return null;
  }
}

function checkTcp(host, port, timeoutMs = 2500) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const done = (ok) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
  });
}

console.log(`Preflight app dir: ${APP_DIR}`);

checkFile('.env', ENV_FILE);
checkFile('ecosystem.config.cjs', path.join(APP_DIR, 'ecosystem.config.cjs'));
checkFile('package.json', path.join(APP_DIR, 'package.json'));
checkFile('ops/deploy.sh', path.join(APP_DIR, 'ops', 'deploy.sh'));

let env = {};
if (existsSync(ENV_FILE)) {
  env = parseEnvFile(ENV_FILE);
}

const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  addError('DATABASE_URL is missing');
} else {
  const parsed = parseDatabaseUrl(databaseUrl);
  if (parsed) {
    const dbName = parsed.pathname.replace(/^\//, '');
    const sslMode = parsed.searchParams.get('sslmode');

    if (!ALLOWED_DB_HOSTS.has(parsed.hostname)) {
      addError(`DATABASE_URL host must be nexzarrin/172.17.0.10, got ${parsed.hostname}`);
    }
    if (dbName !== EXPECTED_DB_NAME) {
      addError(`DATABASE_URL database must be ${EXPECTED_DB_NAME}, got ${dbName || '(empty)'}`);
    }
    if (parsed.hostname !== 'localhost' && !sslMode) {
      addWarning('DATABASE_URL should include sslmode for the remote nexzarrin DB');
    }
    if (sslMode && !ALLOWED_SSL_MODES.has(sslMode)) {
      addWarning(`DATABASE_URL sslmode is ${sslMode}; expected require, verify-full, or no-verify`);
    }

    const port = Number(parsed.port || 5432);
    const dbReachable = await checkTcp(parsed.hostname, port);
    if (!dbReachable) {
      addError(`Cannot open TCP connection to PostgreSQL at ${parsed.hostname}:${port}`);
    }
  }
}

const siteId = env.NEXT_PUBLIC_SITE_ID || process.env.NEXT_PUBLIC_SITE_ID;
if (siteId !== EXPECTED_SITE_ID) {
  addError(`NEXT_PUBLIC_SITE_ID must be ${EXPECTED_SITE_ID}, got ${siteId || '(missing)'}`);
}

const siteUrl = (env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '').replace(
  /\/+$/,
  '',
);
if (siteUrl !== EXPECTED_SITE_URL) {
  addError(`NEXT_PUBLIC_SITE_URL must be ${EXPECTED_SITE_URL}, got ${siteUrl || '(missing)'}`);
}

for (const key of ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'ADMIN_SESSION_SECRET']) {
  if (!(env[key] || process.env[key])) addError(`${key} is missing`);
}

try {
  const branch = execFileSync('git', ['branch', '--show-current'], {
    cwd: APP_DIR,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
  if (branch && branch !== 'main')
    addWarning(`current git branch is ${branch}, expected main on server`);
} catch {
  addWarning('could not read git branch');
}

for (const warning of warnings) console.log(`WARN: ${warning}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log('Preflight OK: zarrinac app identity and nexzarrin DB target are valid.');
