const crypto = require('crypto');

// Generate a random 64-byte (512-bit) secret
const secret = crypto.randomBytes(64).toString('hex');

console.log('\n=== JWT Secret Generated ===\n');
console.log(secret);
console.log('\n=== Add this to your .env file ===\n');
console.log(`JWT_SECRET=${secret}\n`);

