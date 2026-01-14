#!/usr/bin/env node

import { parseAndExecute } from './cli';

/**
 * Main entry point
 */
async function main() {
  try {
    const exitCode = await parseAndExecute(process.argv.slice(2));
    process.exit(exitCode);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
