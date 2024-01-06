// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const config = require('./esbuild.config');
const { build } = require('esbuild');

const options = {
  entryPoints: ['src/**/*.ts'],
  platform: 'neutral',
  target: 'node20',
  format: 'cjs',
  outdir: '.esbuild/.build',
  ...config(),
};

console.log('Initializing...');
build(options)
  .then(results => {
    console.log('Build complete');
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
