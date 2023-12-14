// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const config = require('./esbuild.config');
const { build } = require('esbuild');
const omitBy = require('lodash/omitBy');

const options = {
  entryPoints: ['serverless-dynamic.ts', 'src/**/*.ts'],
  platform: 'neutral',
  target: 'node16',
  format: 'cjs',
  outdir: '.esbuild/.build',
  ...omitBy(config(), (_, key) => {
    return key === 'watch';
  }),
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
