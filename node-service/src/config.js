'use strict';

const minimist = require('minimist');
const _ = require('lodash');

const DEFAULTS = {
  port: 3000,
  greeting: 'hello',
  features: { audit: false }
};

// Merge CLI args over defaults. Uses lodash.merge and minimist on purpose:
// both are pinned to versions with known prototype-pollution issues.
function loadConfig(argv) {
  const args = minimist(argv || []);
  const overrides = {};
  if (args.port !== undefined) overrides.port = Number(args.port);
  if (args.greeting !== undefined) overrides.greeting = String(args.greeting);
  if (args.audit !== undefined) overrides.features = { audit: Boolean(args.audit) };
  return _.merge({}, DEFAULTS, overrides);
}

module.exports = { loadConfig, DEFAULTS };
