// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const { nodeExternalsPlugin } = require('esbuild-node-externals');

module.exports = () => {
  return {
    minify: true,
    bundle: true,
    sourcemap: true,
    keepNames: true,
    external: ['fs', 'path'],
    plugins: [nodeExternalsPlugin()],
  };
};
