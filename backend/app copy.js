const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const he = require("he");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = 3000;

// ✅ CORS Configuration
const corsOptions = {
  origin: "http://127.0.0.1:5500", // Update to match your frontend's origin
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Handle Preflight Requests

// ✅ Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Log All Requests (for debugging)
app.use((req, res, next) => {
  console.log(`[${req.method}] Request to ${req.url}`, req.body);
  next();
});

// ✅ Database Connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test Database Connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error connecting to MySQL:", err);
    return;
  }
  console.log("✅ Connected to MySQL!");
  connection.release();
});

// ✅ Welcome Route
app.get("/", (req, res) => {
  res.send("Welcome to the Salon Booking API with Authentication & Security!");
});

// ✅ User Authentication - Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "❌ Missing username or password" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.execute(query, [username, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ message: "❌ Error registering user", error: err });
      res.status(201).json({ message: "✅ User registered successfully", userId: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ message: "❌ Error hashing password", error: err });
  }
});

// ✅ User Authentication - Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";
  db.execute(query, [username], async (err, rows) => {
    if (err) return res.status(500).json({ message: "❌ Database error", error: err });
    if (rows.length === 0) return res.status(401).json({ message: "❌ Invalid username or password" });

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      res.json({ message: `✅ Welcome, ${username}!` });
    } else {
      res.status(401).json({ message: "❌ Invalid credentials" });
    }
  });
});

// ✅ Prevent XSS Attacks
app.get("/messages", (req, res) => {
  const msg = he.encode(req.query.msg || "No message provided.");
  res.send(`<h1>Your Messages</h1><p>${msg}</p>`);
});

// ✅ Get All Users
app.get("/users", (req, res) => {
  db.execute("SELECT * FROM users", (err, rows) => {
    if (err) return res.status(500).json({ message: "❌ Error fetching users", error: err });
    res.json(rows);
  });
});

// ✅ Get All Appointments
app.get("/appointments", (req, res) => {
  db.execute("SELECT * FROM appointments", (err, rows) => {
    if (err) return res.status(500).json({ message: "❌ Error fetching appointments", error: err });
    res.json(rows);
  });
});

// ✅ Create Appointment
app.post("/appointments", (req, res) => {
  const { user_id, service, appointment_date } = req.body;
  if (!user_id || !service || !appointment_date) {
    return res.status(400).json({ message: "❌ Missing required fields" });
  }

  db.execute(
    "INSERT INTO appointments (user_id, service, appointment_date, status) VALUES (?, ?, ?, 'pending')",
    [user_id, service, appointment_date],
    (err, result) => {
      if (err) return res.status(500).json({ message: "❌ Error creating appointment", error: err });
      res.status(201).json({ message: "✅ Appointment created", appointmentId: result.insertId });
    }
  );
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
