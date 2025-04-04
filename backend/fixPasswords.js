const bcrypt = require("bcryptjs");
const mysql = require("mysql2");

// ✅ Connect to the Database
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Mamamouad76@",
  database: "salonbooking",
});

// ✅ Function to Hash and Update Passwords
async function fixPasswords() {
  const [users] = await db.promise().query("SELECT id, password FROM users WHERE password NOT LIKE '$2b$%'");

  for (let user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await db.promise().query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, user.id]);
    console.log(`✅ Fixed password for user ID: ${user.id}`);
  }

  console.log("🎉 All unhashed passwords are now secured!");
  db.end();
}

// ✅ Run the Function
fixPasswords().catch(console.error);
