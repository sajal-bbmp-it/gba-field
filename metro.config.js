const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { envCacheKey } = require('./scripts/appEnv');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  // .env values are inlined at transform time, so a changed env must bust the cache.
  cacheVersion: envCacheKey(),
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
