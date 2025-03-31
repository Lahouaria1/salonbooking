const bcrypt = require("bcryptjs");

// Function to hash a password
async function hashPassword(plainText) {
  try {
    const hashed = await bcrypt.hash(plainText, 10);
    console.log(`Plain: ${plainText} → Hashed: ${hashed}`);
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}

// Run the function with an example password
hashPassword("password123"); // Change this to the password you want to hash
