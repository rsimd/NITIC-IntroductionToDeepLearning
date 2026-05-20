const path = require('path');
const fs = require('fs');
const express = require('express');
const getPort = require('get-port');
const compression = require('compression');
const morgan = require('morgan');
const { createRequestHandler } = require('@remix-run/express');
const { installGlobals } = require('@remix-run/node');

installGlobals();

function findUpContaining(startDir, relativeFile) {
  let current = path.resolve(startDir);
  while (true) {
    const candidate = path.join(current, relativeFile);
    if (fs.existsSync(candidate)) return path.dirname(candidate);
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

const LOCAL_BUILD_DIR = path.resolve(__dirname, 'build');
const LOCAL_PUBLIC_BUILD_DIR = path.resolve(__dirname, 'public/build');
const PROJECT_DEMOS_DIR = findUpContaining(__dirname, 'demos/activation_functions_viewer.html');
const GENERATED_BUILD_DIR = path.resolve(__dirname, '../../_build/templates/site/myst/book-theme/build');
const ASSETS_DIR = fs.existsSync(path.join(LOCAL_PUBLIC_BUILD_DIR, 'entry.client-PCJPW7TK.js'))
  ? LOCAL_PUBLIC_BUILD_DIR
  : LOCAL_BUILD_DIR;
const BUILD_DIR = fs.existsSync(path.join(LOCAL_BUILD_DIR, 'index.js'))
  ? LOCAL_BUILD_DIR
  : GENERATED_BUILD_DIR;

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use('/myst_assets_folder', express.static(ASSETS_DIR, { immutable: true, maxAge: '1y' }));

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static(PROJECT_DEMOS_DIR, {
  maxAge: 0,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store');
  },
}));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));

app.use(morgan('tiny'));

app.all(
  '*',
  createRequestHandler({
    build: require(BUILD_DIR),
    mode: process.env.NODE_ENV,
  }),
);

async function start() {
  // Find an open port if the env is not specified
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || (await getPort({ port: getPort.makeRange(3000, 3100) }));
  app.listen(port, host, () => {
    console.log(`Server started at http://${host}:${port}`);
  });
}

start();
