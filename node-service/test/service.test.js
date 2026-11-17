'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { loadConfig, DEFAULTS } = require('../src/config');
const { issueToken, verifyToken } = require('../src/auth');
const { buildStatusUrl, getStatus } = require('../src/client');
const { createServer } = require('../src/index');

test('loadConfig returns defaults with no args', () => {
  assert.deepStrictEqual(loadConfig([]), DEFAULTS);
});

test('loadConfig applies CLI overrides', () => {
  const cfg = loadConfig(['--port', '8080', '--greeting', 'hi', '--audit']);
  assert.strictEqual(cfg.port, 8080);
  assert.strictEqual(cfg.greeting, 'hi');
  assert.strictEqual(cfg.features.audit, true);
});

test('loadConfig does not mutate defaults', () => {
  loadConfig(['--greeting', 'changed']);
  assert.strictEqual(DEFAULTS.greeting, 'hello');
});

test('issueToken and verifyToken round-trip', () => {
  const token = issueToken('user-1', 'test-secret');
  const decoded = verifyToken(token, 'test-secret');
  assert.strictEqual(decoded.sub, 'user-1');
});

test('verifyToken rejects a wrong secret', () => {
  const token = issueToken('user-1', 'test-secret');
  assert.throws(() => verifyToken(token, 'other-secret'));
});

test('issueToken requires subject and secret', () => {
  assert.throws(() => issueToken('', 'test-secret'));
});

test('buildStatusUrl builds the status path', () => {
  assert.strictEqual(buildStatusUrl('http://localhost:3000'), 'http://localhost:3000/status');
});

test('getStatus reads JSON from the server', async () => {
  const server = createServer({ greeting: 'hello' });
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  try {
    const body = await getStatus(`http://127.0.0.1:${port}`);
    assert.deepStrictEqual(body, { ok: true, greeting: 'hello' });
  } finally {
    server.close();
  }
});
