import type { NextConfig } from 'next';
import siteConfig from './next.config.site';

// Docker-only overlay on top of the repo's real next.config.ts.
//
// The image is built as a faithful copy of what runs on zarrin-ng-site, so the
// site config (the 308 forwards to hisense-ir.com / dcode.co.ir, the security
// headers, the image remotePatterns) must NOT be edited for Docker. Instead the
// Dockerfile renames next.config.ts -> next.config.site.ts and drops this file
// in its place, adding the single thing a container needs: `output: 'standalone'`,
// which emits a self-contained .next/standalone/server.js with only the traced
// runtime deps — a ~200 MB image instead of ~2 GB of node_modules.
//
// The spread preserves everything withNextIntl() produced (redirects, headers,
// images, and the plugin's own turbopack/webpack wiring), so container behaviour
// is byte-identical to the PM2 deploy apart from the output mode.
const config: NextConfig = {
  ...siteConfig,
  output: 'standalone',
};

export default config;
