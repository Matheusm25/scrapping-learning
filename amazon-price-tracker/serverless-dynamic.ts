/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const YAML = require('yamljs');
const files = fs.readdirSync('./src/handlers');

module.exports = async () => {
  const rawEnv = fs.readFileSync('./.env', { encoding: 'utf8' });
  const vars = rawEnv
    .split('\r')
    .join('')
    .split('\n')
    .filter(line => !line.startsWith('#'));
  for (const line of vars) {
    const [key, value] = line.split('=');
    process.env[key] = value;
  }

  const allFiles = files.map(f =>
    fs.readFileSync(`./src/handlers/${f}`, 'utf8'),
  );

  const schema = allFiles
    .map(raw => {
      const splited = raw.split('${env:');
      if (splited.length > 1) {
        const varName = splited[1].split('}')[0];
        const value = process.env[varName];
        raw = raw.split(`\${env:${varName}}`).join(value);
      }
      return raw;
    })
    .map(raw => YAML.parse(raw))
    .reduce((result, handler) => Object.assign(result, handler), {});

  return schema;
};
