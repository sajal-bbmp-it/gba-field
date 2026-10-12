/**
 * Build-time environment loader shared by babel.config.js and metro.config.js.
 * Reads .env.<APP_ENV> (local | test | prod) from the project root.
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const ROOT = path.join(__dirname, '..');
const APP_ENVS = ['local', 'test', 'prod'];
/** Variables the app may read via process.env; everything else stays out of the bundle. */
const ENV_KEYS = ['APP_ENV', 'ENV_LABEL', 'API_BASE_URL', 'API_TIMEOUT_MS', 'APP_VERSION'];

// Captured once: babel.config.js writes the loaded values back into process.env.
const SHELL_APP_ENV = process.env.APP_ENV;

const envFile = appEnv => path.join(ROOT, `.env.${appEnv}`);
const PACKAGE_JSON = path.join(ROOT, 'package.json');

/** The app version shown in the UI. */
const appVersion = () => JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8')).version;

/**
 * APP_ENV from the shell wins; otherwise release bundles get prod and everything
 * else (debug, Jest) gets local.
 */
function resolveAppEnv(isProductionBuild) {
  const requested = SHELL_APP_ENV;
  if (requested) {
    if (!APP_ENVS.includes(requested)) {
      throw new Error(`APP_ENV must be one of ${APP_ENVS.join(', ')}; got "${requested}"`);
    }
    return requested;
  }
  return isProductionBuild ? 'prod' : 'local';
}

/** Values from .env.<appEnv>, plus APP_ENV itself. */
function loadEnv(appEnv) {
  const file = envFile(appEnv);
  if (!fs.existsSync(file)) {
    throw new Error(`Missing ${path.basename(file)} for APP_ENV=${appEnv}; copy .env.example`);
  }
  return { ...dotenv.parse(fs.readFileSync(file)), APP_ENV: appEnv, APP_VERSION: appVersion() };
}

/** Changes whenever APP_ENV, any .env.* file or the app version changes; keys Metro's cache. */
function envCacheKey() {
  const hash = crypto.createHash('sha1');
  hash.update(SHELL_APP_ENV ?? '');
  hash.update(appVersion());
  for (const appEnv of APP_ENVS) {
    const file = envFile(appEnv);
    hash.update(fs.existsSync(file) ? fs.readFileSync(file) : '');
  }
  return hash.digest('hex').slice(0, 12);
}

module.exports = { APP_ENVS, ENV_KEYS, resolveAppEnv, loadEnv, envCacheKey, envFile, appVersion };
