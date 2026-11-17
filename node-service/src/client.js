'use strict';

const fetch = require('node-fetch');

// node-fetch is pinned to 2.6.0. The fix stays on 2.x (patch), so it should
// be classed as low breakability.
function buildStatusUrl(baseUrl) {
  const url = new URL('/status', baseUrl);
  return url.toString();
}

async function getStatus(baseUrl, fetchImpl) {
  const doFetch = fetchImpl || fetch;
  const res = await doFetch(buildStatusUrl(baseUrl));
  if (!res.ok) throw new Error(`status check failed: ${res.status}`);
  return res.json();
}

module.exports = { buildStatusUrl, getStatus };
