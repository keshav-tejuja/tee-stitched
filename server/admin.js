#!/usr/bin/env node

/**
 * Admin Setup Script
 * Run this to set a user as admin without needing a database
 * Usage: node admin.js
 */

const { db } = require('./database');

console.log('\n=== Admin Setup Script ===\n');

// Fetch all current users
const allUsers = [...db.users.findAll()];

if (allUsers.length === 0) {
  console.log('No users found. Please register a user first in the application.\n');
  process.exit(0);
}

console.log('Current Users:');
console.log('─'.repeat(50));

allUsers.forEach((user, index) => {
  console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
});

console.log('─'.repeat(50));
console.log('\n⚠️  NOTE: This is a demo script for hardcoded in-memory data.');
console.log('To make a user admin, edit server/database.js and change their role to "admin".\n');

// Example:
console.log('Example - Edit server/database.js and add admin setup:');
console.log('```javascript');
console.log('const adminUser = db.users.findByEmail("your@email.com");');
console.log('if (adminUser) {');
console.log('  adminUser.role = "admin";');
console.log('}');
console.log('```\n');

process.exit(0);
