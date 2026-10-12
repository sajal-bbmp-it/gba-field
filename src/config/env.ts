// Values come from .env.<APP_ENV> and are baked into the bundle at build time
// (babel.config.js + scripts/appEnv.js). Each `process.env.X` must stay a
// literal member expression so the inline plugin can replace it.

export const APP_ENV = process.env.APP_ENV || 'local';
export const ENV_LABEL = process.env.ENV_LABEL || '';
export const APP_VERSION = process.env.APP_VERSION || '';
export const API_TIMEOUT_MS = Number(process.env.API_TIMEOUT_MS) || 20000;

function resolveApiBaseUrl(): string {
  const url = process.env.API_BASE_URL;
  if (!url) {
    throw new Error(
      `API_BASE_URL is not configured. Set it in .env.${APP_ENV} (see .env.example).`,
    );
  }
  // Drop any trailing slash: paths like "/uploads/…" are appended by hand.
  return url.replace(/\/+$/, '');
}

export const API_BASE_URL = resolveApiBaseUrl();
// Host (+ any sub-path) shown in the build watermark.
export const API_HOST = API_BASE_URL.replace(/^https?:\/\//, '');
export const IS_UNCONFIGURED = API_BASE_URL.toLowerCase().includes('change-me');
