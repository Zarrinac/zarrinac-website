#!/usr/bin/env node
/**
 * Build-time malware integrity guard.
 *
 * Runs on EVERY `npm run build` via the package.json "prebuild" hook, so the
 * check travels WITH the repo and cannot be bypassed by a stale, hand-synced
 * server deploy.sh (the exact gap that let the 2026-06 payload sit on this
 * replica's origin/main for weeks). It fails the build (exit 1) if a known
 * malware signature appears in a build-time config file — the proven injection
 * surface for the obfuscated blockchain-C2 / EtherHiding loader found in
 * postcss.config.mjs.
 *
 * This is the in-repo backstop; ops/deploy.sh keeps its own post-pull scan.
 * See the postcss-malware runbook / memory for context and IOCs.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Build-time config files executed by next/webpack during `next build`.
const TARGETS = ['postcss.config.mjs', 'next.config.ts', 'next.config.mjs', 'next.config.js'];

// Signatures of the obfuscated loader (mirrors the ops/deploy.sh scan).
const SIGNATURES = [
  /createRequire\s*\(/,
  /_\$_/,
  /\beval\s*\(/,
  /Buffer\.from\([^)]*base64/,
  /global\.[A-Za-z_$]+\s*=/,
];

const hits = [];
for (const rel of TARGETS) {
  let src;
  try {
    src = readFileSync(join(ROOT, rel), 'utf8');
  } catch {
    continue; // not every repo has every config variant
  }
  for (const sig of SIGNATURES) {
    if (sig.test(src)) hits.push(`${rel} :: matched ${sig}`);
  }
}

if (hits.length > 0) {
  console.error('\n\x1b[31m[build-guard] ABORT — suspicious signature(s) in build config:\x1b[0m');
  for (const h of hits) console.error(`  • ${h}`);
  console.error(
    '[build-guard] Possible malware injection. Build halted. See the postcss-malware runbook.\n',
  );
  process.exit(1);
}

console.log('[build-guard] build config clean.');
