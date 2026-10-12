const { ENV_KEYS, resolveAppEnv, loadEnv } = require('./scripts/appEnv');

module.exports = api => {
  // Metro sets BABEL_ENV=production for release bundles.
  const env = loadEnv(resolveAppEnv(api.env('production')));
  // Expose the .env values so the inline plugin can bake them into the bundle.
  Object.assign(process.env, env);

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [['transform-inline-environment-variables', { include: ENV_KEYS }]],
  };
};
