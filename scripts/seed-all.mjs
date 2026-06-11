/* eslint-disable no-console */
import { spawnSync } from 'node:child_process';

// Orchestrates all DB seeds in sequence.
//
// Why this exists instead of a plain `a && b && c` npm chain: on Windows + Node,
// the tsx + @prisma/adapter-pg + pg Pool teardown intermittently terminates a
// seed process with a NON-ZERO exit code AFTER the seed work has already
// committed (the "... complete." line prints, then the native teardown crashes).
// A naive `&&` chain aborts on that benign exit code and silently skips the
// remaining seeds. This runner keys success off each seed's completion sentinel
// rather than the process exit code, so a real failure (no sentinel) still fails
// the run while a benign post-commit teardown crash does not.

const SEEDS = [
  { name: 'products', file: 'scripts/seed-products.ts', done: 'Seed complete.' },
  { name: 'dcode', file: 'scripts/seed-dcode.ts', done: "D'code seed complete." },
  {
    name: 'locations',
    file: 'scripts/seed-iran-locations.ts',
    done: 'Iran locations seed complete.',
  },
  {
    name: 'downloads',
    file: 'scripts/seed-download-assets.ts',
    done: 'Download assets seed complete.',
  },
  {
    name: 'representatives',
    file: 'scripts/seed-service-representatives.ts',
    done: 'Service representatives seed complete.',
  },
];

let failed = false;

for (const seed of SEEDS) {
  console.log(`\n=== Seeding: ${seed.name} ===`);
  const result = spawnSync('npx', ['tsx', seed.file], { encoding: 'utf8', shell: true });
  process.stdout.write(result.stdout ?? '');
  if (result.stderr) process.stderr.write(result.stderr);

  const completed = (result.stdout ?? '').includes(seed.done);
  if (!completed) {
    console.error(`✗ Seed "${seed.name}" did not report completion — FAILED.`);
    failed = true;
    break;
  }
  if (result.status !== 0) {
    console.warn(
      `… Seed "${seed.name}" completed but the process exited ${result.status} ` +
        `(benign pg-adapter teardown). Continuing.`,
    );
  } else {
    console.log(`✓ Seed "${seed.name}" complete.`);
  }
}

if (failed) {
  console.error('\nSeeding FAILED.');
  process.exit(1);
}
console.log('\nAll seeds complete.');
process.exit(0);
