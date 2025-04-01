const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Ensure JWT_SECRET is set in your .env file

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// ✅ Test MySQL Connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error connecting to the database:", err);
  } else {
    console.log("✅ Successfully connected to the database.");
    connection.release(); // Release the connection back to the pool
  }
});

// ✅ Middleware to protect routes
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

// ✅ User Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "❌ Missing username or password" });

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

// ✅ User Login (Returns JWT Token)
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";

  db.execute(query, [username], async (err, rows) => {
    if (err) return res.status(500).json({ message: "❌ Database error", error: err });
    if (rows.length === 0) return res.status(401).json({ message: "❌ Invalid username or password" });

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
      res.json({ message: "✅ Login successful", token, userId: user.id });
    } else {
      res.status(401).json({ message: "❌ Invalid credentials" });
    }
  });
});

// ✅ Serve Static Frontend (Optional)
// If you want to serve static files (like index.html) from a public folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Welcome Route (Default Homepage) - You can modify this route or remove it based on your preference
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Salon Booking API!" });
});

// ✅ Get All Appointments (Requires Token)
app.get("/appointments", verifyToken, (req, res) => {
  db.execute("SELECT * FROM appointments", (err, rows) => {
    if (err) return res.status(500).json({ message: "❌ Error fetching appointments", error: err });
    res.json(rows);
  });
});

// ✅ Book an Appointment (Requires Token)
app.post("/appointments", verifyToken, (req, res) => {
  const { service, appointment_date } = req.body;
  if (!service || !appointment_date) return res.status(400).json({ message: "❌ Missing required fields" });

  db.execute(
    "INSERT INTO appointments (user_id, service, appointment_date, status) VALUES (?, ?, ?, 'pending')",
    [req.user.id, service, appointment_date],
    (err, result) => {
      if (err) return res.status(500).json({ message: "❌ Error creating appointment", error: err });
      res.status(201).json({ message: "✅ Appointment booked successfully", appointmentId: result.insertId });
    }
  );
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
