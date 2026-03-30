/**
 * Utility script to manage admin access
 * This helps manage users in the in-memory database
 */

const { db } = require('./database');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║          TeeStitch - Admin Management Console              ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('📋 Registered Users:');
console.log('─────────────────────────────────────────────────────────────\n');

const users = db.users.findAll();
if (users.length === 0) {
  console.log('No users registered yet. Create one from the app first.\n');
} else {
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Loyalty Points: ${user.loyaltyPoints}`);
    console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}\n`);
  });
}

console.log('─────────────────────────────────────────────────────────────\n');

console.log('ℹ️  To make a user admin:\n');
console.log('Option 1: Edit server/database.js');
console.log('  - Find the users array');
console.log('  - Add code after user registration:\n');
console.log('    const user = db.users.findByEmail("email@example.com");');
console.log('    if (user) user.role = "admin";\n');

console.log('Option 2: Use the API');
console.log('  - Create endpoint in controllers/userController.js');
console.log('  - Add admin promotion route\n');

console.log('─────────────────────────────────────────────────────────────\n');

console.log('📊 Statistics:');
console.log(`   Total Users: ${users.length}`);
console.log(`   Admin Users: ${users.filter(u => u.role === 'admin').length}`);
console.log(`   Total Orders: ${db.orders.findAll().length}`);
console.log(`   Total Designs: ${users.reduce((sum, u) => sum + db.designs.findByUserId(u._id).length, 0)}\n`);

console.log('💡 Tip: You can edit server/database.js to auto-promote first user to admin.\n');
