'use strict';

const http = require('http');
const { loadConfig } = require('./config');

function createServer(config) {
  return http.createServer((req, res) => {
    if (req.url === '/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, greeting: config.greeting }));
      return;
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false }));
  });
}

if (require.main === module) {
  const config = loadConfig(process.argv.slice(2));
  createServer(config).listen(config.port, () => {
    console.log(`listening on ${config.port}`);
  });
}

module.exports = { createServer };
