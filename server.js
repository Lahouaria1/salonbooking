// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');

// const app = express();
// app.use(express.json()); // Allow JSON requests
// app.use(cors()); // Enable CORS

// // Database connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Mamamouad76@", // Your MySQL password
//   database: "salonbooking"
// });

// db.connect(err => {
//   if (err) {
//     console.error("Database connection error:", err);
//   } else {
//     console.log("✅ Connected to MySQL database!");
//   }
// });

// // ✅ GET all appointments (For Postman GET request)
// app.get('/api/appointments', (req, res) => {
//   const query = "SELECT * FROM appointments";
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: "Database error", error: err });
//     }
//     res.json(results);
//   });
// });

// // ✅ POST a new appointment (For Postman POST request)
// app.post('/api/appointments', (req, res) => {
//   const { user_id, service, appointment_date, status } = req.body;

//   if (!user_id || !service || !appointment_date) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const query = "INSERT INTO appointments (user_id, service, appointment_date, status) VALUES (?, ?, ?, ?)";
//   db.query(query, [user_id, service, appointment_date, status || 'pending'], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "Database error", error: err });
//     }
//     res.status(201).json({ message: "Appointment created", appointment_id: result.insertId });
//   });
// });

// // Start server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
