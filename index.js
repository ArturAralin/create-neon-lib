#!/usr/bin/env node

if (process.env.NODE_ENV === 'dev') {
  // This lib must be loaded only into dev mode
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('ts-node').register({
    dir: __dirname,
  });

  require('./src/cli');

  return;
}

require('./dist/cli');
