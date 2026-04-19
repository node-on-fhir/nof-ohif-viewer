#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const EXTENSION_DIR = path.resolve(__dirname, '..');
const VIEWERS_ROOT = path.resolve(EXTENSION_DIR, '../..');
const MODES_DIR = path.join(VIEWERS_ROOT, 'modes');
const MODE_TARGET = path.join(MODES_DIR, 'node-on-fhir');
const MODE_SOURCE = path.join(EXTENSION_DIR, 'mode');
const PLUGIN_CONFIG = path.join(VIEWERS_ROOT, 'platform', 'app', 'pluginConfig.json');

const EXTENSION_ENTRY = {
  packageName: '@ohif/extension-nof-ohif-viewer',
  version: '0.0.1',
};

const MODE_ENTRY = {
  packageName: 'node-on-fhir',
};

// ---------------------------------------------------------------------------
// 1. Copy mode
// ---------------------------------------------------------------------------

function copyMode() {
  if (fs.existsSync(MODE_TARGET)) {
    console.log('[skip] modes/node-on-fhir/ already exists');
    return false;
  }

  if (!fs.existsSync(MODE_SOURCE)) {
    console.error('[error] mode/ directory not found in extension — cannot copy');
    process.exit(1);
  }

  fs.cpSync(MODE_SOURCE, MODE_TARGET, { recursive: true });
  console.log('[done] Copied mode/ → modes/node-on-fhir/');
  return true;
}

// ---------------------------------------------------------------------------
// 2. Patch pluginConfig.json
// ---------------------------------------------------------------------------

function patchPluginConfig() {
  if (!fs.existsSync(PLUGIN_CONFIG)) {
    console.error('[error] pluginConfig.json not found at ' + PLUGIN_CONFIG);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(PLUGIN_CONFIG, 'utf8'));
  let changed = false;

  // Ensure arrays exist
  if (!Array.isArray(config.extensions)) config.extensions = [];
  if (!Array.isArray(config.modes)) config.modes = [];

  // Add extension entry if missing
  const hasExtension = config.extensions.some(
    e => e.packageName === EXTENSION_ENTRY.packageName
  );
  if (!hasExtension) {
    config.extensions.push(EXTENSION_ENTRY);
    console.log('[done] Added extension entry to pluginConfig.json');
    changed = true;
  } else {
    console.log('[skip] Extension entry already in pluginConfig.json');
  }

  // Add mode entry if missing
  const hasMode = config.modes.some(
    m => m.packageName === MODE_ENTRY.packageName
  );
  if (!hasMode) {
    config.modes.push(MODE_ENTRY);
    console.log('[done] Added mode entry to pluginConfig.json');
    changed = true;
  } else {
    console.log('[skip] Mode entry already in pluginConfig.json');
  }

  if (changed) {
    fs.writeFileSync(PLUGIN_CONFIG, JSON.stringify(config, null, 2) + '\n');
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log('');
console.log('ohif-viewer extension setup');
console.log('==========================');
console.log('');

copyMode();
patchPluginConfig();

console.log('');
console.log('Next steps:');
console.log('  cd ' + VIEWERS_ROOT);
console.log('  yarn install');
console.log('  yarn dev');
console.log('');
