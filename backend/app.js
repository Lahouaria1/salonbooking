const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise"); // Use promise-based mysql2
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database Connection Pool (Promise-based)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test DB connection only when not in test environment
if (process.env.NODE_ENV !== "test") {
  db.getConnection()
    .then((conn) => {
      console.log("✅ Successfully connected to the database.");
      conn.release();
    })
    .catch((err) => {
      console.error("❌ Error connecting to the database:", err);
    });
}

// JWT Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "❌ Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "❌ Invalid token." });
    req.user = decoded;
    next();
  });
};

// User Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "❌ Missing username or password" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    const [result] = await db.execute(query, [username, hashedPassword]);
    res.status(201).json({ message: "✅ User registered successfully", userId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "❌ Error registering user", error: err });
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";

  try {
    const [rows] = await db.execute(query, [username]);
    if (rows.length === 0) return res.status(401).json({ message: "❌ Invalid username or password" });

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
      res.json({ message: "✅ Login successful", token, userId: user.id });
    } else {
      res.status(401).json({ message: "❌ Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "❌ Database error", error: err });
  }
});

// Welcome Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Salon Booking API!" });
});

// Get Appointments (Protected)
app.get("/appointments", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM appointments");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "❌ Error fetching appointments", error: err });
  }
});

// Book Appointment (Protected)
app.post("/appointments", verifyToken, async (req, res) => {
  const { service, appointment_date } = req.body;
  if (!service || !appointment_date) return res.status(400).json({ message: "❌ Missing required fields" });

  try {
    const [result] = await db.execute(
      "INSERT INTO appointments (user_id, service, appointment_date, status) VALUES (?, ?, ?, 'pending')",
      [req.user.id, service, appointment_date]
    );
    res.status(201).json({ message: "✅ Appointment booked successfully", appointmentId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "❌ Error creating appointment", error: err });
  }
});

// Serve static files (Optional)
app.use(express.static(path.join(__dirname, "public")));

// Start server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
}

// Expose the DB connection pool for testing purposes
app.locals.db = db;

module.exports = app;
