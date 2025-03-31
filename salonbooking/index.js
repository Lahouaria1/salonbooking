// const express = require("express");
// const bodyParser = require("body-parser");
// const mysql = require("mysql");
// const bcrypt = require("bcryptjs");


// const dotenv = require("dotenv");
// const he = require("he");

// dotenv.config();  // Load environment variables from .env file
// const app = express();
// const port = 3000;

// // Middleware to parse incoming requests
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // MySQL Database Connection
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ Error connecting to MySQL:", err);
//     return;
//   }
//   console.log("✅ Connected to MySQL!");
// });

// // Route for the homepage
// app.get("/", (req, res) => {
//   res.send(`
//     <h1>Welcome to the Secure Application!</h1>
//     <form action="/login" method="POST">
//       <label for="username">Username:</label>
//       <input type="text" id="username" name="username" required>
//       <label for="password">Password:</label>
//       <input type="password" id="password" name="password" required>
//       <button type="submit">Login</button>
//     </form>
//   `);
// });

// // Route for login
// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   // Use parameterized query to prevent SQL Injection
//   const query = "SELECT * FROM users WHERE username = ?";
//   db.query(query, [username], (err, rows) => {
//     if (err) return res.send("❌ Error in database query: " + err);

//     // If user exists, compare the hashed password
//     if (rows.length > 0 && bcrypt.compareSync(password, rows[0].password)) {
//       res.send(`✅ Welcome <b>${username}</b>, you are logged in!`);
//     } else {
//       res.send("❌ Invalid credentials.");
//     }
//   });
// });

// // Route for messages with XSS prevention
// app.get("/messages", (req, res) => {
//   const msg = he.encode(req.query.msg || "No message provided.");
//   res.send(`<h1>Your Messages</h1><p>${msg}</p>`);
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`✅ Server is running on http://localhost:${port}`);
// });
