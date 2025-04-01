// generateSecret.js
const crypto = require('crypto');

// Generate a 64-byte random string and convert it to hex
const secret = crypto.randomBytes(64).toString('hex');

// Print the generated secret
console.log(secret);
