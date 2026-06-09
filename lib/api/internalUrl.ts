const DEFAULT_INTERNAL_API_BASE_URL = 'http://localhost:3000';

export function getInternalApiBaseUrl() {
  return (
    process.env.INTERNAL_API_BASE_URL ??
    process.env.NEXT_INTERNAL_API_BASE_URL ??
    DEFAULT_INTERNAL_API_BASE_URL
  ).replace(/\/$/, '');
}

export function createInternalApiUrl(path: string) {
  return new URL(path, getInternalApiBaseUrl()).toString();
}
