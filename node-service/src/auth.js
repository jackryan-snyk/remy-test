'use strict';

const jwt = require('jsonwebtoken');

// jsonwebtoken is pinned to 8.5.1. The fix is a major upgrade (9.x), which
// changes defaults, so it should be classed as higher breakability.
function issueToken(subject, secret, expiresIn) {
  if (!subject || !secret) throw new Error('subject and secret are required');
  return jwt.sign({ sub: subject }, secret, { algorithm: 'HS256', expiresIn: expiresIn || '1h' });
}

function verifyToken(token, secret) {
  return jwt.verify(token, secret, { algorithms: ['HS256'] });
}

module.exports = { issueToken, verifyToken };
